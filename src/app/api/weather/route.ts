// src/app/api/weather/route.ts
import { NextResponse } from "next/server";
import { fetchAllLocationsWeather, type LocationWeatherData } from "@/lib/weatherService";

// Prevent Next.js from caching this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data: LocationWeatherData[] = await fetchAllLocationsWeather();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch weather data";
    console.error("[/api/weather]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
