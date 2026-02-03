import styles from "./TodayCard.module.css";
import type { ForecastDay, TempUnit } from "../../types/weather";
import { buildCardModel } from "../../utils/cardModel.utils";

type Props = {
  day: ForecastDay;
  unit: TempUnit;
  locale?: string;
};

export function TodayCard({ day, unit, locale = "en-GB" }: Props) {
  const m = buildCardModel(day, "today", { locale, unit });
  const weekday = m.weekdayLabel ?? "-";

  return (
    <article
      className={`${styles.card} ${m.isValid && m.tone ? styles[m.tone] : ""}`}
      role={m.isValid ? undefined : "alert"}
    >
      <div className={styles.atmos} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.kicker}>TODAY</div>
      </header>

      <section className={styles.center}>
        {m.isValid ? (
          <>
            <div className={styles.bigIcon}>{m.icon}</div>

            <div className={styles.tempLine}>
              <div className={styles.tempMain}>{m.max}</div>
              <div className={styles.tempMinInline}>{m.min}</div>
            </div>

            <div className={styles.condition}>{m.label}</div>
          </>
        ) : (
          <div className={styles.condition}>Data unavailable</div>
        )}

        <div className={styles.line} />

        <div className={styles.meta}>
          <div className={styles.metaDate}>{m.dateLabel}</div>
          <div className={styles.metaWeekday}>{weekday}</div>
        </div>
      </section>
    </article>
  );
}
