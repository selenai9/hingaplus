// ─────────────────────────────────────────────────────────────────────────────
// lib/alertService.ts
// Pure rain-detection logic.  No React, no side effects.
// ─────────────────────────────────────────────────────────────────────────────

import type { Alert } from "@/lib/mockData";
import type { LocationWeatherData } from "@/lib/weatherService";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RainAlertResult {
  /** True when at least one location triggered an alert. */
  showAlert: boolean;
  /** Array of Alert objects ready to pass directly to <AlertCard alerts={…} />. */
  alerts:    Alert[];
  /** Human-readable summary (first alert message, or empty string). */
  message:   string;
}

// ── Thresholds ────────────────────────────────────────────────────────────────

const PROB_WARN_THRESHOLD  = 60;  // % – precipitation probability → warning
const PROB_DANGER_THRESHOLD = 80; // % – precipitation probability → danger
const PRECIP_THRESHOLD     = 0.5; // mm – hourly precipitation     → always alert
const PRECIP_DANGER_MM     = 2.0; // mm – above this → danger severity

// ── Core function ─────────────────────────────────────────────────────────────

/**
 * Evaluates weather data for all fetched locations and returns a set of
 * Alert objects (matching the shape in mockData.ts) for any location where
 * rain is expected above the defined thresholds.
 *
 * Trigger conditions (OR logic per location):
 *   • daily precipitation_probability_max  > 60 %
 *   • current hourly precipitation          > 0.5 mm
 *
 * Severity escalation:
 *   • danger  → probability > 80 % OR precipitation > 2 mm
 *   • warning → everything else that still crosses a threshold
 */
export function checkRainAlert(
  weatherData: LocationWeatherData[]
): RainAlertResult {
  const alerts: Alert[] = [];

  for (const [index, location] of weatherData.entries()) {
    const highProbability     = location.rainProbability > PROB_WARN_THRESHOLD;
    const significantPrecip   = location.precipitation   > PRECIP_THRESHOLD;

    // Skip this location if neither threshold is crossed
    if (!highProbability && !significantPrecip) continue;

    // ── Determine severity ─────────────────────────────────────────────────
    const isDanger =
      location.rainProbability > PROB_DANGER_THRESHOLD ||
      location.precipitation   > PRECIP_DANGER_MM;

    const severity: Alert["severity"] = isDanger ? "danger" : "warning";

    // ── Build the message ──────────────────────────────────────────────────
    const parts: string[] = [
      `Rain expected in ${location.location}.`,
    ];

    if (highProbability) {
      parts.push(
        `${location.rainProbability}% chance of precipitation today.`
      );
    }

    if (significantPrecip) {
      parts.push(
        `Current rainfall: ${location.precipitation.toFixed(1)} mm/h.`
      );
    }

    parts.push("Consider delaying farming activities.");

    const message = parts.join(" ");

    alerts.push({
      id:       `rain-${location.location.toLowerCase()}-${index}`,
      title:    `Rain Expected in ${location.location}`,
      message,
      severity,
    });
  }

  const firstMessage = alerts[0]?.message ?? "";

  return {
    showAlert: alerts.length > 0,
    alerts,
    message:   firstMessage,
  };
}
