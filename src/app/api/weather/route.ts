// src/app/api/weather/route.ts
// Proxies Open-Meteo requests server-side — avoids CORS issues in the browser.

import { NextResponse } from "next/server";
import {
  fetchAllLocationsWeather,
  type LocationWeatherData,
} from "@/lib/weatherService";

export async function GET() {
  try {
    const data: LocationWeatherData[] = await fetchAllLocationsWeather();
    return NextResponse.json(data);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch weather data";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
