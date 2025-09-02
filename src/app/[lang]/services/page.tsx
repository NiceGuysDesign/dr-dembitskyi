"use client";

import { Container } from "@/components/ui/container";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import React from "react";

export default function ServicesPage() {
  const { t } = useTranslation();
  return (
    <Container variant="content">
      <div>
        <h1 className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
          {t("services.title")}
        </h1>
      </div>
      <div className="flex flex-col gap-4 items-center justify-center">
        <Link href="/services/1">{t("services.service1")}</Link>
        <Link href="/services/2">{t("services.service2")}</Link>
        <Link href="/services/3">{t("services.service3")}</Link>
      </div>
    </Container>
  );
}
