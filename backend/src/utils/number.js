
/**
 * Safely parses a value into a positive integer.
 * Returns null if the value is not a valid positive integer.
 *
 * Used for validating numeric query parameters before further processing.
 *
 * @param {unknown} value
 * @returns {number | null}
 */

export function parsePositiveInt(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}