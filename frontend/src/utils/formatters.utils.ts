import type { TempUnit } from "../types/weather";

/**
 * Safely converts unknown input into a valid Date object.
 * Returns `null` when the value cannot be parsed into a finite timestamp.
 */

export function safeDate(value: unknown) {
  const d = new Date(value as any);
  return Number.isFinite(d.getTime()) ? d : null;
}

/**
 * Formats the `fetched_at` timestamp for display (uses local timezone).
 * Returns `null` when the input is not a valid ISO date.
 */

export function formatUpdatedAt(
  iso: unknown,
  locale = "en-GB"
): string | null {
  const d = safeDate(iso);
  if (!d) return null;

  return d.toLocaleString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formats a forecast day label for the daily cards (weekday + date).
 */

export function formatDayLabel(
  iso: unknown,
  locale = "en-GB"
): string | null {
  const d = safeDate(iso);
  if (!d) return null;

  return d.toLocaleDateString(locale, {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

/**
 * Formats the main date label for the Today card.
 */

export function formatTodayLabel(
  iso: unknown,
  locale = "en-GB"
): string | null {
  const d = safeDate(iso);
  if (!d) return null;

  return d.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function cToF(c: number) {
  return (c * 9) / 5 + 32;
}

/**
 * Formats a temperature value into a UI string (e.g. "18°C" / "64°F").
 * Returns "—" when the input is missing or not a finite number.
 */

export function formatTemp(value: unknown, unit: TempUnit): string {
  if (!Number.isFinite(value as number)) return "—";
  const n = value as number;
  const out = unit === "f" ? cToF(n) : n;
  
  return `${Math.round(out)}°${unit.toUpperCase()}`;
}


