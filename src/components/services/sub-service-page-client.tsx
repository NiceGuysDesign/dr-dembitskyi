"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import type { SubServiceData } from "@/strapi/sub-services";
import RichText from "../ui/rich-text";
import CTASection2 from "./cta-section-2";
import CasesSection from "../home-page/cases-section";
import { Case } from "@/strapi/cases";

interface SubServicePageClientProps {
  subService: SubServiceData;
  showCases?: boolean;
  casesData?: Case[];
}

export default function SubServicePageClient({
  subService,
  showCases = true,
  casesData,
}: SubServicePageClientProps) {
  const { t } = useTranslation();

  return (
    <main className="relative w-full bg-[#F4F4F5] min-h-screen">
      <div className="px-[10px] md:px-5">
        {/* Hero */}
        <section className="relative pt-[124px] pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h1 className="font-manrope font-bold text-[10vw] lg:text-[5vw] xl:text-[4vw] leading-[100%] tracking-[-0.05em] text-[#353556]">
                {subService.title}
              </h1>
            </div>
            <div className="flex items-start">
              <p className="font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-black">
                {subService.description}
              </p>
            </div>
          </div>

          <div className="h-[1px] w-full bg-[#1B1661] opacity-40 mt-10 mb-10" />
        </section>

        {/* Main detail */}
        <section id="procedure">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            <h2 className="font-manrope font-bold text-[7vw] lg:text-[48px] leading-[100%] tracking-[-0.05em] text-[#353556]">
              {subService.detailSection.heading ||
                t("servicePage.procedureMain")}
            </h2>
            <div className="flex flex-col gap-6">
              <RichText content={subService.detailSection.textblock || []} />
            </div>
          </div>
        </section>
      </div>

      {!!subService.detailAdvantagesSection?.advantages?.length && (
        <div className="px-[10px] md:px-5">
          <div className="h-[1px] w-full bg-[#1B1661] opacity-40 mb-16" />

          <section
            id="process"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16"
          >
            <h2 className="font-manrope font-bold text-[7vw] lg:text-[48px] leading-[100%] tracking-[-0.05em] text-[#353556]">
              {subService.detailAdvantagesSection.heading ||
                t("servicePage.process")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[10px]">
              {subService.detailAdvantagesSection.advantages.map(
                (advantage) => (
                  <div
                    key={advantage.id}
                    className="bg-[#6163AC] p-4 md:p-6 flex flex-col gap-3"
                  >
                    <h3 className="font-manrope font-bold text-[22px] leading-[100%] tracking-[-0.05em] text-white">
                      {advantage.title}
                    </h3>
                    <p className="font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-white flex-1">
                      {advantage.description}
                    </p>
                  </div>
                ),
              )}
            </div>
          </section>
        </div>
      )}

      {/* Detail advantages section (replaces subServices) */}
      {!!subService.blockSections.length && (
        <div className="px-[10px] md:px-5">
          <div className="h-[1px] w-full bg-[#1B1661] opacity-40 mb-16" />

          {(() => {
            const contraindications = subService.blockSections.find(
              (s) => (s.heading || "").trim() === "Протипокази",
            );
            const indications = subService.blockSections.find(
              (s) =>
                (s.heading || "").trim() ===
                "Покази до застосування методу лікування",
            );

            return (
              <>
                {/* Покази */}
                {indications && (
                  <section
                    id="indications"
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16"
                  >
                    <h2 className="font-manrope font-bold text-[7vw] lg:text-[48px] leading-[100%] tracking-[-0.05em] text-[#353556] max-w-[60%]">
                      {indications.heading}
                    </h2>
                    <div>
                      <RichText content={indications.content || []} />
                    </div>
                  </section>
                )}

                <div className="h-[1px] w-full bg-[#1B1661] opacity-40 mb-16" />

                {/* Протипокази */}
                {contraindications && (
                  <section
                    id="contraindications"
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16"
                  >
                    <h2 className="font-manrope font-bold text-[7vw] lg:text-[48px] leading-[100%] tracking-[-0.05em] text-[#353556] max-w-[60%]">
                      {contraindications.heading}
                    </h2>
                    <div>
                      <RichText content={contraindications.content || []} />
                    </div>
                  </section>
                )}
              </>
            );
          })()}
        </div>
      )}
      {/* Divider */}
      <div className="h-[1px] w-full bg-[#1B1661] opacity-40 my-8 md:my-12" />

      {showCases && (
        <div id="cases">
          <CasesSection casesData={casesData} />
        </div>
      )}

      {/* CTA Section */}
      <CTASection2 />
    </main>
  );
}
