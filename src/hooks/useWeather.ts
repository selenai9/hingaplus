"use client";

// ─────────────────────────────────────────────────────────────────────────────
// hooks/useWeather.ts
// Fetches weather for all 3 Rwandan locations and manages loading / error state.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import {
  fetchAllLocationsWeather,
  type LocationWeatherData,
} from "@/lib/weatherService";
import type { WeatherData } from "@/lib/mockData";

// ── Return shape ──────────────────────────────────────────────────────────────

export interface UseWeatherReturn {
  /**
   * Primary location (Ndora, index 0) shaped as `WeatherData` – ready to
   * pass directly to `<WeatherCard data={weatherData} />`.
   * Null while loading or on error.
   */
  weatherData: WeatherData | null;

  /**
   * Full data for all 3 locations, including extended fields like
   * `rainProbability` and `precipitation` used by the alert logic.
   */
  allLocations: LocationWeatherData[];

  loading: boolean;
  error:   string | null;

  /** Call this to manually trigger a re-fetch (e.g. a refresh button). */
  refetch: () => void;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useWeather(): UseWeatherReturn {
  const [allLocations, setAllLocations] = useState<LocationWeatherData[]>([]);
  const [loading,      setLoading]      = useState<boolean>(true);
  const [error,        setError]        = useState<string | null>(null);
  const [tick,         setTick]         = useState<number>(0);

  // Expose a stable refetch handle
  const refetch = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchAllLocationsWeather();

        if (!cancelled) {
          setAllLocations(data);
        }
      } catch (err) {
        if (!cancelled) {
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

    // Cleanup: ignore stale responses if the component unmounts or refetch fires
    return () => {
      cancelled = true;
    };
  }, [tick]); // re-runs when `refetch()` is called

  // ── Derive primary WeatherData (Ndora = allLocations[0]) ─────────────────
  // Strip the extended fields so the shape matches mockData.WeatherData exactly.
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

  return { weatherData, allLocations, loading, error, refetch };
}
