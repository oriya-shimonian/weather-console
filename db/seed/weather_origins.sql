INSERT INTO weather_origins (city, country, latitude, longitude, timezone, rotation_order, is_active)
VALUES
  ('Tel Aviv', 'Israel', 32.0853, 34.7818, 'auto', 1, TRUE),
  ('Madrid', 'Spain', 40.4168, -3.7038, 'auto', 2, TRUE),
  ('Milan', 'Italy', 45.4642, 9.1900, 'auto', 3, TRUE),
  ('Manila', 'Philippines', 14.5995, 120.9842, 'auto', 4, TRUE),
  ('Phuket', 'Thailand', 7.8804, 98.3923, 'auto', 5, TRUE)
ON CONFLICT (rotation_order) DO UPDATE
SET
  city = EXCLUDED.city,
  country = EXCLUDED.country,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  timezone = EXCLUDED.timezone,
  is_active = EXCLUDED.is_active;

SELECT rotation_order, city, country, timezone, is_active
FROM weather_origins
ORDER BY rotation_order;

