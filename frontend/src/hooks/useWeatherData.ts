/**
 * Central hook responsible for fetching and exposing weather data to the UI.
 *
 * Flow:
 * 1) Fetch origins (locations)
 * 2) Resolve initial selection (URL param if valid, otherwise first location)
 * 3) Fetch forecast for the selected origin
 *
 * Exposes:
 * - `loading` and granular loading flags
 * - `error` as a user-facing message
 * - `refetch` to retry the latest request
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { weatherApi } from "../api/weatherApi";
import type { ForecastResponse } from "../types/api";
import type { LocationsForNavbar, Origin } from "../types/weather";
import { getOriginFromUrl, setOriginInUrl } from "../utils/weatherLocation.utils";

export function useWeatherData() {
  const [origins, setOrigins] = useState<Origin[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [weather, setWeather] = useState<ForecastResponse | null>(null);

  const [loadingOrigins, setLoadingOrigins] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrigins = useCallback(async () => {
    setLoadingOrigins(true);
    try {
      const data = await weatherApi.getOrigins();
      setOrigins(data);

      const fromUrl = getOriginFromUrl();
      const initial =
        fromUrl && data.some((o) => o.id === fromUrl)
          ? fromUrl
          : data[0]?.id ?? null;

      setSelectedId(+initial);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load locations");
    } finally {
      setLoadingOrigins(false);
    }
  }, []);

  const fetchWeather = useCallback(async (id: number) => {
    setLoadingWeather(true);
    try {
      setError(null);
      const data = await weatherApi.getWeather(id);
      setWeather(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load forecast");
    } finally {
      setLoadingWeather(false);
    }
  }, []);

  useEffect(() => {
    fetchOrigins();
  }, [fetchOrigins]);

  useEffect(() => {
    if (selectedId == null) return;
    fetchWeather(selectedId);
  }, [selectedId, fetchWeather]);

  const locationsForNavbar: LocationsForNavbar[] = useMemo(
    () => origins.map((o) => ({ id: o.id, city: o.city, country: o.country })),
    [origins]
  );

  const setSelectedOrigin = (id: string) => {
    const next = Number(id);
    if (!Number.isFinite(next)) return;
    setSelectedId(next);
    setOriginInUrl(next);
  };

  const refetch = useCallback(() => {
    if (selectedId == null) return fetchOrigins();
    return fetchWeather(selectedId);
  }, [selectedId, fetchOrigins, fetchWeather]);

  return {
    origins,
    locationsForNavbar,
    selectedId,
    setSelectedId: setSelectedOrigin,
    weather,
    loading: loadingOrigins || loadingWeather,
    loadingOrigins,
    loadingWeather,
    error,
    refetch
  };
}
