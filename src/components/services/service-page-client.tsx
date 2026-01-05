"use client";

import React from "react";
import { ServiceData } from "@/strapi/services";
import { Case } from "@/strapi/cases";
import CTASection2 from "./cta-section-2";
import CasesSection from "../home-page/cases-section";
import RichText from "../ui/rich-text";

interface ServicePageClientProps {
  service: ServiceData;
  casesData?: Case[];
  showCases?: boolean;
}

export default function ServicePageClient({
  service,
  casesData,
  showCases = true,
}: ServicePageClientProps) {
  return (
    <main className="relative w-full bg-[#F4F4F5] min-h-screen">
      <div className="px-[10px] md:px-5">
        {/* Hero Section - Title with description on the right */}
        <section className="relative pt-[124px] pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Title */}
            <div>
              <h1 className="font-manrope font-bold text-[60px] lg:text-[72px] leading-[100%] tracking-[-0.05em] text-[#353556]">
                {service.title}
              </h1>
            </div>
            {/* Description */}
            <div className="flex items-start">
              <p className="font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-black">
                {service.description}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[1px] w-full bg-[#1B1661] opacity-40 mt-10 mb-10" />
        </section>

        {/* Detail Sections */}
        <section id="procedure">
          {/* Основне про процедуру */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            <h2 className="font-manrope font-bold text-[32px] lg:text-[48px] leading-[100%] tracking-[-0.05em] text-[#353556]">
              Основне про процедуру
            </h2>
            <div className="flex flex-col gap-6">
              <RichText content={service.detailSection?.textblock || []} />
            </div>
          </div>

          <div className="h-[1px] w-full bg-[#1B1661] opacity-40 mb-16" />

          {/* Результати */}
          <div
            id="results"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16"
          >
            <h2 className="font-manrope font-bold text-[32px] lg:text-[48px] leading-[100%] tracking-[-0.05em] text-[#353556]">
              Результати
            </h2>
            <div>
              <RichText content={service.result || []} />
            </div>
          </div>

          <div className="h-[1px] w-full bg-[#1B1661] opacity-40 mb-16" />

          {/* Коли варто задуматися про процедуру */}
          <div
            id="indications"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16"
          >
            <h2 className="font-manrope font-bold text-[32px] lg:text-[48px] leading-[100%] tracking-[-0.05em] text-[#353556]">
              Коли варто задуматися про процедуру
            </h2>
            <div>
              <RichText content={service.symptoms || []} />
            </div>
          </div>
        </section>
      </div>

      {/* Process Section */}
      <div className="px-[10px] md:px-5">
        <div className="h-[1px] w-full bg-[#1B1661] opacity-40 mb-16" />

        <section
          id="process"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16"
        >
          <h2 className="font-manrope font-bold text-[32px] lg:text-[48px] leading-[100%] tracking-[-0.05em] text-[#353556]">
            Як проходить весь шлях
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[10px]">
            {service.advantagesSection?.advantages?.map((advantage, index) => (
              <div
                key={advantage.id}
                className="bg-[#6163AC] p-4 md:p-6 flex flex-col gap-3"
              >
                <h3 className="font-manrope font-bold text-[22px] leading-[100%] tracking-[-0.05em] text-white">
                  {showCases ? `${index + 1}. ` : ""}
                  {advantage.title}
                </h3>
                <p className="font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-white flex-1">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="h-[1px] w-full bg-[#1B1661] opacity-40 my-8 md:my-12" />

        {/* Cases Section - Only show if showCases is true */}
        {showCases && (
          <div id="cases">
            {/* Cases Slider - Using CasesSection component */}
            <CasesSection casesData={casesData} />
          </div>
        )}
      </div>
      {/* CTA Section */}
      <CTASection2 />
    </main>
  );
}
