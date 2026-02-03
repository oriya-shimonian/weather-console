import type { TempUnit } from "../types/weather";

export function safeDate(value: unknown) {
  const d = new Date(value as any);
  return Number.isFinite(d.getTime()) ? d : null;
}

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

export function formatTemp(value: unknown, unit: TempUnit): string {
  if (!Number.isFinite(value as number)) return "—";
  const n = value as number;
  const out = unit === "f" ? cToF(n) : n;
  
  return `${Math.round(out)}°${unit.toUpperCase()}`;
}


