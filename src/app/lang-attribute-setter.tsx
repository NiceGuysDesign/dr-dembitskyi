"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { defaultLocale } from "@/i18n/config";

export default function LangAttributeSetter() {
  const pathname = usePathname();

  useEffect(() => {
    // Extract lang from pathname
    const lang = pathname.startsWith("/en") ? "en" : defaultLocale;

    // Update html lang attribute
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [pathname]);

  return null;
}
