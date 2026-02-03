import { useMemo } from "react";
import { Navbar } from "./components/Navbar/Navbar";
import { useWeatherData } from "./hooks/useWeatherData";
import { ForecastViewPage } from "./pages/ForecastPage/ForecastViewPage";
import { useTempUnit } from "./hooks/useTempUnit";

function App() {
  const {
    origins,
    selectedId,
    setSelectedId,
    weather,
    loading,
    error,
    refetch,
  } = useWeatherData();

  const { unit, toggle } = useTempUnit("c");

  const locationLabel = useMemo(() => {
    const selected = origins.find((o) => Number(o.id) === selectedId) ?? null;
    return selected ? `${selected.city}, ${selected.country}` : undefined;
  }, [origins, selectedId]);

  return (
    <>
      <Navbar
        locations={origins}
        selectedId={selectedId}
        onChangeLocation={setSelectedId}
        loadingLocations={loading}
        unit={unit}
        onToggleUnit={toggle}
      />
      <main>
        <ForecastViewPage
          locationLabel={locationLabel}
          days={weather?.days}
          loading={loading}
          error={error}
          onRetry={refetch}
          unit={unit}
        />
      </main>

      <footer className="app-footer">
        <p>
          Weather data provided by{" "}
          <a href="https://open-meteo.com/en/docs">Open-Meteo</a>
        </p>
      </footer>
    </>
  );
}

export default App;
