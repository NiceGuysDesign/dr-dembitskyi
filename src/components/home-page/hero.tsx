"use client";

import React from "react";
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
  return (
    <section className="relative w-full min-h-screen overflow-hidden pt-[120px]">
      {/* Main content container */}
      <div className="relative">

        <div className="relative flex justify-between items-end">
          {/* Large heading "Andry" */}
          <h1 className="relative font-manrope font-bold text-[19vw] leading-[100%] tracking-[-0.05em] text-[var(--color-gray)]">
            Andry
            <span className="absolute left-[-7px] top-[371px] font-manrope font-bold text-[19vw] leading-[100%] tracking-[-0.05em] text-[var(--color-gray)] z-20 whitespace-nowrap">
              Dembitskyi
            </span>
          </h1>

          {/* Image in center */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[-30%] z-10">
            <Image
              src={heroData.image}
              width={1021}
              height={1022}
              alt={heroData.imageAlt}
              className="object-cover w-full h-full"
              unoptimized={true}
              priority
            />
          </div>

          {/* Description and buttons - right side */}
          <div className="right-[60px] top-[210px] w-[460px] flex flex-col gap-6 z-30">
            {/* Description text */}
            <p className="font-manrope font-semibold text-base leading-[150%] tracking-[-0.03em] text-black">
              {heroData.description}
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <Button
                variant="default"
                style={{ background: "var(--gradient-button)" }}
                className="min-w-[242px]"
              >
                Консультація
              </Button>
              <Button variant="link" className="flex flex-col gap-2">
                Послуги <span className="h-[2px] bg-black w-full"></span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 bg-gradient-to-t from-[var(--color-bg-light)] to-transparent w-full h-[300px] z-10"></div>
    </section>
  );
}
