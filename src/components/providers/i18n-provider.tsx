"use client";

import { useEffect } from "react";
import i18n from "@/i18n/i18n";

export default function I18nProvider({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  useEffect(() => {
    if (!lang) return;

    if (!i18n.isInitialized) {
      // i18n is initialized synchronously in i18n.ts with local resources
    }

    i18n.changeLanguage(lang);
  }, [lang]);

  return <>{children}</>;
}
