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
import { cn } from "@/lib/utils";

interface PackagesSectionProps {
  packagesData?: ServiceData[];
}

/**
 * Розміри карток: висота задається лише батьківському `.slide` (Link).
 * Внутрішні `.content-wrapper` / `.content` заповнюють доступну висоту (flex).
 */
const PACKAGE_CARD_LAYOUT = {
  /** Відступ між картками у списку слайдів */
  slideList: "flex flex-col gap-12 md:gap-16 lg:gap-24",
  /** Фіксована висота слайду (Link). Нижче `lg` — нижче; з `lg` — вище. */
  slide:
    "h-[700px] md:h-[80vh] lg:h-[620px] xl:h-[760px]",
  /** Лише відступи всередині картки — без `h-*` */
  contentPadding:
    "px-[10px] sm:px-5 md:px-10 lg:px-[40px] py-3 md:py-5 lg:py-10",
} as const;

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
    let cleanupFn: (() => void) | undefined;
    const timer = setTimeout(async () => {
      try {
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        cleanupFn = initEffect031();

        // Оновлюємо ScrollTrigger після ініціалізації
        if (cleanupFn) {
          ScrollTrigger.refresh();
        }
      } catch (error) {
        console.warn("GSAP not installed. Please run: npm install gsap", error);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      cleanupFn?.();
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
        <div className={cn("w-full", PACKAGE_CARD_LAYOUT.slideList)}>
          {packagesData.map((pkg) => {
            const { title1, title2 } = splitTitle(pkg.title);
            const packageHref = `/${lang}/package-service/${pkg.slug}`;
            return (
              <Link
                key={pkg.slug}
                href={packageHref}
                prefetch={false}
                className={cn(
                  "slide flex w-full min-h-0 flex-col items-stretch",
                  PACKAGE_CARD_LAYOUT.slide
                )}
              >
                <div
                  className="content-wrapper relative flex min-h-0 w-full flex-1 flex-col overflow-hidden"
                  style={{ perspective: "250vw" }}
                >
                  <div
                    className={cn(
                      "content relative flex min-h-0 w-full flex-1 flex-col justify-between",
                      PACKAGE_CARD_LAYOUT.contentPadding
                    )}
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
                    <div className="absolute top-0 right-0 w-full lg:w-[50%] h-full">
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
