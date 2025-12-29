"use client";

import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";

const ctaData = {
  title1: "Все починається",
  title2: "з розмови",
  description:
    "Пластичний хірург із багаторічним досвідом, який поєднує професіоналізм, сучасні технології та уважне ставлення до кожного пацієнта. Моя мета – не просто змінювати зовнішність, а робити її гармонійною і здоровою.",
  buttonText: "Записатись на відео-консультацію",
  image: "/images/0655537E-4939-4EA3-AC61-75FE37A2B3BE-Photoroom 1.png",
  imageAlt: "Dr. Dembitskyi",
};

export default function CTASection() {
  return (
    <section className="relative w-full bg-[var(--color-bg-light)] overflow-hidden h-screen">
      {/* Background decorative element */}
      <div className="absolute left-[-20%] top-0 h-[30vh] w-full">
        <Image
          src="/images/image 42 (Traced).png"
          fill
          alt="CTA Section Background"
          className="object-contain  h-full w-full"
        />
      </div>

      {/* Main content container */}
      <div className="relative px-5">
        <div className="relative flex flex-col lg:flex-row items-center lg:items-center gap-10">
          {/* Image on the left */}
          <div className="relative w-full max-w-[823px] h-[400px] sm:h-[600px] lg:h-[823px] lg:flex-shrink-0 ml-[-20px]">
            <Image
              src={ctaData.image}
              width={823}
              height={823}
              alt={ctaData.imageAlt}
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>

          {/* Content on the right */}
          <div className="flex flex-col gap-4 w-full ">
            {/* Title 1 */}
            <h2 className="font-manrope font-bold text-5xl sm:text-6xl lg:text-[92px] leading-[100%] tracking-[-0.05em] text-[var(--color-gray)] flex flex-col gap-2">
              {ctaData.title1}
              <span className="text-start ml-[-20%]">{ctaData.title2}</span>
            </h2>

            {/* Description */}
            <p className="font-manrope font-semibold text-base leading-[150%] tracking-[-0.03em] text-black m-0 mt-6">
              {ctaData.description}
            </p>

            {/* Button */}
            <div className="mt-6">
              <Button
                variant="default"
                style={{ background: "var(--gradient-button)" }}
                className="w-full sm:w-[327px] h-[66px] min-h-[54px]"
              >
                {ctaData.buttonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
