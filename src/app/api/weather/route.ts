// src/app/api/weather/route.ts
// Server-side proxy for Open-Meteo — used as a secondary fallback
// if the browser direct fetch fails. Primary fetching is done client-side.

import { NextResponse } from "next/server";
import {
  fetchAllLocationsWeather,
  type LocationWeatherData,
} from "@/lib/weatherService";

export const dynamic = "force-dynamic"; // never cache this route

export async function GET() {
  try {
    const data: LocationWeatherData[] = await fetchAllLocationsWeather();
    return NextResponse.json(data, {
      headers: {
        // Allow the browser to call this even from a different origin
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch weather data";
    console.error("[/api/weather]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
