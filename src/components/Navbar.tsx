"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/lib/LanguageContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("navHome");
  const { t } = useLanguage();

  const navLinks = [
    { key: "navHome",    label: t("navHome"),    href: "#home",    icon: "🏠" },
    { key: "navWeather", label: t("navWeather"), href: "#weather", icon: "🌦" },
    { key: "navPlanner", label: t("navPlanner"), href: "#planner", icon: "🌱" },
    { key: "navAlerts",  label: t("navAlerts"),  href: "#alerts",  icon: "🔔" },
  ];

  return (
    <>
      <nav style={{ backgroundColor: "#161b33" }} className="fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold tracking-tight" style={{ color: "#f1dac4" }}>
              Hinga<span style={{ color: "#a69cac" }}>+</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a key={link.key} href={link.href} onClick={() => setActive(link.key)} className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200" style={{ color: active === link.key ? "#f1dac4" : "#a69cac", backgroundColor: active === link.key ? "rgba(71,73,115,0.6)" : "transparent" }}>
                {link.label}
              </a>
            ))}
            <div className="ml-2">
              <LanguageToggle />
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LanguageToggle />
            <button className="flex flex-col gap-1.5 p-2 rounded-xl" onClick={() => setMenuOpen((prev) => !prev)} aria-label="Toggle menu">
              <span className="block w-5 h-0.5 transition-all duration-300 origin-center" style={{ backgroundColor: "#f1dac4", transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
              <span className="block w-5 h-0.5 transition-all duration-300" style={{ backgroundColor: "#f1dac4", opacity: menuOpen ? 0 : 1 }} />
              <span className="block w-5 h-0.5 transition-all duration-300 origin-center" style={{ backgroundColor: "#f1dac4", transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="overflow-hidden md:hidden" style={{ backgroundColor: "#0d0c1d" }}>
              <div className="max-w-lg mx-auto px-4 py-3 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a key={link.key} href={link.href} onClick={() => { setActive(link.key); setMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200" style={{ color: active === link.key ? "#f1dac4" : "#a69cac", backgroundColor: active === link.key ? "rgba(71,73,115,0.5)" : "transparent" }}>
                    <span className="text-base">{link.icon}</span>
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden" style={{ backgroundColor: "#161b33", borderTop: "1px solid rgba(71,73,115,0.4)" }}>
        <div className="max-w-lg mx-auto flex items-center justify-around h-16">
          {navLinks.map((link) => (
            <a key={link.key} href={link.href} onClick={() => setActive(link.key)} className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200">
              <span className="text-xl leading-none">{link.icon}</span>
              <span className="text-[10px] font-medium" style={{ color: active === link.key ? "#f1dac4" : "#a69cac" }}>
                {link.label}
              </span>
              {active === link.key && (
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "#474973" }} />
              )}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
