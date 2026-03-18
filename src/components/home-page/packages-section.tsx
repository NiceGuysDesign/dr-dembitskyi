"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";
import { Container } from "../ui/container";
import { ServiceData } from "@/strapi/package-service";
import { initEffect031 } from "@/animations/sections/effect031";
import { useConsultation } from "../consultation/consultation-provider";

interface PackagesSectionProps {
  packagesData?: ServiceData[];
}

// Helper function to split title into title1 and title2
function splitTitle(title: string): { title1: string; title2: string } {
  const words = title.split(" ");
  if (words.length <= 1) {
    return { title1: title, title2: "" };
  }
  // Split roughly in half
  const mid = Math.ceil(words.length / 2);
  return {
    title1: words.slice(0, mid).join(" "),
    title2: words.slice(mid).join(" "),
  };
}

export default function PackagesSection({
  packagesData = [],
}: PackagesSectionProps) {
  const { t } = useTranslation();
  const { openConsultation } = useConsultation();
  const params = useParams() as { lang?: string };
  const lang = params?.lang ?? "uk";

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
        <div className="w-full flex justify-center mb-8 md:mb-12 lg:mb-16 px-[10px] md:px-5">
          <h2 className="font-manrope font-bold text-[8vw] sm:text-[10vw] md:text-[64px] lg:text-[92px] leading-[100%] tracking-[-0.05em] text-[var(--color-gray)] m-0 text-center max-w-[1143px]">
            {t("packages.title")}
          </h2>
        </div>
      </Container>

      {/* Subtitle */}
      <Container variant="content">
        <div className="w-full flex justify-center mb-6 md:mb-8 px-[10px] md:px-5">
          <p className="font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-black m-0 text-center max-w-[413px]">
            {t("packages.subtitle")}
          </p>
        </div>
      </Container>
      {/* Slides container */}
      <div className="gsap-inner w-full relative px-[10px] md:px-5">
        <div className="w-full">
          {packagesData.map((pkg) => {
            const { title1, title2 } = splitTitle(pkg.title);
            const packageHref = `/${lang}/package-service/${pkg.slug}`;
            return (
              <Link
                key={pkg.slug}
                href={packageHref}
                className="slide min-h-[80vh] md:min-h-[90vh] lg:min-h-screen w-full flex items-center justify-center"
              >
                <div
                  className="content-wrapper w-full relative overflow-hidden"
                  style={{ perspective: "250vw" }}
                >
                  <div
                    className="content relative w-full h-[600px] md:h-[700px] lg:h-[812px] px-[10px] sm:px-5 md:px-10 lg:px-[40px] py-5 md:py-8 lg:py-[40px] flex flex-col justify-between"
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
                    <div className="absolute top-[20px] md:top-[30px] lg:top-[40px] right-0 w-[30vw] sm:w-[28vw] md:w-[25vw] max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-[calc(100%-40px)] md:h-[calc(100%-60px)] lg:h-full">
                      <Image
                        src={pkg.image}
                        fill
                        alt={pkg.title}
                        className="object-contain"
                        unoptimized
                      />
                    </div>

                    {/* Top section with titles */}
                    <div className="flex flex-col gap-0 relative z-10">
                      <h3 className="font-manrope font-bold text-[10vw] sm:text-[12vw] md:text-[80px] lg:text-[120px] xl:text-[162px] leading-[100%] tracking-[-0.05em] text-white m-0">
                        {title1}
                      </h3>
                      {title2 && (
                      <h3 className="font-manrope font-bold text-[10vw] sm:text-[12vw] md:text-[80px] lg:text-[120px] xl:text-[162px] leading-[100%] tracking-[-0.05em] text-white m-0 ml-0 sm:ml-[40px] md:ml-[80px] lg:ml-[120px] xl:ml-[157px]">
                          {title2}
                      </h3>
                      )}
                    </div>

                    {/* Bottom section */}
                    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 relative z-10">
                      {/* Description */}
                      <p className="font-inter font-medium text-xs sm:text-sm md:text-base leading-[150%] text-white m-0 max-w-[280px] sm:max-w-[350px] md:max-w-[460px]">
                        {pkg.description}
                      </p>

                      {/* Buttons */}
                      <div className="flex flex-row items-center gap-[10px]">
                        {/* Consultation button */}
                        <Button
                          variant="default"
                          onClick={(e) => {
                            // Prevent navigation to the package page when clicking the consultation CTA.
                            e.preventDefault();
                            e.stopPropagation();
                            openConsultation();
                          }}
                          style={{
                            background:
                              "radial-gradient(114.39% 151.52% at 50% 151.52%, #3B3D7E 0%, #FFFFFF 100%)",
                            width: "100%",
                            maxWidth: "242px",
                            height: "54px",
                            minHeight: "54px",
                            borderRadius: "50px",
                            color: "#131445",
                          }}
                          className="font-inter font-medium text-sm sm:text-base leading-[100%] tracking-[-0.01em] sm:w-[242px] sm:h-[66px]"
                        >
                          {t("packages.buttonConsultation")}
                        </Button>

                        {/* More details link */}
                        <span className="flex items-center justify-center gap-[10px] h-[32px] border-b border-white text-white font-inter font-medium text-sm sm:text-base leading-[100%] tracking-[-0.01em] bg-transparent cursor-pointer hover:opacity-80 transition-opacity">
                          {t("packages.buttonMore")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
