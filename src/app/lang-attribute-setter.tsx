"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { defaultLocale } from "@/i18n/config";

export default function LangAttributeSetter() {
  const pathname = usePathname();

  useEffect(() => {
    // Extract lang from pathname
    const pathSegments = pathname.split("/").filter(Boolean);
    const lang =
      pathSegments[0] && ["uk", "en"].includes(pathSegments[0])
        ? pathSegments[0]
        : defaultLocale;

    // Update html lang attribute
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [pathname]);

  return null;
}
