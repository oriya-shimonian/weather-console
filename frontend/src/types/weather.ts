export type WeatherGroup =
  | "Clear Sky"
  | "Partly Cloudy"
  | "Fully Overcast"
  | "Dense Fog"
  | "Light Drizzle"
  | "Freezing Drizzle"
  | "Light Rain"
  | "Moderate Rain"
  | "Heavy Rain"
  | "Rain Showers"
  | "Light Snow"
  | "Snow Grains"
  | "Snow Showers"
  | "Thunder Storm"
  | "Unknown Weather";
;

export type WeatherTone =
  | "clear"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm"
  | "unknown"
;

export interface WeatherVisual {
  label: WeatherGroup;
  icon: string;
  tone: WeatherTone;
}

export interface Origin {
  id: string;
  city: string;
  country: string;
  timezone: string;
  rotation_order: number;
  is_active: boolean;
  last_fetched_at: string | null;
}

export interface ForecastDay {
  date: string;           // YYYY-MM-DD
  temp_min: number;
  temp_max: number;
  weather_code: number | null;
  fetched_at: string;
}

export type LocationsForNavbar = Pick<
  Origin,
  "id" | "city" | "country"
>;

export type TempUnit = "c" | "f";

