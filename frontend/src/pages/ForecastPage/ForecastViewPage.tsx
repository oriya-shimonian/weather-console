import styles from "./ForecastViewPage.module.css";
import type { ForecastDay, TempUnit } from "../../types/weather";
import { WeatherCard } from "../../components/weatherCard/WeatherCard";
import { TodayCard } from "../../components/todayCard/TodayCard";
import { formatUpdatedAt } from "../../utils/formatters.utils";

type Props = {
  locationLabel?: string;
  days?: ForecastDay[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  unit: TempUnit;
};

export function ForecastViewPage({
  locationLabel,
  days,
  loading,
  error,
  onRetry,
  unit,
}: Props) {
  const updatedAt = formatUpdatedAt(days?.[0]?.fetched_at);
  const today = days?.[0];
  const rest = days?.slice(1, 7) ?? [];

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.h1}>
            Weekly Forecast{locationLabel ? ` - ${locationLabel}` : ""}
          </h1>
          <p className={styles.sub}>
            {updatedAt ? (
              <span>Last Updated On {updatedAt}</span>
            ) : (
              <span className={styles.muted}>—</span>
            )}{" "}
          </p>
        </div>
      </header>

      {error ? (
        <div className={styles.error} role="alert">
          <div className={styles.left}>
            <div className={styles.errorTitle}>Something went wrong</div>
            <div className={styles.errorMsg}>{error}</div>
          </div>

          {onRetry ? (
            <button
              type="button"
              className={styles.retryBtn}
              onClick={onRetry}
              disabled={loading}
            >
              Retry
            </button>
          ) : null}
        </div>
      ) : null}

      <div className={styles.layout} aria-busy={loading ? "true" : "false"}>
        <div className={styles.leftCol}>
          {loading ? (
            <div
              className={`${styles.skeletonCard} ${styles.skeletonToday}`}
              aria-hidden="true"
            />
          ) : today ? (
            <TodayCard day={today} unit={unit} />
          ) : (
            <div className={styles.empty}>No forecast data</div>
          )}
        </div>

        <div className={styles.rightCol}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.skeletonCard} aria-hidden="true" />
            ))
          ) : rest.length ? (
            rest.map((d) => <WeatherCard key={d.date} day={d} unit={unit} />)
          ) : (
            <div className={styles.emptySmall}>—</div>
          )}
        </div>
      </div>
    </section>
  );
}
