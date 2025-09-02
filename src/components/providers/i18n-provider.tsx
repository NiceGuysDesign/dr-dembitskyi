"use client";

import { useEffect, useState } from "react";
import i18n from "@/i18n/i18n";
import { useParams } from "next/navigation";

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  const params = useParams();
  const lang = params?.lang as string;

  useEffect(() => {
    if (!lang) return;

    if (!i18n.isInitialized) {
      // i18n is initialized synchronously in i18n.ts with local resources
    }

    i18n.changeLanguage(lang);
    setIsClient(true);
  }, [lang]);

  if (!isClient || !lang) {
    return null;
  }

  return <>{children}</>;
}
