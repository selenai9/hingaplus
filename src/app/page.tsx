"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import WeatherCard from "@/components/WeatherCard";
import AlertCard from "@/components/AlertCard";
import PlannerCard from "@/components/PlannerCard";
import type { WeatherData, Alert, Crop } from "@/lib/mockData";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [weatherRes, alertsRes, cropsRes] = await Promise.all([
          fetch("/api/weather"),
          fetch("/api/alerts"),
          fetch("/api/crops"),
        ]);

        const [weatherData, alertsData, cropsData] = await Promise.all([
          weatherRes.json(),
          alertsRes.json(),
          cropsRes.json(),
        ]);

        setWeather(weatherData);
        setAlerts(alertsData);
        setCrops(cropsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const quickActions = [
    {
      id: "weather",
      label: "Check Weather",
      icon: "🌦",
      href: "#weather",
      description: "Current & forecast",
    },
    {
      id: "planner",
      label: "Plan Farming",
      icon: "🌱",
      href: "#planner",
      description: "Crop schedule",
    },
    {
      id: "alerts",
      label: "View Alerts",
      icon: "🔔",
      href: "#alerts",
      description: `${alerts.length} active`,
    },
  ];

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f1dac4" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <span className="text-5xl">🌿</span>
          <p
            className="text-lg font-semibold"
            style={{ color: "#474973" }}
          >
            Loading Hinga+...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f1dac4" }}
      >
        <div className="flex flex-col items-center gap-4">
          <span className="text-5xl">⚠️</span>
          <p
            className="text-lg font-semibold"
            style={{ color: "#474973" }}
          >
            Failed to load data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#f1dac4" }}
    >
      <Navbar />

      {/* Main content — padded for top & bottom navbars */}
      <main className="max-w-lg mx-auto px-4 pt-24 pb-24 md:pb-8">

        {/* ── Hero / Greeting ── */}
        <section id="home" className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Date badge */}
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
                  month: "long",
                  day: "numeric",
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
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="grid grid-cols-3 gap-2 mt-5"
          >
            {[
              { label: "Temperature", value: `${weather.temperature}°C`, icon: "🌡️" },
              { label: "Humidity", value: `${weather.humidity}%`, icon: "💧" },
              { label: "Wind", value: `${weather.wind} km/h`, icon: "💨" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 p-3 rounded-2xl"
                style={{
                  backgroundColor: "rgba(22,27,51,0.05)",
                  border: "1px solid rgba(22,27,51,0.08)",
                }}
              >
                <span className="text-lg">{stat.icon}</span>
                <span
                  className="text-sm font-bold"
                  style={{ color: "#161b33" }}
                >
                  {stat.value}
                </span>
                <span className="text-[10px]" style={{ color: "#a69cac" }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── Quick Actions ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
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
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + i * 0.07, duration: 0.35 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveSection(action.id)}
                className="flex flex-col items-center gap-2 p-4 rounded-3xl cursor-pointer transition-all duration-200"
                style={{
                  background:
                    activeSection === action.id
                      ? "linear-gradient(135deg, #474973, #161b33)"
                      : "rgba(22,27,51,0.06)",
                  border:
                    activeSection === action.id
                      ? "none"
                      : "1.5px solid rgba(22,27,51,0.1)",
                  boxShadow:
                    activeSection === action.id
                      ? "0 8px 24px rgba(71,73,115,0.35)"
                      : "none",
                }}
              >
                <span className="text-2xl">{action.icon}</span>
                <span
                  className="text-xs font-bold text-center leading-tight"
                  style={{
                    color:
                      activeSection === action.id ? "#f1dac4" : "#161b33",
                  }}
                >
                  {action.label}
                </span>
                <span
                  className="text-[10px] text-center"
                  style={{ color: "#a69cac" }}
                >
                  {action.description}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* ── Weather Card ── */}
        <motion.section
          id="weather"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8"
        >
          <h2
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#a69cac" }}
          >
            Weather
          </h2>
          <WeatherCard data={weather} />
        </motion.section>

        {/* ── Alerts ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8"
        >
          <AlertCard alerts={alerts} />
        </motion.div>

        {/* ── Crop Planner ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-8"
        >
          <PlannerCard crops={crops} />
        </motion.div>

        {/* ── Footer ── */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center pb-2"
        >
          <div
            className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full"
            style={{
              backgroundColor: "rgba(22,27,51,0.06)",
              color: "#a69cac",
            }}
          >
            <span>🌿</span>
            <span>Hinga+ · Smart Farming Assistant</span>
          </div>
        </motion.footer>
      </main>
    </div>
  );
}
