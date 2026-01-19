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
    <section className="relative h-[70vh] md:h-[80vh] lg:h-[100vh] w-full overflow-hidden">
      {/* Background gradient blur effect - lower z-index */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#F4F4F5] to-transparent w-full h-[50vh] md:h-[300px] z-[30]"></div>

      {/* Right side - Image (absolute positioned, fixed to bottom of section) */}
      <div className="absolute right-0 bottom-0 md:z-20 z-0 w-full h-[70vh] sm:h-[80vh] md:w-[400px] md:h-[600px] lg:w-[700px] lg:h-[760px] 2xl:w-[1021px] 2xl:h-[100vh] pointer-events-none lg:pointer-events-auto">
        <Image
          src={ctaData.image}
          alt={ctaData.imageAlt}
          fill
          className="object-cover md:object-contain object-bottom"
          unoptimized
        />
      </div>

      <div className="px-[10px] md:px-5 py-10 md:py-20 relative z-40 md:z-10 h-full flex flex-col justify-center md:justify-start">
        <div className="relative z-10">
          {/* Left side - Content */}
          <div className="flex flex-col  gap-6 lg:gap-8">
            {/* Title 1 */}
            <h2 className="relative z-10 md:z-[-1] font-manrope font-bold text-[10vw] md:text-[84px] lg:text-[122px] xl:text-[122px] 2xl:text-[179px] leading-[100%] tracking-[-0.05em] text-[#353556] flex flex-col">
              {ctaData.title1}
              <span className="text-start md:ml-[10%] lg:ml-[0%] xl:ml-[0%] 2xl:ml-[10%]">{ctaData.title2}</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Description and Button - Outside parent container to avoid stacking context issues */}
      <div className="absolute bottom-10 md:bottom-20 z-[50] px-[10px] md:px-5">
        <div className="flex flex-col gap-6 lg:gap-8 md:pl-[10%]">
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
    </section>
  );
}
