"use client";

import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useConsultation } from "../consultation/consultation-provider";

const ctaData = {
  title1: "Все починається",
  title2: "з розмови",
  description:
    "Пластичний хірург із багаторічним досвідом, який поєднує професіоналізм, сучасні технології та уважне ставлення до кожного пацієнта. Моя мета – не просто змінювати зовнішність, а робити її гармонійною і здоровою.",
  buttonText: "Записатись на відео-консультацію",
  image: "/images/unnamed-2 2.png",
  imageAlt: "Dr. Dembitskyi",
};

export default function CTASection2() {
  const { openConsultation } = useConsultation();

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background gradient blur effect - lower z-index */}
      <div className="absolute bottom-0 bg-gradient-to-t from-[#F4F4F5] to-transparent w-full h-[50vh] md:h-[300px] z-[30]"></div>

      <div className="px-[10px] md:px-5 py-10 md:py-20">
        <div className="relative">
          {/* Left side - Content */}
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Title 1 */}
            <h2 className="font-manrope font-bold text-[80px] md:text-[120px] lg:text-[179px] leading-[100%] tracking-[-0.05em] text-[#353556] flex flex-col">
              {ctaData.title1}
              <span className="text-start ml-[10%]">{ctaData.title2}</span>
            </h2>

            {/* Description */}
            <div className="flex flex-col gap-6 lg:gap-8 pl-[10%] mt-[160px] relative z-40">
              <div className="max-w-[460px]">
                <p className="font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-black">
                  {ctaData.description}
                </p>
              </div>

              {/* Button */}
              <div>
                <Button
                  onClick={openConsultation}
                  className="w-full sm:w-[327px] h-[66px] min-h-[54px] rounded-[50px] font-inter font-medium text-base leading-[100%] tracking-[-0.01em] text-white"
                  style={{
                    background:
                      "radial-gradient(114.39% 151.52% at 50% 151.52%, #000000 0%, #3A3A45 100%)",
                  }}
                >
                  {ctaData.buttonText}
                </Button>
              </div>
            </div>
          </div>

          {/* Right side - Image (absolute positioned) */}
          <div className="z-20 absolute right-0 top-0 w-full lg:w-[1021px] h-[400px] md:h-[600px] lg:h-[1022px] pointer-events-none lg:pointer-events-auto">
            <Image
              src={ctaData.image}
              alt={ctaData.imageAlt}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}
