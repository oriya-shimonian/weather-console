const OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast";
const TIMEOUT_MS = 10_000;
const MAX_ATTEMPTS = 3;

function isRetriableStatus(status) {
  // 429 - Too many requests
  // 500 - Internal server error
  // 599 - Errorin external API
  return status === 429 || (status >= 500 && status <= 599);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchWeeklyForecastDaily({
  latitude,
  longitude,
  timezone = "auto",
}) {
  const url = new URL(OPEN_METEO_BASE_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("timezone", timezone);
  url.searchParams.set("daily", "temperature_2m_min,temperature_2m_max,weather_code");
  url.searchParams.set("forecast_days", "7");

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetchWithTimeout(url, TIMEOUT_MS);

      if (!res.ok) {
        if (isRetriableStatus(res.status) && attempt < MAX_ATTEMPTS) {
          await sleep(300 * attempt);
          continue;
        }
        throw new Error(`Open-Meteo error: ${res.status}`);
      }

      const data = await res.json();
      const dates = data?.daily?.time ?? [];
      const mins = data?.daily?.temperature_2m_min ?? [];
      const maxs = data?.daily?.temperature_2m_max ?? [];
      const codes = data?.daily?.weather_code ?? [];

      if (
        !Array.isArray(dates) ||
        !Array.isArray(mins) ||
        !Array.isArray(maxs)
      ) {
        throw new Error("Open-Meteo returned invalid daily payload");
      }
      if (dates.length !== mins.length || dates.length !== maxs.length || dates.length !== codes.length) {
        throw new Error("Open-Meteo returned inconsistent daily arrays");
      }

      // Rolling 7-day daily forecast starting from fetch date
      return dates.slice(0, 7).map((date, i) => ({
        date,
        temp_min: mins[i],
        temp_max: maxs[i],
        weather_code: codes[i],
      }));
    } catch (err) {
      // Retry only on network/timeout (no HTTP status)
      const shouldRetryNetwork =
        attempt < MAX_ATTEMPTS &&
        (err?.name === "AbortError" ||
          err?.code === "ECONNRESET" ||
          err?.code === "ENOTFOUND");

      if (shouldRetryNetwork) {
        await sleep(300 * attempt);
        continue;
      }

      throw err;
    }
  }
}

module.exports = { fetchWeeklyForecastDaily };
