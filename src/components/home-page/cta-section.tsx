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
    <section className="relative w-full bg-[var(--color-bg-light)] overflow-hidden h-[90vh] lg:min-h-screen py-0 lg:h-screen flex items-center">
      {/* Background decorative element */}
      <div className="absolute left-[-20%] md:left-[-10%] top-0 h-[20vh] md:h-[25vh] lg:h-[30vh] w-full">
        <Image
          src="/images/image 42 (Traced).png"
          fill
          alt="CTA Section Background"
          className="object-contain h-full w-full"
        />
      </div>

      {/* Main content container */}
      <div className="relative px-[10px] md:px-5 w-full">
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-8 md:gap-12 lg:gap-20">
          {/* Image on the left */}
          <div className="relative w-full max-w-[70vw] md:max-w-[60vw] lg:max-w-[50vw] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[823px] lg:flex-shrink-0 ml-[-20px]">
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
          <div className="flex flex-col gap-3 md:gap-4 w-full lg:max-w-[50%]">
            {/* Title 1 */}
            <h2 className="font-manrope font-bold text-[10vw] sm:text-[8vw] md:text-[6vw] lg:text-[5vw] xl:text-[92px] leading-[100%] tracking-[-0.05em] text-[var(--color-gray)] flex flex-col gap-1">
              {ctaData.title1}
              <span className="text-center ml-0 lg:text-start md:ml-[-15%] lg:ml-[-20%]">
                {ctaData.title2}
              </span>
            </h2>

            {/* Description */}
            <p className="font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-black m-0 mt-4 md:mt-6">
              {ctaData.description}
            </p>

            {/* Button */}
            <div className="mt-4 md:mt-6">
              <Button
                variant="default"
                style={{ background: "var(--gradient-button)" }}
                className="w-full sm:w-auto sm:min-w-[280px] md:min-w-[327px] h-[54px] md:h-[66px] min-h-[54px] text-sm md:text-base"
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
