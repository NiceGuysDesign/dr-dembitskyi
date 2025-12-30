"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Container } from "../ui/container";
import { packages } from "@/data/packages";
import { initEffect031 } from "@/animations/sections/effect031";

export default function PackagesSection() {
  const { t } = useTranslation();

  useEffect(() => {
    // Невелика затримка для забезпечення того, що DOM оновився
    const timer = setTimeout(async () => {
      try {
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        const { gsap } = await import("gsap");

        const cleanup = initEffect031();
        if (cleanup) {
          // Оновлюємо ScrollTrigger після ініціалізації
          ScrollTrigger.refresh();

          // Додаткова перевірка: переконуємося, що всі картки видимі
          setTimeout(() => {
            const contents = document.querySelectorAll<HTMLElement>(
              "#effect031 .content"
            );
            contents.forEach((content) => {
              // Якщо картка прихована, показуємо її
              const computedStyle = window.getComputedStyle(content);
              if (
                computedStyle.opacity === "0" ||
                computedStyle.visibility === "hidden"
              ) {
                gsap.set(content, {
                  opacity: 1,
                  visibility: "visible",
                  immediateRender: true,
                });
              }
            });
            ScrollTrigger.refresh();
          }, 50);
        }
      } catch (error) {
        console.warn("GSAP not installed. Please run: npm install gsap", error);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      // Cleanup буде виконано через killAnimations в GSAPInit
    };
  }, []);

  return (
    <section
      id="effect031"
      className="gsap-section w-full overflow-visible relative"
    >
      {/* Main Title */}
      <Container variant="content">
        <div className="w-full flex justify-center mb-16">
          <h2 className="font-manrope font-bold text-[48px] sm:text-[64px] lg:text-[92px] leading-[100%] tracking-[-0.05em] text-[var(--color-gray)] m-0 text-center max-w-[1143px]">
            {t("packages.title")}
          </h2>
        </div>
      </Container>

      {/* Subtitle */}
      <Container variant="content">
        <div className="w-full flex justify-center mb-8">
          <p className="font-manrope font-semibold text-base leading-[150%] tracking-[-0.03em] text-black m-0 text-center max-w-[413px]">
            {t("packages.subtitle")}
          </p>
        </div>
      </Container>
      {/* Slides container */}
      <div className="gsap-inner w-full relative px-5">
        <div className="w-full">
          {packages.map((pkg) => {
            return (
              <div
                key={pkg.slug}
                className="slide min-h-[90vh] md:min-h-screen w-full flex items-center justify-center"
              >
                <div
                  className="content-wrapper w-full relative overflow-hidden"
                  style={{ perspective: "250vw" }}
                >
                  <div
                    className="content relative w-full h-[812px] px-5 sm:px-10 lg:px-[40px] py-5 sm:py-10 lg:py-[40px] flex flex-col justify-between"
                    style={{
                      transformStyle: "preserve-3d",
                      transformOrigin: "50% 10%",
                    }}
                  >
                    {/* Gradient background */}
                    <div
                      className="absolute inset-0 -z-10"
                      style={{
                        background:
                          "radial-gradient(123.58% 123.58% at 38.64% 20.32%, #454794 0%, #15162E 100%)",
                      }}
                    />

                    {/* Image - absolute right, full height */}
                    <div className="absolute top-[40px] right-0 w-[25vw] max-w-[400px] h-full">
                      <Image
                        src={pkg.image}
                        fill
                        alt={pkg.imageAlt}
                        className="object-contain"
                        unoptimized
                      />
                    </div>

                    {/* Top section with titles */}
                    <div className="flex flex-col gap-0 relative z-10">
                      <h3 className="font-manrope font-bold text-[48px] sm:text-[80px] lg:text-[162px] leading-[100%] tracking-[-0.05em] text-white m-0">
                        {pkg.title1}
                      </h3>
                      <h3 className="font-manrope font-bold text-[48px] sm:text-[80px] lg:text-[162px] leading-[100%] tracking-[-0.05em] text-white m-0 ml-0 sm:ml-[80px] lg:ml-[157px]">
                        {pkg.title2}
                      </h3>
                    </div>

                    {/* Bottom section */}
                    <div className="flex flex-col gap-8 relative z-10">
                      {/* Description */}
                      <p className="font-inter font-medium text-sm sm:text-base leading-[150%] text-white m-0 max-w-[460px]">
                        {pkg.description}
                      </p>

                      {/* Buttons */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[10px]">
                        {/* Consultation button */}
                        <Button
                          variant="default"
                          style={{
                            background:
                              "radial-gradient(114.39% 151.52% at 50% 151.52%, #3B3D7E 0%, #FFFFFF 100%)",
                            width: "242px",
                            height: "66px",
                            minHeight: "54px",
                            borderRadius: "50px",
                            color: "#131445",
                          }}
                          className="font-inter font-medium text-base leading-[100%] tracking-[-0.01em]"
                        >
                          {t("packages.buttonConsultation")}
                        </Button>

                        {/* More details link */}
                        <button className="flex items-center justify-center gap-[10px] h-[32px] border-b border-white text-white font-inter font-medium text-base leading-[100%] tracking-[-0.01em] bg-transparent cursor-pointer hover:opacity-80 transition-opacity">
                          {t("packages.buttonMore")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
