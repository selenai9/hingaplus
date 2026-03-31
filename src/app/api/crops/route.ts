import { NextResponse } from "next/server";

export interface Crop {
  id: string;
  name: string;
  day: string;
  status: "Good" | "Risky";
  icon: string;
}

export async function GET() {
  const crops: Crop[] = [
    { id: "1", name: "Maize", day: "Monday", status: "Good", icon: "🌽" },
    { id: "2", name: "Beans", day: "Wednesday", status: "Risky", icon: "🫘" },
    { id: "3", name: "Tomatoes", day: "Thursday", status: "Good", icon: "🍅" },
    { id: "4", name: "Sorghum", day: "Friday", status: "Risky", icon: "🌾" },
  ];

  return NextResponse.json(crops);
}
