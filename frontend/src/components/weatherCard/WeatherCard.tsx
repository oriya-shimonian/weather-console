import styles from "./WeatherCard.module.css";
import type { ForecastDay, TempUnit } from "../../types/weather";
import { buildCardModel } from "../../utils/cardModel.utils";

type Props = {
  day: ForecastDay;
  unit: TempUnit;
  locale?: string;
};

export function WeatherCard({ day, unit, locale = "en-GB" }: Props) {
  const m = buildCardModel(day, "day", {locale, unit});

  return (
    <div className={styles.card} role={m.isValid ? undefined : "alert"}>
      <div className={styles.top}>
        <div className={styles.date}>{m.dateLabel}</div>
      </div>

      {m.isValid ? (
        <>
          <div className={styles.temps}>
            <span className={styles.max}>{m.max}</span>
            <span className={styles.min}>{m.min}</span>
          </div>

          <div className={styles.meta}>
            <span className={styles.code}>{m.icon}</span>
            <span className={styles.codeLabel}>{m.label}</span>
          </div>
        </>
      ) : (
        <div className={styles.meta}>
          <span>Data unavailable</span>
        </div>
      )}
    </div>
  );
}
