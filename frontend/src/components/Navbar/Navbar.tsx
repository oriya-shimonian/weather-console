import styles from "./Navbar.module.css";
import WeatherPulseIcon from "../../assets/digital-earth.png";
import { ThemeToggle } from "./ThemeToggle";
import type { LocationsForNavbar, TempUnit } from "../../types/weather";
import React from "react";
import { LocationsSearch } from "../LocationSelect/LocationsSearch";

export const Navbar = React.memo(function Navbar({
  locations,
  selectedId,
  unit,
  onChangeLocation,
  loadingLocations,
  onToggleUnit,
}: {
  locations: LocationsForNavbar[];
  selectedId: number | null;
  unit: TempUnit; // "c" | "f"
  onChangeLocation: (id: string) => void;
  loadingLocations?: boolean;
  onToggleUnit: () => void;
}) {
  const setUnit = (next: TempUnit) => {
    if (next !== unit) onToggleUnit();
  };

  return (
    <header className={styles.bar}>
      <div className={styles.brand}>
        <img
          src={WeatherPulseIcon}
          alt="WeatherPulse logo"
          className={styles.logo}
          aria-hidden="true"
        />
        <div className={styles.title}>Weather Console</div>
      </div>

      <div className={styles.actions}>
        <LocationsSearch
          options={locations}
          valueId={selectedId}
          onChange={onChangeLocation}
          disabled={loadingLocations}
        />
      </div>

      <div className={styles.actionsRight}>
        {/* Unit segmented toggle */}
        <div className={styles.unitWrap} role="group" aria-label="Temperature unit">
          <button
            type="button"
            className={`${styles.unitTab} ${unit === "c" ? styles.unitActive : ""}`}
            onClick={() => setUnit("c")}
            aria-pressed={unit === "c"}
          >
            °C
          </button>

          <button
            type="button"
            className={`${styles.unitTab} ${unit === "f" ? styles.unitActive : ""}`}
            onClick={() => setUnit("f")}
            aria-pressed={unit === "f"}
          >
            °F
          </button>

          {/* underline indicator */}
          <span
            className={styles.unitIndicator}
            data-pos={unit === "c" ? "left" : "right"}
            aria-hidden="true"
          />
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
});
