"use client";

import React from "react";
import Image from "next/image";
import { ServiceData } from "@/strapi/services";
import CTASection2 from "./cta-section-2";
import CasesSection from "../home-page/cases-section";
import RichText from "../ui/rich-text";
import { useLenis } from "../providers/lenis-context";

interface ServicePageClientProps {
  service: ServiceData;
}

export default function ServicePageClient({ service }: ServicePageClientProps) {
  const { lenis } = useLenis();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element && lenis) {
      const offset = 120; // Відступ зверху
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      lenis.scrollTo(offsetPosition, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  };
  return (
    <main className="relative w-full bg-[#F4F4F5] min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* Content Columns (1-2) */}
        <div className="lg:col-span-2 px-[10px] md:px-5">
          {/* Hero Section */}
          <section className="relative pt-[124px]">
            {/* Title and Description */}
            <div className="flex flex-col gap-10">
              <h1 className="font-manrope font-bold text-[60px] md:text-[80px] lg:text-[92px] leading-[100%] tracking-[-0.05em] text-[#353556]">
                {service.title}
              </h1>
              <p className="font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-black">
                {service.description}
              </p>
            </div>

            {/* Main Image */}
            <div className="relative w-full h-[300px] md:h-[500px] lg:h-[612px] my-10">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
              />
            </div>
          </section>

          {/* Detail Sections */}
          <section id="procedure">
            <div>
              {/* Основне про процедуру */}
              <div className="flex flex-col gap-5">
                <h2 className="font-manrope font-bold text-[32px] md:text-[36px] lg:text-[40px] leading-[100%] tracking-[-0.05em] text-[#353556]">
                  Основне про процедуру
                </h2>
                <RichText content={service.detailSection?.textblock || []} />
              </div>

              <div className="h-[1px] w-full bg-[#1B1661] opacity-40 mb-[30px] mt-[14px]" />

              {/* Результати */}
              <div id="results" className="flex flex-col gap-5">
                <h2 className="font-manrope font-bold text-[32px] md:text-[36px] lg:text-[40px] leading-[100%] tracking-[-0.05em] text-[#353556]">
                  Результати
                </h2>
                <RichText content={service.result || []} />
              </div>

              <div className="h-[1px] w-full bg-[#1B1661] opacity-40 mb-[30px] mt-[14px]" />

              {/* Коли варто задуматися про процедуру */}
              <div id="indications" className="flex flex-col gap-5">
                <h2 className="font-manrope font-bold text-[32px] md:text-[36px] lg:text-[40px] leading-[100%] tracking-[-0.05em] text-[#353556]">
                  Коли варто задуматися про процедуру
                </h2>
                <RichText content={service.symptoms || []} />
              </div>
            </div>
          </section>
        </div>

        {/* Navigation Column (3) */}
        <div className="hidden lg:block lg:col-span-1 px-[10px] md:px-5">
          <div className="lg:sticky lg:top-[139px] w-full bg-white p-6 lg:p-[25px]">
            <nav className="flex flex-col gap-5">
              <a
                href="#procedure"
                onClick={(e) => handleNavClick(e, "procedure")}
                className="font-manrope font-bold text-[22px] leading-[100%] tracking-[-0.05em] text-[#353556] hover:opacity-70 transition-opacity flex items-end cursor-pointer"
              >
                Опис процедури
              </a>
              <a
                href="#indications"
                onClick={(e) => handleNavClick(e, "indications")}
                className="font-manrope font-bold text-[22px] leading-[100%] tracking-[-0.05em] text-[#353556] hover:opacity-70 transition-opacity flex items-end cursor-pointer"
              >
                Показання
              </a>
              <a
                href="#results"
                onClick={(e) => handleNavClick(e, "results")}
                className="font-manrope font-bold text-[22px] leading-[100%] tracking-[-0.05em] text-[#353556] hover:opacity-70 transition-opacity flex items-end cursor-pointer"
              >
                Результати
              </a>
              <a
                href="#process"
                onClick={(e) => handleNavClick(e, "process")}
                className="font-manrope font-bold text-[22px] leading-[100%] tracking-[-0.05em] text-[#353556] hover:opacity-70 transition-opacity flex items-end cursor-pointer"
              >
                Процес
              </a>
              <a
                href="#cases"
                onClick={(e) => handleNavClick(e, "cases")}
                className="font-manrope font-bold text-[22px] leading-[100%] tracking-[-0.05em] text-[#353556] hover:opacity-70 transition-opacity flex items-end cursor-pointer"
              >
                Кейси
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Process Section and below - Full width, outside grid */}
      <div className="px-[10px] md:px-5">
        {/* Divider */}
        <div className="h-[1px] w-full bg-[#1B1661] opacity-40 mb-[30px] mt-[14px]" />

        {/* Process Section */}
        <section id="process" className="flex flex-col gap-5">
          <h2 className="font-manrope font-bold text-[32px] md:text-[36px] lg:text-[40px] leading-[100%] tracking-[-0.05em] text-[#353556]">
            Як проходить весь шлях
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px]">
            {service.advantagesSection?.advantages?.map((advantage, index) => (
              <div
                key={advantage.id}
                className="bg-white p-3 md:p-[12px] flex flex-col gap-[10px]"
              >
                <h3 className="font-manrope font-bold text-[22px] leading-[100%] tracking-[-0.05em] text-[#353556]">
                  {index + 1}. {advantage.title}
                </h3>
                <p className="font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-black flex-1">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="h-[1px] w-full bg-[#1B1661] opacity-40 my-8 md:my-12" />

        <div id="cases">
          {/* Cases Slider - Using CasesSection component */}
          <CasesSection />
        </div>
        {/* CTA Section */}
        <CTASection2 />
      </div>
    </main>
  );
}
