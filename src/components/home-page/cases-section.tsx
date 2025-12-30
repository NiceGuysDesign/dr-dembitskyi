"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { cases, caseCategories, type CaseCategory } from "@/data/cases";
import ArrowIcon from "../../../public/icons/arrow-icon";

// Dynamic import для Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

export default function CasesSection() {
  const { t } = useTranslation();
  const params = useParams() as { lang?: string };
  const lang = params?.lang ?? "uk";
  const [activeFilter, setActiveFilter] = useState<CaseCategory>("all");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  // Фільтрація кейсів
  const filteredCases =
    activeFilter === "all"
      ? cases
      : cases.filter((caseItem) => caseItem.categories.includes(activeFilter));

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden">
      {/* Title Section */}
      <div className="mb-12 md:mb-16 px-5">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-12">
          {/* Left side - Title */}
          <div className="flex flex-col gap-2">
            <h2 className="font-manrope font-bold text-[48px] sm:text-[64px] lg:text-[92px] leading-[100%] tracking-[-0.05em] text-[var(--color-gray)] m-0">
              {t("cases.title1")}
            </h2>
            <h2 className="font-manrope font-bold text-[48px] sm:text-[64px] lg:text-[92px] leading-[100%] tracking-[-0.05em] text-[var(--color-gray)] m-0 ml-0 md:ml-[148px]">
              {t("cases.title2")}
            </h2>
            <h2 className="font-manrope font-bold text-[48px] sm:text-[64px] lg:text-[92px] leading-[100%] tracking-[-0.05em] text-[var(--color-gray)] m-0">
              {t("cases.title3")}
            </h2>
          </div>

          <div className="max-w-[50%]">
            {/* Right side - Description */}
            <div className="md:max-w-[460px]">
              <p className="font-manrope font-semibold text-base leading-[150%] tracking-[-0.03em] text-black m-0">
                {t("cases.description")}
              </p>
            </div>
            {/* Divider line */}
            <div className="mt-8 md:mt-12 h-px bg-[var(--color-line)] opacity-40" />

            {/* Filters */}
            <div className="mt-6 md:mt-8 flex flex-wrap gap-[10px]">
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
                    className="font-inter font-medium text-base leading-[120%] tracking-[-0.02em]"
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
                    className="cursor-pointer px-10 py-4 h-[56px] rounded-[90px] font-inter font-medium text-base leading-[120%] tracking-[-0.02em] transition-all border border-[var(--color-border-filter)] text-[var(--color-text-filter)] bg-transparent hover:border-[var(--color-gray)] hover:text-[var(--color-gray)]"
                  >
                    {t(`cases.filters.${category.value}`)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Swiper Carousel */}
      <div className="relative py-10">
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
                <div className="relative w-[35vw] h-[40vh]">
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
                  <p className="mt-4 max-w-[341px] font-inter font-medium text-sm leading-[150%] text-[var(--color-text-primary)] text-center">
                    {caseItem.description}
                  </p>
                )}
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Navigation and CTA */}
      <div className="mt-8 md:mt-12 flex items-center justify-between px-5">
        {/* Navigation buttons */}
        <div className="flex items-center gap-4">
          <button
            className="cases-prev w-[66px] h-[66px] rounded-full border-2 border-[var(--color-border-button)] flex items-center justify-center cursor-pointer"
            aria-label="Previous"
          >
            <ArrowIcon
              direction="left"
              className="text-[var(--color-border-button)]"
            />
          </button>
          <button
            className="cases-next w-[66px] h-[66px] rounded-full border-2 border-[var(--color-border-button)] flex items-center justify-center cursor-pointer"
            aria-label="Next"
          >
            <ArrowIcon
              direction="right"
              className="text-[var(--color-border-button)]"
            />
          </button>
        </div>

        {/* All cases button */}
        <Button
          variant="default"
          style={{
            background: "var(--gradient-button)",
            width: "225px",
            height: "66px",
            minHeight: "54px",
            borderRadius: "50px",
          }}
          className="font-inter font-medium text-base leading-[100%] tracking-[-0.01em]"
        >
          {t("cases.buttonAllCases")}
        </Button>
      </div>
    </section>
  );
}
