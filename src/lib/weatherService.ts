// ─────────────────────────────────────────────────────────────────────────────
// lib/weatherService.ts
// ─────────────────────────────────────────────────────────────────────────────

import type { WeatherData, ForecastDay } from "@/lib/mockData";

const BASE_URL   = "https://api.open-meteo.com/v1/forecast";
const TIMEOUT_MS = 10000;

export const locations = [
  { name: "Ndora",   lat: -2.604148955489228, lon: 29.830885802434796 },
  { name: "Muhanda", lat: -1.794662,           lon: 29.520615          },
  { name: "Mvundwa", lat: -2.1657,             lon: 29.554             },
] as const;

export type Location = (typeof locations)[number];

interface OpenMeteoResponse {
  current_weather: {
    temperature: number;
    windspeed:   number;
    weathercode: number;
  };
  hourly: {
    time:                  string[];
    precipitation:         number[];
    relativehumidity_2m:   number[];
  };
  daily: {
    time:                          string[];
    temperature_2m_max:            number[];
    temperature_2m_min:            number[];
    precipitation_probability_max: number[];
  };
}

export interface LocationWeatherData extends WeatherData {
  rainProbability: number;
  precipitation:   number;
  windspeed:       number;
  weathercode:     number;
}

async function fetchWithTimeout(url: string, timeoutMs = TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    if ((err as Error).name === "AbortError") {
      throw new Error("Weather request timed out. Check your connection.");
    }
    throw err;
  }
}

function weathercodeToCondition(code: number): WeatherData["condition"] {
  if (code === 0 || code === 1) return "Sunny";
  if (code === 2) return "Partly Cloudy";
  if (code === 3 || code === 45 || code === 48) return "Cloudy";
  if (
    (code >= 51 && code <= 67) ||
    (code >= 80 && code <= 82) ||
    (code >= 85 && code <= 86) ||
    (code >= 95 && code <= 99)
  ) return "Rainy";
  return "Partly Cloudy";
}

function forecastDayLabel(dateStr: string, index: number): string {
  if (index === 1) return "Tomorrow";
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
}

function probToCondition(prob: number): WeatherData["condition"] {
  if (prob > 60) return "Rainy";
  if (prob > 30) return "Partly Cloudy";
  return "Sunny";
}

export async function fetchWeather(lat: number, lon: number): Promise<OpenMeteoResponse> {
  const params = new URLSearchParams({
    latitude:        lat.toString(),
    longitude:       lon.toString(),
    current_weather: "true",
    hourly:          "precipitation,relativehumidity_2m",
    daily:           "temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone:        "auto",
  });

  const res = await fetchWithTimeout(`${BASE_URL}?${params}`);
  if (!res.ok) {
    throw new Error(`Open-Meteo error for (${lat}, ${lon}): ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<OpenMeteoResponse>;
}

export function transformWeatherData(raw: OpenMeteoResponse, locationName: string): LocationWeatherData {
  const { current_weather, hourly, daily } = raw;
  const nowPrefix = new Date().toISOString().slice(0, 13);
  const hourIndex = Math.max(0, hourly.time.findIndex((t) => t.startsWith(nowPrefix)));

  const humidity        = hourly.relativehumidity_2m[hourIndex] ?? hourly.relativehumidity_2m[0] ?? 0;
  const precipitation   = hourly.precipitation[hourIndex]        ?? hourly.precipitation[0]        ?? 0;
  const rainProbability = daily.precipitation_probability_max[0] ?? 0;

  const forecast: ForecastDay[] = daily.time.slice(1, 4).map((dateStr, i): ForecastDay => {
    const idx     = i + 1;
    const maxTemp = daily.temperature_2m_max[idx] ?? 0;
    const minTemp = daily.temperature_2m_min[idx] ?? 0;
    const prob    = daily.precipitation_probability_max[idx] ?? 0;
    return {
      day:       forecastDayLabel(dateStr, idx),
      temp:      Math.round((maxTemp + minTemp) / 2),
      condition: probToCondition(prob),
    };
  });

  return {
    location:    locationName,
    temperature: Math.round(current_weather.temperature),
    condition:   weathercodeToCondition(current_weather.weathercode),
    humidity:    Math.round(humidity),
    wind:        Math.round(current_weather.windspeed),
    forecast,
    rainProbability,
    precipitation,
    windspeed:   current_weather.windspeed,
    weathercode: current_weather.weathercode,
  };
}

export async function fetchLocationWeather(location: Location): Promise<LocationWeatherData> {
  const raw = await fetchWeather(location.lat, location.lon);
  return transformWeatherData(raw, location.name);
}

/**
 * Uses Promise.allSettled so a single failing location doesn't break everything.
 * Returns only fulfilled results; throws only if ALL fail.
 */
export async function fetchAllLocationsWeather(): Promise<LocationWeatherData[]> {
  const results = await Promise.allSettled(
    locations.map((loc) => fetchLocationWeather(loc))
  );

  const fulfilled = results
    .filter((r): r is PromiseFulfilledResult<LocationWeatherData> => r.status === "fulfilled")
    .map((r) => r.value);

  if (fulfilled.length === 0) {
    const firstReason = results
      .filter((r): r is PromiseRejectedResult => r.status === "rejected")
      .map((r) => (r.reason instanceof Error ? r.reason.message : String(r.reason)))[0];
    throw new Error(firstReason ?? "Failed to fetch weather data for all locations.");
  }

  return fulfilled;
}
