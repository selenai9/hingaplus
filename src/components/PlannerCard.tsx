"use client";

import { motion } from "framer-motion";
import type { Crop } from "@/lib/mockData";

interface PlannerCardProps {
  crops: Crop[];
}

function StatusBadge({ status }: { status: Crop["status"] }) {
  const isGood = status === "Good";

  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
      style={{
        backgroundColor: isGood
          ? "rgba(71,73,115,0.12)"
          : "rgba(166,156,172,0.15)",
        color: isGood ? "#474973" : "#a69cac",
        border: `1.5px solid ${isGood ? "#474973" : "#a69cac"}`,
      }}
    >
      <span>{isGood ? "✅" : "⚠️"}</span>
      {status}
    </span>
  );
}

function CropRow({ crop, index }: { crop: Crop; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      whileHover={{ x: 4 }}
      className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-200"
      style={{
        backgroundColor: "rgba(22,27,51,0.04)",
        border: "1.5px solid rgba(22,27,51,0.08)",
      }}
    >
      {/* Crop icon */}
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0"
        style={{ backgroundColor: "rgba(71,73,115,0.1)" }}
      >
        {crop.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm" style={{ color: "#0d0c1d" }}>
          {crop.name}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs" style={{ color: "#a69cac" }}>
            📅
          </span>
          <span className="text-xs font-medium" style={{ color: "#474973" }}>
            Plant on {crop.day}
          </span>
        </div>
      </div>

      {/* Status */}
      <StatusBadge status={crop.status} />
    </motion.div>
  );
}

export default function PlannerCard({ crops }: PlannerCardProps) {
  const goodCount = crops.filter((c) => c.status === "Good").length;
  const riskyCount = crops.filter((c) => c.status === "Risky").length;

  return (
    <section id="planner">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-lg font-bold flex items-center gap-2"
          style={{ color: "#0d0c1d" }}
        >
          <span>🌱</span> Crop Planner
        </h2>
        <span
          className="text-xs font-medium px-3 py-1 rounded-full"
          style={{
            backgroundColor: "rgba(71,73,115,0.1)",
            color: "#474973",
          }}
        >
          This Week
        </span>
      </div>

      {/* Summary pills */}
      <div className="flex gap-2 mb-4">
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: "rgba(71,73,115,0.1)",
            color: "#474973",
          }}
        >
          <span>✅</span>
          <span>{goodCount} Good</span>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: "rgba(166,156,172,0.12)",
            color: "#a69cac",
          }}
        >
          <span>⚠️</span>
          <span>{riskyCount} Risky</span>
        </div>
      </div>

      {/* Crops list */}
      <div className="flex flex-col gap-2.5">
        {crops.map((crop, i) => (
          <CropRow key={crop.id} crop={crop} index={i} />
        ))}
      </div>

      {/* Footer tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 p-3 rounded-2xl flex items-start gap-2"
        style={{
          backgroundColor: "rgba(71,73,115,0.08)",
          border: "1px solid rgba(71,73,115,0.15)",
        }}
      >
        <span className="text-base shrink-0">💡</span>
        <p className="text-xs leading-relaxed" style={{ color: "#474973" }}>
          <strong>Tip:</strong> Risky crops may face adverse weather. Consider
          delaying or providing additional irrigation.
        </p>
      </motion.div>
    </section>
  );
}
