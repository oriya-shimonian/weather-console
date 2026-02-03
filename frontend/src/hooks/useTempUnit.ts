import { useEffect, useState } from "react";
import type { TempUnit } from "../types/weather";

const KEY = "temp_unit";

/**
 * Reads persisted temperature unit from localStorage.
 * Returns `null` when storage is unavailable or value is invalid.
 */

function readStored(): TempUnit | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "c" || v === "f" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Manages temperature unit preference (°C / °F) with localStorage persistence.
 * Falls back to `defaultUnit` when no stored value exists.
 */

export function useTempUnit(defaultUnit: TempUnit = "c") {
  const [unit, setUnit] = useState<TempUnit>(() => readStored() ?? defaultUnit);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, unit);
    } catch {}
  }, [unit]);

  const toggle = () => setUnit((u) => (u === "c" ? "f" : "c"));

  return { unit, setUnit, toggle };
}
