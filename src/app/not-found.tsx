"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { defaultLocale } from "@/i18n/config";
import i18n from "@/i18n/i18n";
import { uk } from "@/i18n/locales/uk";
import { en } from "@/i18n/locales/en";
import { gsap } from "gsap";
import "@/app/globals.css";

// Static translations as fallback
const translations: Record<string, Record<string, string>> = {
  uk: {
    "notFound.title": "Не знайдено",
    "notFound.description": "Сторінку, яку ви шукаєте, не знайдено.",
    "notFound.backHome": "Повернутися на головну сторінку",
    "navigation.services": "Послуги",
    "navigation.home": "Головна",
  },
  en: {
    "notFound.title": "Not Found",
    "notFound.description": "The page you are looking for was not found.",
    "notFound.backHome": "Back to Home",
    "navigation.services": "Services",
    "navigation.home": "Home",
  },
};

export default function GlobalNotFound() {
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Extract lang from pathname or use default
  const pathSegments = pathname.split("/").filter(Boolean);
  const lang =
    pathSegments[0] && ["uk", "en"].includes(pathSegments[0])
      ? pathSegments[0]
      : defaultLocale;

  useEffect(() => {
    // Initialize i18n if not already initialized
    if (!i18n.isInitialized) {
      i18n.init({
        resources: {
          uk: { translation: uk },
          en: { translation: en },
        },
        fallbackLng: defaultLocale,
        lng: lang,
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      });
    } else {
      i18n.changeLanguage(lang);
    }
    setIsReady(true);
  }, [lang]);

  // Animation on mount
  useEffect(() => {
    if (!isReady) return;

    const number = numberRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;
    const buttons = buttonsRef.current;

    if (!number || !title || !description || !buttons) return;

    // Set initial state
    gsap.set([number, title, description, buttons], {
      opacity: 0,
      y: 30,
    });

    // Create timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animate elements sequentially
    tl.to(number, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
    })
      .to(
        title,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        "-=0.4"
      )
      .to(
        description,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        "-=0.4"
      )
      .to(
        buttons,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        "-=0.4"
      );

    return () => {
      tl.kill();
    };
  }, [isReady]);

  // Use static translations as fallback
  const t = (key: string): string => {
    if (isReady && i18n.isInitialized) {
      return i18n.t(key) || translations[lang]?.[key] || key;
    }
    return translations[lang]?.[key] || key;
  };

  return (
    <main className="relative w-full bg-[#F4F4F5] min-h-screen flex items-center justify-center">
      <div
        ref={containerRef}
        className="px-[10px] md:px-5 w-full max-w-[1440px] mx-auto"
      >
        <section className="relative py-10 flex flex-col items-center justify-center text-center">
          {/* 404 Number */}
          <div className="mb-6 md:mb-8">
            <h1
              ref={numberRef}
              className="font-manrope font-bold text-[120px] md:text-[180px] lg:text-[240px] leading-[100%] tracking-[-0.05em] text-[#353556]"
            >
              404
            </h1>
          </div>

          {/* Title */}
          <div className="mb-4 md:mb-6">
            <h2
              ref={titleRef}
              className="font-manrope font-bold text-[32px] md:text-[48px] lg:text-[64px] leading-[100%] tracking-[-0.05em] text-[#353556]"
            >
              {t("notFound.title")}
            </h2>
          </div>

          {/* Divider */}
          <div className="h-[1px] w-full max-w-[200px] bg-[#1B1661] opacity-40 mb-6 md:mb-8" />

          {/* Description */}
          <div className="mb-8 md:mb-12 max-w-[600px]">
            <p
              ref={descriptionRef}
              className="font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-black"
            >
              {t("notFound.description")}
            </p>
          </div>

          {/* Buttons */}
          <div
            ref={buttonsRef}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href={`/${lang}`}>
              <Button
                variant="default"
                style={{ background: "var(--gradient-button)" }}
                className="min-w-[242px] sm:w-auto"
              >
                {t("navigation.home")}
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
