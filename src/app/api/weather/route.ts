import { NextResponse } from "next/server";

export interface ForecastDay {
  day: string;
  temp: number;
  condition: "Sunny" | "Rainy" | "Cloudy" | "Partly Cloudy";
}

export interface WeatherData {
  location: string;
  temperature: number;
  condition: "Sunny" | "Rainy" | "Cloudy" | "Partly Cloudy";
  humidity: number;
  wind: number;
  forecast: ForecastDay[];
}

export async function GET() {
  const weather: WeatherData = {
    location: "Kigali",
    temperature: 24,
    condition: "Rainy",
    humidity: 70,
    wind: 12,
    forecast: [
      { day: "Tomorrow", temp: 23, condition: "Rainy" },
      { day: "Wed", temp: 25, condition: "Partly Cloudy" },
      { day: "Thu", temp: 22, condition: "Sunny" },
    ],
  };

  return NextResponse.json(weather);
}
