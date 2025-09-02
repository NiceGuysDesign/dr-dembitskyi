"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

export default function Hero() {
  const { t } = useTranslation()
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-4xl font-bold"> {t("hero.title")} </h1>
      <p className="text-lg text-gray-500"> {t("hero.description")} </p>
      <Button variant="default">Test Button</Button>
      <Button variant="destructive">Test Button</Button>
      <Button variant="outline">Test Button</Button>
      <Button variant="secondary">Test Button</Button>
      <Button variant="ghost">Test Button</Button>
      <Button variant="link">Test Button</Button>
    </div>
  );
}