/**
 * db/queries.js
 * Centralized DB access layer (SQL lives here).
 * Keeps routes/scheduler free from raw SQL and makes queries easy to reuse & test.
 */
const { pool } = require("./pool");

/**
 * Fetch all configured origins (locations) ordered by rotation order.
 * Used by the frontend to populate the location dropdown.
 */
async function getOrigins() {
  const { rows } = await pool.query(
    `
    SELECT id, city, country, timezone, rotation_order, is_active, last_fetched_at
    FROM weather_origins
    ORDER BY rotation_order ASC
    `
  );
  return rows;
}

/**
 * Select the next origin to fetch based on:
 * 1) never fetched first (last_fetched_at IS NULL)
 * 2) oldest fetched next
 * 3) deterministic tie-breaker by rotation_order
 *
 * Uses the provided client to participate in the scheduler transaction.
 */
async function getNextOriginForRun(client) {
  const { rows } = await client.query(
    `
    SELECT id, city, country, latitude, longitude, timezone, rotation_order
    FROM weather_origins
    WHERE is_active = true
    ORDER BY last_fetched_at ASC NULLS FIRST, rotation_order ASC
    LIMIT 1
    `
  );
  return rows[0] ?? null;
}

/**
 * Bulk UPSERT of daily forecast rows for one origin.
 * Ensures no duplicates via UNIQUE(origin_id, date).
 */
async function upsertDailyResults(client, originId, dailyRows) {
  if (!Array.isArray(dailyRows) || dailyRows.length === 0) return;

  const values = [];
  const placeholders = [];
  let p = 1;

  for (const row of dailyRows) {
    placeholders.push(`($${p++}, $${p++}, $${p++}, $${p++})`);
    values.push(originId, row.date, row.temp_min, row.temp_max);
  }

  await client.query(
    `
    INSERT INTO weather_results (origin_id, date, temp_min, temp_max)
    VALUES ${placeholders.join(",")}
    ON CONFLICT (origin_id, date)
    DO UPDATE SET
      temp_min = EXCLUDED.temp_min,
      temp_max = EXCLUDED.temp_max,
      fetched_at = NOW()
    `,
    values
  );
}

/**
 * Read 7-day forecast for a specific origin.
 * Note: this returns what is currently stored in DB (may be empty until scheduler runs).
 */
async function getForecastDays(originId, limit = 7) {
  const { rows } = await pool.query(
    `
    SELECT date, temp_min, temp_max, fetched_at
    FROM weather_results
    WHERE origin_id = $1
    ORDER BY date ASC
    LIMIT $2
    `,
    [originId, limit]
  );
  return rows;
}

module.exports = {
  getOrigins,
  getNextOriginForRun,
  upsertDailyResults,
  getForecastDays,
};
