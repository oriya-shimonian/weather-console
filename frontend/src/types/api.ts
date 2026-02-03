import { type Origin, type ForecastDay } from "./weather";

export interface OriginsResponse {
  origins: Origin[];
}

export interface ForecastResponse {
  originId: string;
  days: ForecastDay[];
}
