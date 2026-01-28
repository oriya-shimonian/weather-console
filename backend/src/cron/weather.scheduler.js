/**
 * cron/weather.scheduler.js
 * Hourly scheduler that:
 * 1) picks the next active origin (rotation)
 * 2) fetches a rolling 7-day forecast from Open-Meteo
 * 3) upserts daily results into Postgres
 * 4) updates last_fetched_at for stable rotation
 */
const cron = require("node-cron");
const { pool } = require("../db/pool");
const { getNextOriginForRun, upsertDailyResults } = require("../db/queries");
const { fetchWeeklyForecastDaily } = require("../services/openMeteo.service");

const LOCK_KEY = 424242; // prevents parallel scheduler runs in the same DB
const CRON_EXPRESSION = "0 * * * *"; // every hour at minute 00

/**
 * Runs one scheduler cycle (transactional).
 * Safe to call manually for debugging.
 */
async function runOnce() {
  const client = await pool.connect();
  let lockAcquired = false;

  try {
    await client.query("BEGIN");

    const lockRes = await client.query(
      "SELECT pg_try_advisory_lock($1) AS locked",
      [LOCK_KEY]
    );

    lockAcquired = Boolean(lockRes.rows?.[0]?.locked);
    if (!lockAcquired) {
      await client.query("ROLLBACK");
      return { skipped: true, reason: "lock_not_acquired" };
    }

    const origin = await getNextOriginForRun(client);
    if (!origin) {
      await client.query("ROLLBACK");
      return { skipped: true, reason: "no_active_origins" };
    }

    const dailyRows = await fetchWeeklyForecastDaily(origin);

    await upsertDailyResults(client, origin.id, dailyRows);

    await client.query(
      "UPDATE weather_origins SET last_fetched_at = NOW() WHERE id = $1",
      [origin.id]
    );

    await client.query("COMMIT");

    return {
      ok: true,
      originId: origin.id,
      city: origin.city,
      daysSaved: dailyRows.length,
    };
  } catch (err) {
    // Ensure DB state is clean
    try { await client.query("ROLLBACK"); } catch {}
    // Re-throw so caller can log consistently
    throw err;
  } finally {
    if (lockAcquired) {
      try { await client.query("SELECT pg_advisory_unlock($1)", [LOCK_KEY]); } catch {}
    }
    client.release();
  }
}

/**
 * Starts the hourly cron scheduler.
 */
function startWeatherScheduler() {
  cron.schedule(CRON_EXPRESSION, async () => {
    try {
      const result = await runOnce();
      console.log("[scheduler] completed:", result);
    } catch (err) {
      console.error("[scheduler] failed:", err?.message || err);
    }
  });
}

module.exports = { startWeatherScheduler, runOnce };
