"use client";
import { useLanguage } from "@/lib/LanguageContext";

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "rw" : "en")}
      className="px-3 py-1 rounded-full border border-green-600 text-sm font-medium
                 text-green-700 hover:bg-green-50 transition-colors"
      aria-label="Switch language"
    >
      {locale === "en" ? "🇷🇼 Kinyarwanda" : "🇬🇧 English"}
    </button>
  );
}
