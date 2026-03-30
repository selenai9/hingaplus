"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Alert } from "@/lib/mockData";

interface AlertCardProps {
  alerts: Alert[];
}

function severityConfig(severity: Alert["severity"]) {
  switch (severity) {
    case "warning":
      return {
        icon: "⚠️",
        borderColor: "#474973",
        badgeBg: "rgba(71,73,115,0.15)",
        badgeText: "#474973",
        badgeLabel: "Warning",
      };
    case "danger":
      return {
        icon: "🚨",
        borderColor: "#a69cac",
        badgeBg: "rgba(166,156,172,0.15)",
        badgeText: "#a69cac",
        badgeLabel: "Danger",
      };
    case "info":
    default:
      return {
        icon: "ℹ️",
        borderColor: "#161b33",
        badgeBg: "rgba(22,27,51,0.1)",
        badgeText: "#161b33",
        badgeLabel: "Info",
      };
  }
}

function SingleAlert({ alert }: { alert: Alert }) {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const config = severityConfig(alert.severity);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          layout
          initial={{ opacity: 0, y: -20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="rounded-3xl overflow-hidden"
          style={{
            backgroundColor: "#f1dac4",
            border: `2px solid ${config.borderColor}`,
            boxShadow: "0 4px 24px rgba(22,27,51,0.08)",
          }}
        >
          {/* Card Header */}
          <div className="p-4 flex items-start gap-3">
            {/* Icon */}
            <span className="text-2xl mt-0.5 shrink-0">{config.icon}</span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3
                  className="font-bold text-base leading-tight"
                  style={{ color: "#0d0c1d" }}
                >
                  {alert.title}
                </h3>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: config.badgeBg,
                    color: config.badgeText,
                    border: `1px solid ${config.borderColor}`,
                  }}
                >
                  {config.badgeLabel}
                </span>
              </div>

              <AnimatePresence initial={false}>
                {expanded ? (
                  <motion.p
                    key="full"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-sm leading-relaxed"
                    style={{ color: "#474973" }}
                  >
                    {alert.message}
                  </motion.p>
                ) : (
                  <motion.p
                    key="short"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm leading-relaxed line-clamp-2"
                    style={{ color: "#474973" }}
                  >
                    {alert.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px mx-4"
            style={{ backgroundColor: `${config.borderColor}30` }}
          />

          {/* Actions */}
          <div className="p-3 flex items-center gap-2">
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="flex-1 py-2.5 px-4 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-95"
              style={{
                backgroundColor: "#474973",
                color: "#f1dac4",
              }}
            >
              {expanded ? "Show Less" : "View Details"}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="flex-1 py-2.5 px-4 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-95"
              style={{
                backgroundColor: "transparent",
                color: "#a69cac",
                border: "2px solid #a69cac",
              }}
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AlertCard({ alerts }: AlertCardProps) {
  const [allDismissed, setAllDismissed] = useState(false);

  return (
    <section id="alerts">
      <div className="flex items-center justify-between mb-3">
        <h2
          className="text-lg font-bold flex items-center gap-2"
          style={{ color: "#0d0c1d" }}
        >
          <span>🔔</span> Alerts
        </h2>
        {!allDismissed && (
          <button
            onClick={() => setAllDismissed(true)}
            className="text-xs font-medium px-3 py-1 rounded-full transition-all duration-200"
            style={{
              color: "#a69cac",
              border: "1px solid #a69cac",
            }}
          >
            Clear All
          </button>
        )}
      </div>

      <AnimatePresence>
        {allDismissed ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-10 rounded-3xl"
            style={{
              backgroundColor: "rgba(22,27,51,0.04)",
              border: "2px dashed rgba(22,27,51,0.15)",
            }}
          >
            <span className="text-4xl mb-2">✅</span>
            <p className="text-sm font-medium" style={{ color: "#a69cac" }}>
              All alerts cleared
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            {alerts.map((alert) => (
              <SingleAlert key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
