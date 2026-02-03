import type { ForecastDay, TempUnit } from "../types/weather";
import {
  safeDate,
  formatDayLabel,
  formatTodayLabel,
  formatTemp,
} from "./formatters.utils";
import { getWeatherVisual } from "./weatherCode.utils";

type CardKind = "today" | "day";

export type CardModel = {
  isValid: boolean;
  dateLabel: string;
  max: string;
  min: string;
  icon: string;
  label: string;
  tone?: string;
  weekdayLabel?: string;
};

type BuildOptions = {
  locale?: string;
  unit: TempUnit;
};

export function buildCardModel(
  day: ForecastDay,
  kind: CardKind,
  { locale = "en-GB", unit }: BuildOptions
): CardModel {
  const d = safeDate(day.date);
  const visual = getWeatherVisual(day.weather_code);

  const isValid = Boolean(d);
  const weekdayLabel = d
    ? new Intl.DateTimeFormat(locale, { weekday: "long" }).format(d)
    : undefined;


  return {
    isValid,

    dateLabel: d
      ? kind === "today"
        ? formatTodayLabel(d.toISOString(), locale) ?? "—"
        : formatDayLabel(d.toISOString(), locale) ?? "—"
      : kind === "day"
      ? "Invalid date"
      : "—",

    weekdayLabel,

    max: isValid ? formatTemp(day.temp_max, unit) : "—",
    min: isValid ? formatTemp(day.temp_min, unit) : "—",

    icon: visual.icon,
    label: visual.label,

    ...(kind === "today" ? { tone: visual.tone } : {}),
  };
}
