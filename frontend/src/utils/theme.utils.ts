type Theme = "light" | "dark";
const STORAGE_KEY = "theme";

export const DEFAULT_THEME: Theme = "light";

export function getStoredTheme(): Theme | null {
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "light" || v === "dark" ? v : null;
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function persistTheme(theme: Theme) {
  localStorage.setItem(STORAGE_KEY, theme);
}
