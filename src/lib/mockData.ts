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

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: "warning" | "danger" | "info";
}

export interface Crop {
  id: string;
  name: string;
  day: string;
  status: "Good" | "Risky";
  icon: string;
}

export const weather: WeatherData = {
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

export const alerts: Alert[] = [
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

export const crops: Crop[] = [
  { id: "1", name: "Maize", day: "Monday", status: "Good", icon: "🌽" },
  { id: "2", name: "Beans", day: "Wednesday", status: "Risky", icon: "🫘" },
  { id: "3", name: "Tomatoes", day: "Thursday", status: "Good", icon: "🍅" },
  { id: "4", name: "Sorghum", day: "Friday", status: "Risky", icon: "🌾" },
];
