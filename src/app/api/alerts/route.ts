import { NextResponse } from "next/server";

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: "warning" | "danger" | "info";
}

export async function GET() {
  const alerts: Alert[] = [
    {
      id: "1",
      title: "Heavy Rain Alert",
      message:
        "Rain expected in the next 24 hours. Consider delaying planting to avoid waterlogging and soil erosion.",
      severity: "warning",
    },
    {
      id: "2",
      title: "Optimal Planting Window",
      message:
        "Thursday presents ideal conditions for maize planting — low wind, mild temperature.",
      severity: "info",
    },
  ];

  return NextResponse.json(alerts);
}
