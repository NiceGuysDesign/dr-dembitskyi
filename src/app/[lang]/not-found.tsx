"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <Container variant="content">
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <p className="text-4xl font-bold">404</p>
        <h1 className="text-2xl font-bold">{t("notFound.title")}</h1>
        <p className="text-lg">{t("notFound.description")}</p>
        <Link href="/" className="text-lg">
          {t("notFound.link")}
        </Link>
      </div>
    </Container>
  );
}
