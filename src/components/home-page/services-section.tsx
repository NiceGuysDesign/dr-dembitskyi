"use client";

import React, { useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";

export default function ServicesSection() {
  const { t } = useTranslation();
  const params = useParams();
  const lang = (params?.lang as string) || "uk";

  const servicesData = useMemo(
    () => [
      {
        id: 1,
        title: t("servicesSection.services.phlebology.title"),
        image: "/images/A900FD68-082B-4E85-94C5-42B6773A7A44 1 (1).png",
        imageAlt: t("servicesSection.services.phlebology.imageAlt"),
        categoryKey: "phlebology",
      },
      {
        id: 2,
        title: t("servicesSection.services.plasticSurgery.title"),
        image: "/images/A900FD68-082B-4E85-94C5-42B6773A7A44 1.png",
        imageAlt: t("servicesSection.services.plasticSurgery.imageAlt"),
        categoryKey: "surgical",
      },
      {
        id: 3,
        title: t("servicesSection.services.injectionCosmetology.title"),
        image: "/images/image 40 (Traced).png",
        imageAlt: t("servicesSection.services.injectionCosmetology.imageAlt"),
        categoryKey: "cosmetology",
      },
    ],
    [t]
  );
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    // Dynamic import GSAP only on client side
    const initAnimation = async () => {
      try {
        const { gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        const { MotionPathPlugin } = await import("gsap/MotionPathPlugin");

        gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

        const wrap = wrapRef.current;
        const path = pathRef.current;
        if (!wrap || !path) return;

        const items = Array.from(
          wrap.querySelectorAll('[data-motionpath="item"]')
        ) as HTMLElement[];
        const itemDetails = Array.from(
          wrap.querySelectorAll('[data-motionpath="item-details"]')
        ) as HTMLElement[];

        // Set z-index on items
        gsap.set(items, {
          zIndex: (_i: number, _target: HTMLElement, all: HTMLElement[]) =>
            all.length - _i,
        });

        // Create timeline with ScrollTrigger
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: "top bottom", // Start animation when top of wrap reaches bottom of viewport
            end: "bottom top", // End when bottom of wrap reaches top of viewport
            scrub: true,
          },
          defaults: {
            ease: "none",
            stagger: 0.3,
          },
        });

        tl.to(items, {
          duration: 1,
          motionPath: {
            path: path,
            align: path,
            curviness: 2,
            alignOrigin: [0.5, 0.5],
          },
        })
          .fromTo(items, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0)
          .fromTo(
            items,
            { filter: "blur(1.5em)" },
            { filter: "blur(0em)", duration: 0.5 },
            0
          )
          .fromTo(
            itemDetails,
            { autoAlpha: 0, yPercent: 25 },
            { autoAlpha: 1, yPercent: 0, duration: 0.1 },
            0.5
          )
          .fromTo(items, { scale: 0.4 }, { scale: 1, duration: 0.65 }, 0)
          .to(
            items,
            { autoAlpha: 0, filter: "blur(1em)", duration: 0.15 },
            0.85
          )
          .to(itemDetails, { autoAlpha: 0, duration: 0.05 }, 0.9);

        ScrollTrigger.refresh();
      } catch (error) {
        console.warn("GSAP not installed. Please run: npm install gsap", error);
      }
    };

    initAnimation();
  }, []);

  return (
    <section className="relative w-full overflow-x-clip">
      {/* Section with motion path animation */}
      <div
        ref={wrapRef}
        data-motionpath="wrap"
        className="w-full min-h-[300vh] h-[calc(100vh*3.5)] relative"
      >
        {/* Sticky content container - matches motionpath-content */}
        <div className="flex justify-center items-center w-full h-[80vh] lg:h-screen sticky top-[110px] md:top-[140px] z-10">
          {/* Background title */}
          <h2 className="z-10 text-[var(--color-text-heading)] m-0 font-manrope text-[7vw] md:text-[70px] lg:text-[4vw] leading-[100%] tracking-[-0.05em] font-bold absolute top-0 md:top-[-5%] flex flex-col gap-2 w-full px-5">
            {t("servicesSection.title")}
            <span className="text-center">{t("servicesSection.subtitle")}</span>
            <span className="text-start ml-[20%]">
              {t("servicesSection.subtitle2")}
            </span>
          </h2>

          {/* Inner container - matches motionpath-content-inner */}
          <div className="flex justify-start items-start w-full h-full relative overflow-hidden">
            {/* SVG Path container - matches motionpath-content-path */}
            <div className="w-[100vmax] h-full max-h-[55vh]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1366 603"
                fill="transparent"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                <path
                  ref={pathRef}
                  data-motionpath="path"
                  d="M1115.94 0C1297.33 38.9693 1626.89 444.65 993.816 562.057C407.372 670.816 89.0772 533.413 0 436.157"
                  stroke="transparent"
                />
              </svg>
            </div>

            {/* Services cards container - matches motionpath-content-wrap */}
            <div className="z-[1] absolute top-[25vh] md:top-[35vh] lg:top-[25vh] 2xl:top-[30vh]">
              {servicesData.map((service) => (
                <div
                  key={service.id}
                  data-motionpath="item"
                  className="absolute"
                >
                  {/* Card container with white background - wrapped in Link */}
                  <Link
                    href={`/${lang}/services#category-${service.categoryKey}`}
                    className="block relative w-[240px] h-[320px] lg:w-[320px] lg:h-[414px] xl:w-[400px] xl:h-[500px] 2xl:w-[460px] 2xl:h-[600px] bg-white hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    {/* Image container */}
                    <div className="absolute w-full h-full">
                      <Image
                        src={service.image}
                        fill
                        alt={service.imageAlt}
                        className="object-contain w-full h-full"
                        unoptimized
                      />
                    </div>
                    {/* Title at bottom */}
                    <div
                      data-motionpath="item-details"
                      className="absolute bottom-[10px] left-[10px] lg:bottom-[32px] lg:left-[26px] right-[105.09px] h-[80px] flex items-end"
                    >
                      <h3 className="font-manrope font-bold text-[34px] md:text-[40px] leading-[100%] tracking-[-0.05em] text-[var(--color-gray)] m-0">
                        {service.title}
                      </h3>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
