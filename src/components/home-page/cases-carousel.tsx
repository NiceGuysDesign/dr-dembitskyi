"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swiper from "swiper";
import { EffectCoverflow } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import CaseSensitiveCover from "../cases/case-sensitive-cover";
import ArrowIcon from "../../../public/icons/arrow-icon";
import { type Locale } from "@/i18n/config";
import { localePath } from "@/i18n/routing";

import "swiper/css";
import "swiper/css/effect-coverflow";

export type CasesCarouselItem = {
  id: string;
  slug: string;
  categoryIds: string[];
  image: string | null;
  imageAlt: string;
  title?: string;
  description: string;
};

type CasesCarouselProps = {
  cases: CasesCarouselItem[];
  lang: string;
};

function destroySwiper(swiper: SwiperInstance | null) {
  if (!swiper || swiper.destroyed) return;

  try {
    if (swiper.params.loop) {
      swiper.loopDestroy();
    }
  } catch {
    // loop may already be destroyed
  }

  swiper.destroy(false, false);
}

export default function CasesCarousel({ cases, lang }: CasesCarouselProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperInstance | null>(null);

  const slideCount = cases.length;
  const casesKey = useMemo(() => cases.map((c) => c.id).join(","), [cases]);
  const enableLoop = slideCount >= 3;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [navLocked, setNavLocked] = useState({ prev: true, next: false });

  const updateNav = useCallback(
    (swiper: SwiperInstance) => {
      const index = enableLoop ? swiper.realIndex : swiper.activeIndex;
      setSelectedIndex(index);

      if (enableLoop) {
        setNavLocked({ prev: false, next: false });
      } else {
        setNavLocked({
          prev: swiper.isBeginning,
          next: swiper.isEnd,
        });
      }
    },
    [enableLoop],
  );

  useEffect(() => {
    setSelectedIndex(0);
    setNavLocked({ prev: !enableLoop, next: false });
  }, [casesKey, enableLoop]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || slideCount === 0) return;

    let swiper: SwiperInstance | null = null;
    let cancelled = false;

    const initSwiper = () => {
      if (cancelled || !containerRef.current) return;

      destroySwiper(swiperRef.current);
      swiperRef.current = null;

      swiper = new Swiper(containerRef.current, {
        modules: [EffectCoverflow],
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 1,
        spaceBetween: 20,
        loop: enableLoop,
        loopAdditionalSlides: 2,
        simulateTouch: true,
        allowTouchMove: true,
        touchStartPreventDefault: false,
        watchSlidesProgress: true,
        coverflowEffect: {
          rotate: 60,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        },
        breakpoints: {
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        },
        on: {
          init: (instance) => updateNav(instance),
          slideChange: (instance) => updateNav(instance),
        },
      });

      swiperRef.current = swiper;

      requestAnimationFrame(() => {
        if (!swiper || cancelled || swiper.destroyed) return;

        if (enableLoop) {
          swiper.slideToLoop(0, 0);
        } else {
          swiper.slideTo(0, 0);
        }

        swiper.update();
        updateNav(swiper);
      });
    };

    requestAnimationFrame(initSwiper);

    return () => {
      cancelled = true;
      destroySwiper(swiper);
      if (swiperRef.current === swiper) {
        swiperRef.current = null;
      }
    };
  }, [casesKey, slideCount, enableLoop, updateNav]);

  const handleSlideClick = (index: number) => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.destroyed) return;

    const activeIndex = enableLoop ? swiper.realIndex : swiper.activeIndex;

    if (activeIndex !== index) {
      if (enableLoop) {
        swiper.slideToLoop(index);
      } else {
        swiper.slideTo(index);
      }
      return;
    }

    const caseItem = cases[index];
    if (!caseItem?.slug) return;
    router.push(localePath(lang as Locale, "cases", caseItem.slug));
  };

  if (slideCount === 0) return null;

  const activeCase = cases[selectedIndex] ?? cases[0];
  const activeHref = activeCase
    ? localePath(lang as Locale, "cases", activeCase.slug)
    : "";

  return (
    <>
      <div className="relative w-full py-6 md:py-8 lg:py-10" data-lenis-prevent>
        <div
          key={casesKey}
          ref={containerRef}
          className="swiper cases-swiper !overflow-visible"
        >
          <div className="swiper-wrapper">
            {cases.map((caseItem, index) => (
              <div
                key={caseItem.id}
                className="swiper-slide"
                data-case-index={index}
              >
                <button
                  type="button"
                  className="relative w-full flex flex-col items-center border-0 bg-transparent p-0 cursor-pointer select-none"
                  onClick={() => handleSlideClick(index)}
                  aria-label={caseItem.title || caseItem.imageAlt}
                >
                  <div className="relative w-full h-[50vh] sm:h-[45vh] md:h-[40vh] overflow-hidden">
                    <CaseSensitiveCover
                      src={caseItem.image}
                      alt={caseItem.imageAlt}
                      swipeable
                      containerClassName="relative w-full h-full"
                      imageClassName="object-cover select-none pointer-events-none"
                      unoptimized
                    />
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {activeCase?.title && (
          <Link
            href={activeHref}
            draggable={false}
            className="mt-3 md:mt-4 block font-manrope font-bold text-[32px] leading-[140%] tracking-[-0.02em] text-[var(--color-text-heading)] text-center px-[10px] hover:opacity-80 transition-opacity select-none"
          >
            {activeCase.title}
          </Link>
        )}
        {activeCase?.description && (
          <p className="mt-1 font-inter font-medium text-xs sm:text-sm leading-[150%] text-[var(--color-text-primary)] text-center px-[10px] max-w-[600px] mx-auto">
            {activeCase.description}
          </p>
        )}
      </div>

      <div className="mt-6 md:mt-8 lg:mt-12 flex items-center justify-center gap-3 md:gap-4 px-[10px] md:px-5">
        <button
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
          disabled={navLocked.prev}
          className="w-[54px] h-[54px] md:w-[60px] md:h-[60px] lg:w-[66px] lg:h-[66px] rounded-full border-2 border-[var(--color-border-button)] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous"
        >
          <ArrowIcon
            direction="left"
            className="text-[var(--color-border-button)] w-5 h-5 md:w-6 md:h-6"
          />
        </button>
        <button
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
          disabled={navLocked.next}
          className="w-[54px] h-[54px] md:w-[60px] md:h-[60px] lg:w-[66px] lg:h-[66px] rounded-full border-2 border-[var(--color-border-button)] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next"
        >
          <ArrowIcon
            direction="right"
            className="text-[var(--color-border-button)] w-5 h-5 md:w-6 md:h-6"
          />
        </button>
      </div>
    </>
  );
}
