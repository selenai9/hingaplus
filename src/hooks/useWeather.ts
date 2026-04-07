"use client";

// ─────────────────────────────────────────────────────────────────────────────
// hooks/useWeather.ts
// Fetches Open-Meteo DIRECTLY from the browser (client-side).
// Open-Meteo supports CORS, so no server proxy is needed.
// Falls back to localStorage cache when offline or on error.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import {
  fetchAllLocationsWeather,
  type LocationWeatherData,
} from "@/lib/weatherService";
import type { WeatherData } from "@/lib/mockData";

const CACHE_KEY = "hinga_weather_cache";

export interface UseWeatherReturn {
  weatherData:  WeatherData | null;
  allLocations: LocationWeatherData[];
  loading:      boolean;
  error:        string | null;
  isStale:      boolean;
  refetch:      () => void;
}

function readCache(): LocationWeatherData[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as LocationWeatherData[]) : null;
  } catch {
    return null;
  }
}

function writeCache(data: LocationWeatherData[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable — silently ignore
  }
}

export function useWeather(): UseWeatherReturn {
  const [allLocations, setAllLocations] = useState<LocationWeatherData[]>([]);
  const [loading,      setLoading]      = useState<boolean>(true);
  const [error,        setError]        = useState<string | null>(null);
  const [isStale,      setIsStale]      = useState<boolean>(false);
  const [tick,         setTick]         = useState<number>(0);

  const refetch = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setIsStale(false);

      try {
        // ✅ Call Open-Meteo directly from the browser.
        // Open-Meteo has permissive CORS headers — no proxy needed.
        const data = await fetchAllLocationsWeather();

        if (!cancelled) {
          setAllLocations(data);
          writeCache(data);
        }
      } catch (err) {
        if (cancelled) return;

        // ── Try server-side proxy as secondary fallback ───────────────────
        try {
          const res = await fetch("/api/weather");
          if (res.ok) {
            const proxyData: LocationWeatherData[] = await res.json();
            if (!cancelled) {
              setAllLocations(proxyData);
              writeCache(proxyData);
              setLoading(false);
              return;
            }
          }
        } catch {
          // proxy also failed — fall through to cache
        }

        // ── Offline / error fallback to localStorage cache ────────────────
        const cached = readCache();
        if (cached && cached.length > 0) {
          setAllLocations(cached);
          setIsStale(true);
        } else {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch weather data. Check your connection."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [tick]);

  const weatherData: WeatherData | null =
    allLocations.length > 0
      ? {
          location:    allLocations[0].location,
          temperature: allLocations[0].temperature,
          condition:   allLocations[0].condition,
          humidity:    allLocations[0].humidity,
          wind:        allLocations[0].wind,
          forecast:    allLocations[0].forecast,
        }
      : null;

  return { weatherData, allLocations, loading, error, isStale, refetch };
}
