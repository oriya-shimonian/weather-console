import type { ForecastResponse, OriginsResponse } from "../types/api";
import type { Origin } from "../types/weather";
import { http } from "./http";

export const weatherApi = {
  getOrigins: async (): Promise<Origin[]> => {
    const res = await http<OriginsResponse>("/api/origins");
    return res.origins;
  },
  getWeather: (originId: number) =>
    http<ForecastResponse>(`/api/forecast?originId=${originId}`),
};
