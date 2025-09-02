"use client";
import React from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams() as { lang?: string };
  const currentLang = (params.lang as Locale) || "uk";

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nextLang = e.target.value as Locale;
    if (!pathname) return;
    const segments = pathname.split("/");
    if (segments[1] && locales.includes(segments[1] as Locale)) {
      segments[1] = nextLang;
    } else {
      segments.splice(1, 0, nextLang);
    }
    const nextPath = segments.join("/") || `/${nextLang}`;
    router.push(nextPath);
  }

  return (
    <div>
      <select value={currentLang} onChange={onChange}>
        <option value="uk">UK</option>
        <option value="en">US</option>
      </select>
    </div>
  );
}
