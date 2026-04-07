"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import WeatherCard from "@/components/WeatherCard";
import AlertCard from "@/components/AlertCard";
import PlannerCard from "@/components/PlannerCard";
import { crops } from "@/lib/mockData";
import type { WeatherData } from "@/lib/mockData";
import type { LocationWeatherData } from "@/lib/weatherService";

import { useWeather } from "@/hooks/useWeather";
import { useAlerts } from "@/hooks/useAlerts";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function toWeatherData(loc: LocationWeatherData): WeatherData {
  return {
    location:    loc.location,
    temperature: loc.temperature,
    condition:   loc.condition,
    humidity:    loc.humidity,
    wind:        loc.wind,
    forecast:    loc.forecast,
  };
}

// ── Location tab switcher ─────────────────────────────────────────────────────

function LocationTabs({
  locations,
  active,
  onChange,
}: {
  locations: LocationWeatherData[];
  active: number;
  onChange: (i: number) => void;
}) {
  return (
    <div
      className="flex gap-1 p-1 rounded-2xl mb-4"
      style={{ backgroundColor: "rgba(22,27,51,0.06)" }}
    >
      {locations.map((loc, i) => (
        <button
          key={loc.location}
          onClick={() => onChange(i)}
          className="flex-1 py-2 px-2 rounded-xl text-xs font-semibold transition-all duration-200"
          style={{
            backgroundColor: active === i ? "#474973" : "transparent",
            color:           active === i ? "#f1dac4" : "#a69cac",
          }}
        >
          📍 {loc.location}
        </button>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeSection,  setActiveSection]  = useState<string | null>(null);
  const [activeLocation, setActiveLocation] = useState<number>(0);

  const { allLocations, loading, error, isStale, refetch } = useWeather();
  const { alerts } = useAlerts(allLocations);

  // Active location data — falls back gracefully while loading
  const activeLoc    = allLocations[activeLocation] ?? null;
  const weatherData  = activeLoc ? toWeatherData(activeLoc) : null;

  const quickActions = [
    {
      id:          "weather",
      label:       "Check Weather",
      icon:        "🌦",
      href:        "#weather",
      description: "Current & forecast",
    },
    {
      id:          "planner",
      label:       "Plan Farming",
      icon:        "🌱",
      href:        "#planner",
      description: "Crop schedule",
    },
    {
      id:          "alerts",
      label:       "View Alerts",
      icon:        "🔔",
      href:        "#alerts",
      description: `${alerts.length} active`,
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1dac4" }}>
      <Navbar />

      <main className="max-w-lg mx-auto px-4 pt-24 pb-24 md:pb-8">

        {/* ── Hero Section ── */}
        <section id="home" className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Date */}
            <div
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
              style={{
                backgroundColor: "rgba(71,73,115,0.1)",
                color: "#474973",
              }}
            >
              <span>📅</span>
              <span>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month:   "long",
                  day:     "numeric",
                })}
              </span>
            </div>

            {/* Greeting */}
            <h1
              className="text-3xl font-extrabold leading-tight mb-1"
              style={{ color: "#0d0c1d" }}
            >
              {getGreeting()}, Selena 👋
            </h1>

            <p className="text-base" style={{ color: "#474973" }}>
              Here&apos;s your farm overview for today.
            </p>

            {/* Stale data notice */}
            {isStale && (
              <div
                className="mt-3 flex items-center justify-between gap-2 px-3 py-2 rounded-2xl text-xs"
                style={{
                  backgroundColor: "rgba(166,156,172,0.15)",
                  border:          "1px solid rgba(166,156,172,0.3)",
                  color:           "#474973",
                }}
              >
                <span>⚡ Showing cached data — you appear to be offline.</span>
                <button
                  onClick={refetch}
                  className="font-semibold underline underline-offset-2"
                >
                  Retry
                </button>
              </div>
            )}
          </motion.div>

          {/* ── Stats Strip ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-3 gap-2 mt-5"
          >
            {loading ? (
              <div className="col-span-3 text-center text-sm text-gray-400 py-4">
                Loading weather…
              </div>
            ) : error ? (
              <div className="col-span-3 text-center text-sm text-red-500 py-4">
                {error}
                <button
                  onClick={refetch}
                  className="block mx-auto mt-2 text-xs underline"
                >
                  Try again
                </button>
              </div>
            ) : activeLoc ? (
              [
                { label: "Temperature", value: `${activeLoc.temperature}°C`, icon: "🌡️" },
                { label: "Humidity",    value: `${activeLoc.humidity}%`,     icon: "💧" },
                { label: "Wind",        value: `${activeLoc.wind} km/h`,     icon: "💨" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-1 p-3 rounded-2xl"
                  style={{
                    backgroundColor: "rgba(22,27,51,0.05)",
                    border:          "1px solid rgba(22,27,51,0.08)",
                  }}
                >
                  <span className="text-lg">{stat.icon}</span>
                  <span className="text-sm font-bold" style={{ color: "#161b33" }}>
                    {stat.value}
                  </span>
                  <span className="text-[10px]" style={{ color: "#a69cac" }}>
                    {stat.label}
                  </span>
                </div>
              ))
            ) : null}
          </motion.div>
        </section>

        {/* ── Quick Actions ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#a69cac" }}
          >
            Quick Actions
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action, i) => (
              <motion.a
                key={action.id}
                href={action.href}
                onClick={() => setActiveSection(action.id)}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + i * 0.07 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex flex-col items-center gap-2 p-4 rounded-3xl"
                style={{
                  background:
                    activeSection === action.id
                      ? "linear-gradient(135deg, #474973, #161b33)"
                      : "rgba(22,27,51,0.06)",
                }}
              >
                <span className="text-2xl">{action.icon}</span>
                <span
                  className="text-xs font-bold text-center"
                  style={{
                    color: activeSection === action.id ? "#f1dac4" : "#161b33",
                  }}
                >
                  {action.label}
                </span>
                <span className="text-[10px] text-gray-400 text-center">
                  {action.description}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* ── Weather Section ── */}
        <motion.section id="weather" className="mb-8">
          <h2
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#a69cac" }}
          >
            Weather
          </h2>

          {loading ? (
            <div
              className="rounded-3xl p-8 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #474973 0%, #161b33 100%)" }}
            >
              <p className="text-sm" style={{ color: "#a69cac" }}>
                Fetching live weather…
              </p>
            </div>
          ) : error && !weatherData ? (
            <div
              className="rounded-3xl p-8 text-center"
              style={{ backgroundColor: "rgba(22,27,51,0.05)", border: "2px dashed rgba(22,27,51,0.15)" }}
            >
              <p className="text-sm text-red-500 mb-2">{error}</p>
              <button
                onClick={refetch}
                className="text-xs underline"
                style={{ color: "#474973" }}
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              {/* Location tab switcher */}
              {allLocations.length > 1 && (
                <LocationTabs
                  locations={allLocations}
                  active={activeLocation}
                  onChange={setActiveLocation}
                />
              )}

              <AnimatePresence mode="wait">
                {weatherData && (
                  <motion.div
                    key={activeLocation}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <WeatherCard data={weatherData} />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.section>

        {/* ── Alerts Section ── */}
        <motion.div className="mb-8" id="alerts">
          <AlertCard alerts={alerts} />
        </motion.div>

        {/* ── Planner Section ── */}
        <motion.div className="mb-8" id="planner">
          <PlannerCard crops={crops} />
        </motion.div>

        {/* ── Footer ── */}
        <motion.footer className="text-center pb-2">
          <div className="text-xs text-gray-400">
            🌿 Hinga+ · Smart Farming Assistant
          </div>
        </motion.footer>
      </main>
    </div>
  );
}
