// ─────────────────────────────────────────────────────────────────────────────
// lib/weatherService.ts
// Fetches weather from Open-Meteo and transforms it into UI-ready shapes.
// ─────────────────────────────────────────────────────────────────────────────

import type { WeatherData, ForecastDay } from "@/lib/mockData";

// ── Constants ────────────────────────────────────────────────────────────────

const BASE_URL   = "https://api.open-meteo.com/v1/forecast";
const TIMEOUT_MS = 8000; // 8 s — generous for low-bandwidth rural connections

export const locations = [
  { name: "Ndora",   lat: -2.604148955489228, lon: 29.830885802434796 },
  { name: "Muhanda", lat: -1.794662,           lon: 29.520615          },
  { name: "Mvundwa", lat: -2.1657,             lon: 29.554             },
] as const;

export type Location = (typeof locations)[number];

// ── Internal API response shape ───────────────────────────────────────────────

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

// ── Extended type that carries extra fields beyond the UI WeatherData ─────────

export interface LocationWeatherData extends WeatherData {
  /** 0–100 – today's daily precipitation probability (%) */
  rainProbability: number;
  /** mm – precipitation at the current hour */
  precipitation:   number;
  /** km/h – raw windspeed from current_weather */
  windspeed:       number;
  /** WMO weather code from current_weather */
  weathercode:     number;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * fetch() with an AbortController timeout.
 * Throws a descriptive error if the request stalls beyond TIMEOUT_MS.
 */
async function fetchWithTimeout(
  url: string,
  timeoutMs = TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
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

/**
 * Maps a WMO weather interpretation code to one of the four UI condition
 * strings that WeatherCard and AlertCard understand.
 */
function weathercodeToCondition(code: number): WeatherData["condition"] {
  if (code === 0 || code === 1)                                   return "Sunny";
  if (code === 2)                                                  return "Partly Cloudy";
  if (code === 3 || code === 45 || code === 48)                   return "Cloudy";
  if (
    (code >= 51 && code <= 67) ||
    (code >= 80 && code <= 82) ||
    (code >= 85 && code <= 86) ||
    (code >= 95 && code <= 99)
  )                                                                return "Rainy";
  return "Partly Cloudy";
}

/**
 * Returns a human-readable forecast day label.
 * index = 1 → "Tomorrow", index ≥ 2 → short weekday ("Mon", "Tue" …)
 */
function forecastDayLabel(dateStr: string, index: number): string {
  if (index === 1) return "Tomorrow";
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
}

/**
 * Derives a forecast condition from daily precipitation probability alone.
 */
function probToCondition(prob: number): WeatherData["condition"] {
  if (prob > 60) return "Rainy";
  if (prob > 30) return "Partly Cloudy";
  return "Sunny";
}

// ── Core functions ────────────────────────────────────────────────────────────

/**
 * Raw fetch from Open-Meteo.  Throws on network / HTTP / timeout errors.
 */
export async function fetchWeather(
  lat: number,
  lon: number
): Promise<OpenMeteoResponse> {
  const params = new URLSearchParams({
    latitude:         lat.toString(),
    longitude:        lon.toString(),
    current_weather:  "true",
    hourly:           "precipitation,relativehumidity_2m",
    daily:            "temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone:         "auto",
  });

  const res = await fetchWithTimeout(`${BASE_URL}?${params}`);

  if (!res.ok) {
    throw new Error(
      `Open-Meteo API error for (${lat}, ${lon}): ${res.status} ${res.statusText}`
    );
  }

  return res.json() as Promise<OpenMeteoResponse>;
}

/**
 * Transforms a raw Open-Meteo response into a `LocationWeatherData` object.
 */
export function transformWeatherData(
  raw: OpenMeteoResponse,
  locationName: string
): LocationWeatherData {
  const { current_weather, hourly, daily } = raw;

  const nowPrefix = new Date().toISOString().slice(0, 13);
  const hourIndex = Math.max(
    0,
    hourly.time.findIndex((t) => t.startsWith(nowPrefix))
  );

  const humidity        = hourly.relativehumidity_2m[hourIndex] ?? hourly.relativehumidity_2m[0] ?? 0;
  const precipitation   = hourly.precipitation[hourIndex]        ?? hourly.precipitation[0]        ?? 0;
  const rainProbability = daily.precipitation_probability_max[0] ?? 0;

  const forecast: ForecastDay[] = daily.time
    .slice(1, 4)
    .map((dateStr, i): ForecastDay => {
      const dailyIndex = i + 1;
      const maxTemp  = daily.temperature_2m_max[dailyIndex]  ?? 0;
      const minTemp  = daily.temperature_2m_min[dailyIndex]  ?? 0;
      const avgTemp  = Math.round((maxTemp + minTemp) / 2);
      const prob     = daily.precipitation_probability_max[dailyIndex] ?? 0;

      return {
        day:       forecastDayLabel(dateStr, dailyIndex),
        temp:      avgTemp,
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

/**
 * Fetches and transforms weather for a single location object.
 */
export async function fetchLocationWeather(
  location: Location
): Promise<LocationWeatherData> {
  const raw = await fetchWeather(location.lat, location.lon);
  return transformWeatherData(raw, location.name);
}

/**
 * Fetches all 3 locations in parallel via Promise.all.
 * Returns an array in the same order as the `locations` constant.
 */
export async function fetchAllLocationsWeather(): Promise<LocationWeatherData[]> {
  return Promise.all(locations.map((loc) => fetchLocationWeather(loc)));
}
