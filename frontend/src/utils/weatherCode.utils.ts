
import type { WeatherVisual } from "../types/weather";

export function mapWeatherCode(code: number | null): WeatherVisual {
  if (code === 0)
    return { label: "Clear Sky", icon: "☀️", tone: "clear" };

  if ([1, 2].includes(code ?? -1))
    return { label: "Partly Cloudy", icon: "⛅", tone: "cloudy" };

  if (code === 3)
    return { label: "Fully Overcast", icon: "☁️", tone: "cloudy" };

  if ([45, 48].includes(code ?? -1))
    return { label: "Dense Fog", icon: "🌫️", tone: "fog" };

  if ([51, 53, 55].includes(code ?? -1))
    return { label: "Light Drizzle", icon: "🌦️", tone: "drizzle" };

  if ([56, 57].includes(code ?? -1))
    return { label: "Freezing Drizzle", icon: "🌧️", tone: "drizzle" };

  if ([61].includes(code ?? -1))
    return { label: "Light Rain", icon: "🌧️", tone: "rain" };

  if ([63].includes(code ?? -1))
    return { label: "Moderate Rain", icon: "🌧️", tone: "rain" };

  if ([65].includes(code ?? -1))
    return { label: "Heavy Rain", icon: "🌧️", tone: "rain" };

  if ([80, 81, 82].includes(code ?? -1))
    return { label: "Rain Showers", icon: "🌦️", tone: "rain" };

  if ([71, 73, 75].includes(code ?? -1))
    return { label: "Light Snow", icon: "❄️", tone: "snow" };

  if ([77].includes(code ?? -1))
    return { label: "Snow Grains", icon: "❄️", tone: "snow" };

  if ([85, 86].includes(code ?? -1))
    return { label: "Snow Showers", icon: "❄️", tone: "snow" };

  if ([95, 96, 99].includes(code ?? -1))
    return { label: "Thunder Storm", icon: "⛈️", tone: "storm" };

  return { label: "Unknown Weather", icon: "❔", tone: "unknown" };
}


export function getWeatherVisual(code: number | null | undefined) {
  const mapped = mapWeatherCode(code ?? null);
  return {
    tone: mapped?.tone ?? "unknown",
    icon: mapped?.icon ?? "—",
    label: mapped?.label ?? "—",
  };
}