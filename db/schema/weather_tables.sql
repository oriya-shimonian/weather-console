
-- =========
-- WeatherOrigins: allowed locations to query (seeded manually)
-- =========
CREATE TABLE IF NOT EXISTS weather_origins (
  id              BIGSERIAL PRIMARY KEY,

  city            TEXT NOT NULL,
  country         TEXT NOT NULL,

  latitude        DOUBLE PRECISION NOT NULL,
  longitude       DOUBLE PRECISION NOT NULL,

  -- default kept open for future extension
  timezone        TEXT NOT NULL DEFAULT 'auto',

  -- assignment requirement: exactly 5 rotating locations
  rotation_order  SMALLINT NOT NULL,

  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  last_fetched_at TIMESTAMPTZ,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- prevent duplicates & keep deterministic rotation
  CONSTRAINT weather_origins_rotation_order_uq UNIQUE (rotation_order),
  CONSTRAINT weather_origins_city_country_uq UNIQUE (city, country),

  -- sanity checks
  CONSTRAINT weather_origins_city_ck CHECK (length(trim(city)) BETWEEN 2 AND 80),
  CONSTRAINT weather_origins_country_ck CHECK (length(trim(country)) BETWEEN 2 AND 80),
  CONSTRAINT weather_origins_lat_ck CHECK (latitude BETWEEN -90 AND 90),
  CONSTRAINT weather_origins_lon_ck CHECK (longitude BETWEEN -180 AND 180),
  CONSTRAINT weather_origins_rotation_ck CHECK (rotation_order BETWEEN 1 AND 5),
  CONSTRAINT weather_origins_timezone_ck CHECK (length(trim(timezone)) BETWEEN 2 AND 64)
);

-- Supports the hourly rotation logic:
-- WHERE is_active = true
-- ORDER BY last_fetched_at NULLS FIRST, rotation_order
-- LIMIT 1
CREATE INDEX IF NOT EXISTS weather_origins_rotation_fetch_idx
  ON weather_origins (is_active, last_fetched_at, rotation_order);

-- =========
-- WeatherResults: processed daily forecast values
-- =========
CREATE TABLE IF NOT EXISTS weather_results (
  id         BIGSERIAL PRIMARY KEY,

  origin_id  BIGINT NOT NULL
             REFERENCES weather_origins(id)
             ON DELETE CASCADE,

  -- daily forecast date
  date       DATE NOT NULL,

  temp_min   REAL NOT NULL,
  temp_max   REAL NOT NULL,

  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  weather_code SMALLINT,

  -- prevent duplicates & enable UPSERT
  CONSTRAINT weather_results_origin_date_uq UNIQUE (origin_id, date),

  -- sanity checks
  CONSTRAINT weather_results_temp_range_ck CHECK (temp_min <= temp_max),
  CONSTRAINT weather_results_temp_ck CHECK (
    temp_min BETWEEN -100 AND 100
    AND temp_max BETWEEN -100 AND 100
  )
);

-- Supports frontend reads:
-- WHERE origin_id = ?
-- ORDER BY date DESC
-- LIMIT 7
CREATE INDEX IF NOT EXISTS weather_results_origin_date_idx
  ON weather_results (origin_id, date DESC);

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

