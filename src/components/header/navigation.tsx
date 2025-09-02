"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Navigation() {
  const { t } = useTranslation();
  const params = useParams() as { lang?: string };
  const lang = params?.lang ?? "uk";  
  return (
    <nav>
      <ul className="flex gap-4 items-center justify-center">
        <li>
          <Link href={`/${lang}`}>{t("navigation.home")}</Link>
        </li>
        <li>
          <Link href={`/${lang}/services`}>{t("navigation.services")}</Link>
        </li>
        <li>
          <Link href={`/${lang}/blog`}>{t("navigation.blog")}</Link>
        </li>
        <li>
          <Link href={`/${lang}/patients`}>{t("navigation.patients")}</Link>
        </li>
        <li>
          <Link href={`/${lang}/about`}>{t("navigation.about")}</Link>
        </li>
        <li>
          <Link href={`/${lang}/contacts`}>{t("navigation.contacts")}</Link>
        </li>
      </ul>
    </nav>
  );
}
