import styles from "./Navbar.module.css";
import { useTheme } from "../../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      className={styles.modeBtn}
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className={styles.modeIcon} aria-hidden="true">
        {isDark ? "🌙" : "☀️"}
      </span>
      <span className={styles.modeText}>
        {isDark ? "DARK MODE" : "LIGHT MODE"}
      </span>
    </button>
  );
}
