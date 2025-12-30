"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import Image from "next/image";

const heroData = {
  title: "Andry Dembitskyi",
  description:
    "Пластичний хірург із багаторічним досвідом, який поєднує професіоналізм, сучасні технології та уважне ставлення до кожного пацієнта. Моя мета – не просто змінювати зовнішність, а робити її гармонійною і здоровою.",
  image: "/images/unnamed-2 2.png",
  imageAlt: "Dr. Andry Dembitskyi",
};

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full h-[100vh] md:h-[90vh] lg:h-screen overflow-hidden pt-[100px] md:pt-[120px]">
      {/* Main content container */}
      <div className="relative px-[10px] md:px-5 h-full">
        <div className="relative flex flex-col md:flex-row justify-start items-center md:items-start gap-8 md:gap-0 h-full">
          {/* Large heading "Andry" */}
          <h1 className="relative font-manrope font-bold leading-[100%] tracking-[-0.05em] text-[var(--color-gray)] text-[18vw] md:text-[18vw] xl:text-[19vw] flex flex-col md:mt-20 xl:mt-0">
            Andry
            <span className="relative z-20">Dembitskyi</span>
          </h1>

          {/* Image in center */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 z-10 w-[600px] lg:w-[1021px] h-auto max-h-[calc(100vh-120px)] md:max-h-[calc(90vh-120px)] lg:max-h-[calc(100vh-60px)]">
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
            <div className="flex flex-row items-stretch sm:items-center gap-4">
              <Button
                variant="default"
                style={{ background: "var(--gradient-button)" }}
                className="min-w-[242px] sm:w-auto"
              >
                {t("header.consultation")}
              </Button>
              <Button
                variant="link"
                className="flex flex-col gap-2 items-start sm:items-center"
              >
                {t("navigation.services")}{" "}
                <span className="h-[2px] bg-black w-full"></span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 bg-gradient-to-t from-[var(--color-bg-light)] to-transparent w-full h-[50vh] md:h-[300px] z-10"></div>
    </section>
  );
}
