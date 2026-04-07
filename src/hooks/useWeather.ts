"use client";

// hooks/useWeather.ts
// Calls /api/weather (Next.js proxy) first.
// If the proxy itself fails (network error / deployment issue),
// falls back to calling Open-Meteo directly from the browser.
// Falls back to localStorage cache when both sources fail.

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
    // storage full — silently ignore
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
        // ── Strategy 1: Next.js API proxy (server-side fetch) ──────────────
        let data: LocationWeatherData[] | null = null;

        try {
          const res = await fetch("/api/weather", { cache: "no-store" });
          if (res.ok) {
            data = await res.json();
          } else {
            const body = await res.json().catch(() => ({}));
            console.warn("[useWeather] proxy error:", (body as { error?: string }).error ?? res.status);
          }
        } catch (proxyErr) {
          // Proxy unreachable (deployment env, network, etc.) — try direct
          console.warn("[useWeather] proxy unreachable, trying direct fetch:", proxyErr);
        }

        // ── Strategy 2: Direct browser → Open-Meteo (no proxy needed) ─────
        if (!data) {
          data = await fetchAllLocationsWeather();
        }

        if (!cancelled && data && data.length > 0) {
          setAllLocations(data);
          writeCache(data);
        }
      } catch (err) {
        if (cancelled) return;

        // ── Strategy 3: localStorage cache ────────────────────────────────
        const cached = readCache();
        if (cached && cached.length > 0) {
          setAllLocations(cached);
          setIsStale(true);
        } else {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load weather. Check your internet connection."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
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
