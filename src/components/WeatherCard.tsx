"use client";

import { motion } from "framer-motion";
import type { WeatherData } from "@/lib/mockData";

interface WeatherCardProps {
  data: WeatherData;
}

function conditionIcon(condition: string) {
  switch (condition) {
    case "Sunny":
      return "☀️";
    case "Rainy":
      return "🌧️";
    case "Cloudy":
      return "☁️";
    case "Partly Cloudy":
      return "⛅";
    default:
      return "🌤️";
  }
}

export default function WeatherCard({ data }: WeatherCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="relative overflow-hidden rounded-3xl p-6 shadow-2xl"
      style={{
        background: "linear-gradient(135deg, #474973 0%, #161b33 100%)",
        boxShadow:
          "0 20px 60px rgba(71,73,115,0.4), 0 0 0 1px rgba(166,156,172,0.1)",
      }}
    >
      {/* Glow effect */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ backgroundColor: "#474973" }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ backgroundColor: "#a69cac" }}
      />

      {/* Header */}
      <div className="relative flex items-start justify-between mb-6">
        <div>
          <div
            className="flex items-center gap-1.5 text-xs font-medium mb-1 uppercase tracking-widest"
            style={{ color: "#a69cac" }}
          >
            <span>📍</span>
            <span>{data.location}</span>
          </div>
          <p className="text-sm font-medium" style={{ color: "#a69cac" }}>
            Current Weather
          </p>
        </div>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="text-5xl"
        >
          {conditionIcon(data.condition)}
        </motion.div>
      </div>

      {/* Temperature */}
      <div className="relative mb-6">
        <div className="flex items-end gap-2">
          <span
            className="text-7xl font-bold leading-none tracking-tighter"
            style={{ color: "#f1dac4" }}
          >
            {data.temperature}
          </span>
          <span
            className="text-3xl font-light mb-2"
            style={{ color: "#a69cac" }}
          >
            °C
          </span>
        </div>
        <p
          className="text-lg font-semibold mt-1"
          style={{ color: "#f1dac4" }}
        >
          {data.condition}
        </p>
      </div>

      {/* Stats Row */}
      <div
        className="relative grid grid-cols-2 gap-3 mb-6 p-4 rounded-2xl"
        style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">💧</span>
          <div>
            <p className="text-xs" style={{ color: "#a69cac" }}>
              Humidity
            </p>
            <p className="text-sm font-semibold" style={{ color: "#f1dac4" }}>
              {data.humidity}%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">💨</span>
          <div>
            <p className="text-xs" style={{ color: "#a69cac" }}>
              Wind Speed
            </p>
            <p className="text-sm font-semibold" style={{ color: "#f1dac4" }}>
              {data.wind} km/h
            </p>
          </div>
        </div>
      </div>

      {/* Forecast */}
      <div className="relative">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: "#a69cac" }}
        >
          3-Day Forecast
        </p>
        <div className="grid grid-cols-3 gap-2">
          {data.forecast.map((f, i) => (
            <motion.div
              key={f.day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1), duration: 0.4 }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              <span className="text-xs font-medium" style={{ color: "#a69cac" }}>
                {f.day}
              </span>
              <span className="text-xl">{conditionIcon(f.condition)}</span>
              <span
                className="text-sm font-bold"
                style={{ color: "#f1dac4" }}
              >
                {f.temp}°
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
