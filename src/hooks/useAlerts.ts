"use client";

// ─────────────────────────────────────────────────────────────────────────────
// hooks/useAlerts.ts
// Derives rain alerts from weather data via checkRainAlert.
// No network calls – purely derived / memoised state.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from "react";
import { checkRainAlert, type RainAlertResult } from "@/lib/alertService";
import type { LocationWeatherData }             from "@/lib/weatherService";
import type { Alert }                           from "@/lib/mockData";

// ── Return shape ──────────────────────────────────────────────────────────────

export interface UseAlertsReturn {
  /**
   * Array of Alert objects – pass directly to `<AlertCard alerts={alerts} />`.
   * Empty array while weather data is still loading.
   */
  alerts: Alert[];

  /** True when at least one location has a rain alert. */
  hasAlerts: boolean;

  /** Convenience: first alert's message string, or empty string if no alerts. */
  message: string;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * @param allLocations – the `allLocations` array returned by `useWeather()`
 *
 * Usage:
 * ```tsx
 * const { weatherData, allLocations, loading } = useWeather();
 * const { alerts, hasAlerts }                  = useAlerts(allLocations);
 *
 * return <AlertCard alerts={alerts} />;
 * ```
 */
export function useAlerts(
  allLocations: LocationWeatherData[]
): UseAlertsReturn {
  const result: RainAlertResult = useMemo(() => {
    if (allLocations.length === 0) {
      return { showAlert: false, alerts: [], message: "" };
    }
    return checkRainAlert(allLocations);
  }, [allLocations]);

  return {
    alerts:    result.alerts,
    hasAlerts: result.showAlert,
    message:   result.message,
  };
}
