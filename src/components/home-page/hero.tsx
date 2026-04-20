"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import Image from "next/image";
import { useConsultation } from "../consultation/consultation-provider";
import Link from "next/link";
import { HeroData } from "@/strapi/hero";

interface HeroProps {
  heroData: HeroData;
  lang: string;
}

export default function Hero({ heroData, lang }: HeroProps) {
  const { t } = useTranslation();
  const { openConsultation } = useConsultation();

  // Split title into first and last name
  const titleParts = heroData.title.split(" ");
  const firstName = titleParts[0] || "";
  const lastName = titleParts.slice(1).join(" ") || "";
  return (
    <section className="relative w-full h-[100vh] md:h-[90vh] lg:h-screen overflow-hidden pt-[100px] md:pt-[120px]">
      {/* Main content container */}
      <div className="relative px-[10px] md:px-5 h-full">
        <div className="relative flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-0 h-full">
          {/* Large heading */}
          <h1 className="hidden md:flex relative font-manrope font-bold leading-[100%] tracking-[-0.05em] text-[var(--color-gray)] text-[18vw] md:text-[18vw] xl:text-[19vw] flex-col md:mt-20 xl:mt-0 pointer-events-none">
            {firstName}
            {lastName && <span className="relative z-20">{lastName}</span>}
          </h1>

          <h1 className="mb-10 relative z-30 md:hidden font-manrope font-bold leading-[100%] tracking-[-0.05em] text-[var(--color-gray)] text-[17vw] md:text-[18vw] xl:text-[19vw] flex flex-col md:mt-20 xl:mt-0">
            {heroData.title}
          </h1>

          {/* Image in center */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-20 md:bottom-0 z-10 w-[460px] md:w-[600px] lg:w-[1021px] h-auto max-h-[calc(100vh-120px)] md:max-h-[calc(90vh-120px)] lg:max-h-[calc(100vh-60px)]">
            <Image
              src={heroData.image}
              width={1021}
              height={1022}
              alt={heroData.imageAlt}
              className="object-contain w-full h-full"
              unoptimized={true}
              priority
            />
          </div>

          {/* Description and buttons - right side */}
          <div className="absolute bottom-0 left-0 lg:bottom-auto md:right-5 lg:top-[5%] lg:left-auto z-30 md:max-w-[50%] lg:max-w-[30%] flex flex-col gap-4 py-10 lg:py-0">
            {/* Description text */}
            <p className="font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-black">
              {heroData.description}
            </p>

            {/* Buttons */}
            <div className="flex flex-row items-center gap-4">
              <Button
                variant="default"
                style={{ background: "var(--gradient-button)" }}
                className="min-w-[242px] sm:w-auto"
                onClick={openConsultation}
              >
                {t("header.consultation")}
              </Button>

              <Link href={`/${lang}/services`}>
                <Button
                  variant="link"
                  className="flex flex-col gap-2 items-start sm:items-center"
                >
                  {t("navigation.services")}
                  <span className="h-[2px] bg-black w-full"></span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-20 md:bottom-0 bg-gradient-to-t from-[var(--color-bg-light)] to-transparent w-full h-[60vh] md:h-[300px] z-10"></div>
    </section>
  );
}
