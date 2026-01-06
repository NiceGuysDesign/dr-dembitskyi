"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Case as StrapiCase } from "@/strapi/cases";
import { CaseFilterType } from "../cases/cases-filters";
import ArrowIcon from "../../../public/icons/arrow-icon";

// Dynamic import для Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

interface MappedCase {
  id: string;
  slug: string;
  categories: CaseFilterType[];
  image: string;
  imageAlt: string;
  title?: string;
  description: string;
}

interface CasesSectionProps {
  casesData?: StrapiCase[];
}

// Категорії для фільтрів
const caseCategories: { value: CaseFilterType; label: string }[] = [
  { value: "all", label: "all" },
  { value: "blepharoplasty", label: "blepharoplasty" },
  { value: "facelift", label: "facelift" },
  { value: "liposuction", label: "liposuction" },
  { value: "mammoplasty", label: "mammoplasty" },
];

// Map Strapi category to filter type
const mapCategoryToFilter = (category?: string): CaseFilterType => {
  if (!category) return "all";
  const normalized = category.trim().toLowerCase();
  if (normalized.includes("blepharoplasty")) return "blepharoplasty";
  if (normalized.includes("facelift")) return "facelift";
  if (normalized.includes("liposuction")) return "liposuction";
  if (normalized.includes("mammoplasty")) return "mammoplasty";
  return "all";
};

