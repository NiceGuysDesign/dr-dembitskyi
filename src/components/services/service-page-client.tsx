"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ServiceData } from "@/strapi/services";
import { Case } from "@/strapi/cases";
import CTASection2 from "./cta-section-2";
// import CasesSection from "../home-page/cases-section";
import RichText from "../ui/rich-text";
import LogoLoader from "../ui/logo-loader";

interface ServicePageClientProps {
  lang: string;
  service: ServiceData;
  casesData?: Case[];
  showCases?: boolean;
}

export default function ServicePageClient({
  lang,
  service,
  casesData,
  showCases = true,
}: ServicePageClientProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isNavigatingToSubService, setIsNavigatingToSubService] =
    useState(false);

  // If the route changes, drop the optimistic loader.
  useEffect(() => {
    setIsNavigatingToSubService(false);
  }, [pathname]);

  const loadingLabel = useMemo(
    () => t("common.loading", { defaultValue: "Loading…" }),
    [t],
  );

  return (
    <main className="relative w-full bg-[#F4F4F5] min-h-screen">
      {isNavigatingToSubService && (
        <div
          className="fixed inset-0 z-50 bg-white/70 backdrop-blur-[6px] flex items-center justify-center"
          role="status"
          aria-live="polite"
          aria-label={loadingLabel}
        >
          <LogoLoader className="w-[220px] md:w-[260px]" />
        </div>
      )}
      <div className="px-[10px] md:px-5">
        {/* Hero Section - Title with description on the right */}
        <section className="relative pt-[124px] pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Title */}
            <div>
              <h1 className="font-manrope font-bold text-[10vw] lg:text-[5vw] xl:text-[4vw] leading-[100%] tracking-[-0.05em] text-[#353556]">
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
            <h2 className="font-manrope font-bold text-[7vw] lg:text-[48px] leading-[100%] tracking-[-0.05em] text-[#353556]">
              {service.detailSection?.heading || t("servicePage.procedureMain")}
            </h2>
            <div className="flex flex-col gap-6">
              <RichText content={service.detailSection?.textblock || []} />
            </div>
          </div>

          {/* Sub-services Section */}
          {/* {!!service.subServices?.items?.length && (
            <div className="px-[10px] md:px-5">
              <div className="h-[1px] w-full bg-[#1B1661] opacity-40 mb-16" />

              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
                <h2 className="font-manrope font-bold text-[7vw] lg:text-[48px] leading-[100%] tracking-[-0.05em] text-[#353556]">
                  {service.subServices.heading || t("servicePage.subServices")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[10px]">
                  {service.subServices.items.map((subService) => (
                    <Link
                      key={subService.slug}
                      href={`/${lang}/${getSubServiceHref(service.slug, subService.slug)}`}
                      onClick={() => setIsNavigatingToSubService(true)}
                      className="bg-[#6163AC] min-h-[134px] p-4 md:p-6 flex flex-col gap-3 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B1661] focus-visible:ring-offset-2"
                    >
                      <h3 className="font-manrope font-bold text-[22px] leading-[100%] tracking-[-0.05em] text-white">
                        {subService.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          )} */}

          <div className="h-[1px] w-full bg-[#1B1661] opacity-40 mb-16" />

          {/* Коли варто задуматися про процедуру */}
          <div
            id="indications"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16"
          >
            <h2 className="font-manrope font-bold text-[7vw] lg:text-[48px] leading-[100%] tracking-[-0.05em] text-[#353556] max-w-[60%]">
              {t("servicePage.indications")}
            </h2>
            <div>
              <RichText content={service.symptoms || []} />
            </div>
          </div>
          <div className="h-[1px] w-full bg-[#1B1661] opacity-40 mb-16" />
          {/* Результати */}
          <div
            id="results"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16"
          >
            <h2 className="font-manrope font-bold text-[7vw] lg:text-[48px] leading-[100%] tracking-[-0.05em] text-[#353556]">
              {t("servicePage.results")}
            </h2>
            <div>
              <RichText content={service.result || []} />
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
          <h2 className="font-manrope font-bold text-[7vw] lg:text-[48px] leading-[100%] tracking-[-0.05em] text-[#353556]">
            {service.advantagesSection?.heading || t("servicePage.process")}
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
            {/* <CasesSection casesData={casesData} lang={lang} /> */}
          </div>
        )}
      </div>
      {/* CTA Section */}
      <CTASection2 />
    </main>
  );
}
