"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
import { type Locale } from "@/i18n/config";
import { localePath } from "@/i18n/routing";

export default function Navigation() {
  const { t } = useTranslation();
  const params = useParams() as { lang?: string };
  const locale = (params?.lang ?? "uk") as Locale;
  return (
    <nav>
      <ul className="flex gap-4 items-center justify-center">
        <li>
          <Link href={localePath(locale)}>{t("navigation.home")}</Link>
        </li>
        <li>
          <Link href={localePath(locale, "services")}>
            {t("navigation.services")}
          </Link>
        </li>
        <li>
          <Link href={localePath(locale, "blog")}>{t("navigation.blog")}</Link>
        </li>
        <li>
          <Link href={localePath(locale, "patients")}>
            {t("navigation.patients")}
          </Link>
        </li>
        <li>
          <Link href={localePath(locale, "about")}>{t("navigation.about")}</Link>
        </li>
        <li>
          <Link href={localePath(locale, "contacts")}>
            {t("navigation.contacts")}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
