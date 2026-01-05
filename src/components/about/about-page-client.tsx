"use client";

import React from "react";
import Image from "next/image";
import { AboutData } from "@/strapi/about";

interface AboutPageClientProps {
  aboutData: AboutData;
}

export default function AboutPageClient({ aboutData }: AboutPageClientProps) {
  return (
    <main className="relative w-full min-h-screen bg-[#F4F4F5]">
      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-0">
        {/* Mobile Photo - Shown on mobile, hidden on desktop */}
        <div className="lg:hidden relative w-full h-[60vh] md:h-[70vh] overflow-hidden top-[80px]">
          <Image
            src={aboutData.image}
            alt={aboutData.name}
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
          {/* Gradient fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-[#F4F4F5] to-transparent pointer-events-none" />
        </div>

        {/* Desktop Left Side - Fixed Photo */}
        <div className="hidden lg:block lg:sticky lg:top-[80px] lg:h-screen lg:overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src={aboutData.image}
              alt={aboutData.name}
              fill
              className="object-cover object-center"
              priority
              unoptimized
            />
            {/* Gradient fade at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-[#F4F4F5] to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Right Side - Scrollable Content */}
        <div className="w-full px-[10px] md:px-5 lg:px-10 pb-10">
          <div className="max-w-[800px] mx-auto flex flex-col">
            {/* Name and Title - Overlaps photo on mobile */}
            <div className="flex flex-col gap-2 md:gap-5 -mt-[12px] md:-mt-[140px] lg:mt-[20%] relative z-10">
              <h1 className="font-manrope font-bold text-[40px] md:text-[50px] lg:text-[92px] leading-[100%] tracking-[-0.05em] text-[#353556]">
                {aboutData.name}
              </h1>
              <p className="font-manrope font-semibold text-[14px] leading-[150%] tracking-[-0.03em] text-[#353556] opacity-70">
                {aboutData.position}
              </p>
            </div>

            {/* About Doctor Section */}
            <section className="flex flex-col gap-4 md:gap-6 mt-5">
              <h2 className="font-manrope font-bold text-[24px] leading-[100%] tracking-[-0.05em] text-[#353556]">
                Про лікаря
              </h2>
              <p className="font-manrope font-semibold text-[16px] leading-[150%] tracking-[-0.03em] text-black opacity-80">
                {aboutData.description}
              </p>
            </section>

            {/* Education Section */}
            <section className="flex flex-col gap-6 md:gap-8 mt-10">
              <h2 className="font-manrope font-bold text-[24px] leading-[100%] tracking-[-0.05em] text-[#353556]">
                Навчання
              </h2>
              <div className="flex flex-col gap-6 md:gap-8">
                {aboutData.education.map((course) => (
                  <div key={course.id} className="flex flex-col gap-4 md:gap-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 w-full">
                      <div className="flex flex-col gap-2">
                        <h3 className="font-manrope font-bold text-[20px] leading-[100%] tracking-[-0.05em] text-[#353556]/80">
                          {course.title}
                        </h3>
                        <p className="font-manrope font-semibold text-[14px] leading-[150%] tracking-[-0.03em] text-black opacity-50">
                          {course.location}
                        </p>
                      </div>
                      <button
                        className="px-6 py-[18px] rounded-full border-1 border-[#353556] font-inter font-medium text-[16px] leading-[120%] tracking-[-0.02em] text-[#353556] hover:bg-[#353556] hover:text-white transition-colors cursor-pointer w-full md:w-auto md:min-w-[150px]"
                        aria-label={`Сертифікат - ${course.title}`}
                      >
                        Сертифікат
                      </button>
                    </div>
                    <div className="w-full h-[1px] bg-[#353556] opacity-40"></div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
