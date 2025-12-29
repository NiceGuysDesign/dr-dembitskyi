"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

const servicesData = [
  {
    id: 1,
    title: "Флебологія",
    image: "/images/A900FD68-082B-4E85-94C5-42B6773A7A44 1 (1).png",
    imageAlt: "Флебологія",
  },
  {
    id: 2,
    title: "Пластична хірургія",
    image: "/images/A900FD68-082B-4E85-94C5-42B6773A7A44 1.png",
    imageAlt: "Пластична хірургія",
  },
  {
    id: 3,
    title: "Інʼєкційна косметологія",
    image: "/images/image 40 (Traced).png",
    imageAlt: "Інʼєкційна косметологія",
  },
];

export default function ServicesSection() {
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
    <section className="relative w-full">
      {/* Section with motion path animation */}
      <div
        ref={wrapRef}
        data-motionpath="wrap"
        className="w-full h-[450vh] relative"
      >
        {/* Sticky content container - matches motionpath-content */}
        <div className="flex justify-center items-center w-full h-screen sticky top-[130px] z-10">
          {/* Background title */}
          <h2 className="z-10 text-[var(--color-text-heading)] m-0 font-manrope text-[90px] leading-[100%] tracking-[-0.05em] font-bold absolute top-[-5%] flex flex-col gap-2 w-full px-5">
            Пластична хірургія
            <span className="text-end">де головне — не форма, </span>
            <span className="text-start ml-[20%]">а людина</span>
          </h2>

          {/* Inner container - matches motionpath-content-inner */}
          <div className="flex justify-start items-start w-full h-full overflow-hidden">
            {/* SVG Path container - matches motionpath-content-path */}
            <div className="w-[100vmax] h-full max-h-[45vh]">
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
            <div className="z-[1] absolute top-[40vh]">
              {servicesData.map((service) => (
                <div
                  key={service.id}
                  data-motionpath="item"
                  className="absolute"
                >
                  {/* Card container with white background */}
                  <div className="relative w-[460px] h-[614px] bg-white">
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
                      className="absolute bottom-[32px] left-[26px] right-[105.09px] h-[80px] flex items-end"
                    >
                      <h3 className="font-manrope font-bold text-[40px] leading-[100%] tracking-[-0.05em] text-[var(--color-gray)] m-0">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