export default function CasesSection({ casesData }: CasesSectionProps = {}) {
  const { t } = useTranslation();
  const params = useParams() as { lang?: string };
  const pathname = usePathname();
  const lang = params?.lang ?? "uk";
  const [activeFilter, setActiveFilter] = useState<CaseFilterType>("all");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  // Перевірка, чи ми на сторінці /cases
  const isOnCasesPage = pathname?.includes("/cases");
  // Перевірка, чи ми на сторінці /services/[slug]
  const isOnServicePage =
    pathname?.includes("/services/") && pathname?.split("/").length > 3;

  // Маппінг Strapi кейсів до формату компонента
  const mappedCases = useMemo<MappedCase[]>(() => {
    if (casesData && casesData.length > 0) {
      return casesData.map((caseItem, index) => ({
        id: caseItem.slug || `case-${index}`,
        slug: caseItem.slug,
        categories: [mapCategoryToFilter(caseItem.category)],
        image: caseItem.image,
        imageAlt: caseItem.title || caseItem.description || "Case image",
        title: caseItem.title,
        description: caseItem.description || "",
      }));
    }
    return [];
  }, [casesData]);

  // Фільтрація кейсів
  const filteredCases = useMemo(() => {
    if (activeFilter === "all") {
      return mappedCases;
    }
    return mappedCases.filter((caseItem: MappedCase) =>
      caseItem.categories.includes(activeFilter)
    );
  }, [mappedCases, activeFilter]);

  return (
    <section className="relative w-full py-10 md:py-16 overflow-hidden">
      {/* Background text "Кейси" - показуємо тільки на сторінці послуги */}
      {isOnServicePage && (
        <h2
          className="font-manrope font-bold text-[289px] leading-[100%] tracking-[-0.05em] opacity-40 absolute right-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(53, 53, 86, 0.2) 0%, rgba(116, 116, 188, 0.1) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {t("cases.title")}
        </h2>
      )}

      {/* Title Section */}
      <div className="mb-8 md:mb-12 lg:mb-16 px-[10px] md:px-5">
        <div
          className={`flex flex-col lg:flex-row ${
            isOnServicePage ? "lg:items-end" : "lg:items-start"
          } lg:justify-between gap-6 md:gap-8 lg:gap-12`}
        >
          {/* Left side - Title */}
          <div className="flex flex-col gap-1 md:gap-2">
            <h2 className="font-manrope font-bold text-[10vw] sm:text-[8vw] md:text-[64px] lg:text-[78px] xl:text-[92px] leading-[100%] tracking-[-0.05em] text-[var(--color-gray)] m-0">
              {t("cases.title1")}
            </h2>
            <h2 className="font-manrope font-bold text-[10vw] sm:text-[8vw] md:text-[64px] lg:text-[78px] xl:text-[92px] leading-[100%] tracking-[-0.05em] text-[var(--color-gray)] m-0 ml-0 md:ml-[80px] lg:ml-[148px]">
              {t("cases.title2")}
            </h2>
            <h2 className="font-manrope font-bold text-[10vw] sm:text-[8vw] md:text-[64px] lg:text-[78px] xl:text-[92px] leading-[100%] tracking-[-0.05em] text-[var(--color-gray)] m-0">
              {t("cases.title3")}
            </h2>
          </div>

          <div
            className={`w-full lg:max-w-[50%] ${
              isOnServicePage ? "flex flex-col items-end" : ""
            }`}
          >
            {/* Right side - Description */}
            <div className="w-full lg:max-w-[460px]">
              <p className="font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-black m-0">
                {t("cases.description")}
              </p>
            </div>
            {/* Divider line - приховуємо на сторінці послуги */}
            {!isOnServicePage && (
              <div className="mt-6 md:mt-8 lg:mt-12 h-px bg-[var(--color-line)] opacity-40" />
            )}

            {/* Filters - приховуємо на сторінці послуги */}
            {!isOnServicePage && (
              <div className="mt-4 md:mt-6 lg:mt-8 flex flex-wrap gap-[8px] md:gap-[10px]">
                {caseCategories.map((category) => {
                  const isActive = activeFilter === category.value;
                  return isActive ? (
                    <Button
                      key={category.value}
                      variant="default"
                      onClick={() => {
                        setActiveFilter(category.value);
                        // Reset swiper to first slide when filter changes
                        if (swiperRef.current) {
                          swiperRef.current.slideToLoop(0);
                          setActiveSlideIndex(0);
                        }
                      }}
                      style={{
                        background: "var(--gradient-button)",
                        height: "56px",
                        minHeight: "56px",
                        paddingLeft: "40px",
                        paddingRight: "40px",
                        borderRadius: "90px",
                      }}
                      className="font-inter font-medium text-xs sm:text-sm md:text-base leading-[120%] tracking-[-0.02em] md:h-[56px] md:min-h-[56px] md:px-10"
                    >
                      {t(`cases.filters.${category.value}`)}
                    </Button>
                  ) : (
                    <button
                      key={category.value}
                      onClick={() => {
                        setActiveFilter(category.value);
                        // Reset swiper to first slide when filter changes
                        if (swiperRef.current) {
                          swiperRef.current.slideToLoop(0);
                          setActiveSlideIndex(0);
                        }
                      }}
                      className="cursor-pointer px-6 py-3 h-[48px] md:px-10 md:py-4 md:h-[56px] rounded-[90px] font-inter font-medium text-xs sm:text-sm md:text-base leading-[120%] tracking-[-0.02em] transition-all border border-[var(--color-border-filter)] text-[var(--color-text-filter)] bg-transparent hover:border-[var(--color-gray)] hover:text-[var(--color-gray)]"
                    >
                      {t(`cases.filters.${category.value}`)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Swiper Carousel or Empty State */}
      {filteredCases.length === 0 ? (
        <div className="relative py-6 md:py-8 lg:py-10">
          <div className="flex flex-col items-center justify-center min-h-[400px] px-[10px] md:px-5">
            <p className="font-manrope font-semibold text-base md:text-lg leading-[150%] tracking-[-0.03em] text-black text-center">
              {t("cases.noCasesFound") ||
                "За обраними фільтрами кейсів не знайдено"}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="relative py-6 md:py-8 lg:py-10">
            <Swiper
              modules={[Navigation, EffectCoverflow]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              loop={true}
              loopAdditionalSlides={2}
              slidesPerView={3}
              spaceBetween={30}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                // Оновлюємо активний індекс після ініціалізації loop
                setActiveSlideIndex(swiper.realIndex);
              }}
              onSlideChange={(swiper) => {
                setActiveSlideIndex(swiper.realIndex);
              }}
              navigation={{
                prevEl: ".cases-prev",
                nextEl: ".cases-next",
              }}
              coverflowEffect={{
                rotate: 60,
                stretch: 0,
                depth: 100,
                modifier: 1,
              }}
              className="cases-swiper !overflow-visible"
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                  loop: false, // Вимикаємо loop на мобільних
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                  loop: true,
                  loopAdditionalSlides: 2,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                  loop: true,
                  loopAdditionalSlides: 2,
                },
              }}
            >
              {filteredCases.map((caseItem, index) => (
                <SwiperSlide key={caseItem.id}>
                  <Link
                    href={`/${lang}/cases/${caseItem.slug}`}
                    className="relative w-full flex flex-col items-center"
                  >
                    <div className="relative w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[35vw] h-[50vh] sm:h-[45vh] md:h-[40vh]">
                      <Image
                        src={caseItem.image}
                        fill
                        alt={caseItem.imageAlt}
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    {/* Опис показується тільки для активного слайда */}
                    {activeSlideIndex === index && caseItem.description && (
                      <p className="mt-3 md:mt-4 font-inter font-medium text-xs sm:text-sm leading-[150%] text-[var(--color-text-primary)] text-center px-[10px]">
                        {caseItem.description}
                      </p>
                    )}
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Navigation and CTA */}
          <div className="mt-6 md:mt-8 lg:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6 px-[10px] md:px-5">
            {/* Navigation buttons */}
            <div className="flex items-center gap-3 md:gap-4">
              <button
                className="cases-prev w-[54px] h-[54px] md:w-[60px] md:h-[60px] lg:w-[66px] lg:h-[66px] rounded-full border-2 border-[var(--color-border-button)] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                aria-label="Previous"
              >
                <ArrowIcon
                  direction="left"
                  className="text-[var(--color-border-button)] w-5 h-5 md:w-6 md:h-6"
                />
              </button>
              <button
                className="cases-next w-[54px] h-[54px] md:w-[60px] md:h-[60px] lg:w-[66px] lg:h-[66px] rounded-full border-2 border-[var(--color-border-button)] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                aria-label="Next"
              >
                <ArrowIcon
                  direction="right"
                  className="text-[var(--color-border-button)] w-5 h-5 md:w-6 md:h-6"
                />
              </button>
            </div>
            {/* All cases button - показуємо тільки якщо не на сторінці /cases */}
            {!isOnCasesPage && (
              <Link href={`/${lang}/cases`}>
                <Button
                  variant="default"
                  style={{ background: "var(--gradient-button)" }}
                  className="min-w-[242px] sm:w-auto"
                >
                  {t("cases.buttonAllCases")}
                </Button>
              </Link>
            )}
          </div>
        </>
      )}
    </section>
  );
}
