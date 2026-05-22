"use client";
import React, { useState, useRef, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { type Locale } from "@/i18n/config";
import {
  getSegmentsFromPathname,
  localePath,
} from "@/i18n/routing";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams() as { lang?: string };
  const currentLang = (params.lang as Locale) || "uk";
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleMouseEnter() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
  }

  function handleMouseLeave() {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  }

  async function switchLanguage(lang: Locale) {
    if (!pathname) return;

    if (lang === currentLang) {
      setIsHovered(false);
      return;
    }

    try {
      const res = await fetch("/api/i18n/resolve", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pathname, targetLocale: lang }),
      });

      if (res.ok) {
        const data = (await res.json()) as { pathname?: string };
        const nextPath = data?.pathname;
        if (typeof nextPath === "string" && nextPath.length > 0) {
          router.push(nextPath);
          setIsHovered(false);
          return;
        }
      }
    } catch {
      // ignore and fall back
    }

    const segments = getSegmentsFromPathname(pathname);
    router.push(localePath(lang, ...segments));
    setIsHovered(false);
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="w-[40px] h-[40px] cursor-pointer rounded-full border border-black flex items-center justify-center font-manrope font-semibold text-sm leading-[130%] tracking-[-0.02em] text-[#353556] hover:opacity-80 transition-opacity">
        {currentLang === "uk" ? "UK" : "EN"}
      </button>

      {isHovered && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-black rounded-lg shadow-lg overflow-hidden z-50 min-w-[80px]">
          <button
            onClick={() => switchLanguage("uk")}
            className={`w-full px-4 py-2 text-left font-manrope font-semibold text-sm leading-[130%] tracking-[-0.02em] transition-all cursor-pointer ${
              currentLang === "uk"
                ? "bg-[#353556] text-white"
                : "bg-transparent text-[#353556] hover:bg-[#353556]/10"
            }`}
          >
            UK
          </button>
          <button
            onClick={() => switchLanguage("en")}
            className={`w-full px-4 py-2 text-left font-manrope font-semibold text-sm leading-[130%] tracking-[-0.02em] transition-all cursor-pointer ${
              currentLang === "en"
                ? "bg-[#353556] text-white"
                : "bg-transparent text-[#353556] hover:bg-[#353556]/10"
            }`}
          >
            EN
          </button>
        </div>
      )}
    </div>
  );
}
