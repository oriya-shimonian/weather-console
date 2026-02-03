import { useEffect, useState } from "react";
import { type Theme, DEFAULT_THEME, getStoredTheme, applyTheme, persistTheme } from "../utils/theme.utils";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    const stored = getStoredTheme();
    const initial = stored ?? DEFAULT_THEME;

    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === "light" ? "dark" : "light";
      applyTheme(next);
      persistTheme(next);
      return next;
    });
  };

  return { theme, toggleTheme };
}
