"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import CasesCarousel from "./cases-carousel";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Case as StrapiCase } from "@/strapi/cases";
import type { CaseCategory } from "@/strapi/case-categories";
import type { CaseFilterOption, CaseFilterValue } from "../cases/cases-filters";
import { type Locale } from "@/i18n/config";
import { localePath } from "@/i18n/routing";
import type { CasesCarouselItem } from "./cases-carousel";

interface CasesSectionProps {
  casesData?: StrapiCase[];
  filterCategories?: CaseCategory[];
  lang: string;
}

export default function CasesSection({
  casesData,
  filterCategories,
  lang,
}: CasesSectionProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [activeFilter, setActiveFilter] = useState<CaseFilterValue>("all");

  const isOnCasesPage = pathname?.includes("/cases");
  const isOnServicePage =
    pathname?.includes("/services/") && pathname?.split("/").length > 3;

  const filterOptions = useMemo<CaseFilterOption[]>(() => {
    const allOption: CaseFilterOption = {
      value: "all",
      label: t("cases.filters.all"),
    };

    if (filterCategories && filterCategories.length > 0) {
      return [
        allOption,
        ...filterCategories.map((cat) => ({
          value: cat.documentId,
          label: cat.name,
        })),
      ];
    }

    const unique = new Map<string, string>();
    for (const caseItem of casesData ?? []) {
      for (const cat of caseItem.categories ?? []) {
        unique.set(cat.documentId, cat.name);
      }
    }

    return [
      allOption,
      ...Array.from(unique.entries()).map(([documentId, name]) => ({
        value: documentId,
        label: name,
      })),
    ];
  }, [filterCategories, casesData, t]);

  const mappedCases = useMemo<CasesCarouselItem[]>(() => {
    if (!casesData?.length) return [];
    return casesData.map((caseItem, index) => ({
      id: caseItem.slug || `case-${index}`,
      slug: caseItem.slug,
      categoryIds: (caseItem.categories ?? []).map((c) => c.documentId),
      image: caseItem.image,
      imageAlt: caseItem.title || caseItem.description || "Case image",
      title: caseItem.title,
      description: caseItem.description || "",
    }));
  }, [casesData]);

  const filteredCases = useMemo(() => {
    if (activeFilter === "all") {
      return mappedCases;
    }
    return mappedCases.filter(
      (caseItem) =>
        caseItem.categoryIds.length > 0 &&
        caseItem.categoryIds.includes(activeFilter),
    );
  }, [mappedCases, activeFilter]);

  const handleFilterChange = useCallback((value: CaseFilterValue) => {
    setActiveFilter(value);
  }, []);

  return (
    <section className="relative w-full py-10 md:py-16 overflow-x-visible overflow-y-visible">
      {isOnServicePage && (
        <h2
          className="font-manrope font-bold text-[21vw] sm:text-[8vw] md:text-[64px] lg:text-[289px] leading-[100%] tracking-[-0.05em] opacity-40 absolute right-0 top-[-4px] md:top-[-4px] pointer-events-none"
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

      <div className="mb-8 md:mb-12 lg:mb-16 px-[10px] md:px-5">
        <div
          className={`flex flex-col lg:flex-row ${
            isOnServicePage ? "lg:items-end" : "lg:items-start"
          } lg:justify-between gap-6 md:gap-8 lg:gap-12`}
        >
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
            <div className="w-full lg:max-w-[460px]">
              <p className="font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-black m-0">
                {t("cases.description")}
              </p>
            </div>
            {!isOnServicePage && (
              <div className="mt-6 md:mt-8 lg:mt-12 h-px bg-[var(--color-line)] opacity-40" />
            )}

            {!isOnServicePage && (
              <div className="mt-4 md:mt-6 lg:mt-8 flex flex-wrap gap-[8px] md:gap-[10px]">
                {filterOptions.map((category) => {
                  const isActive = activeFilter === category.value;
                  return isActive ? (
                    <Button
                      key={category.value}
                      variant="default"
                      onClick={() => handleFilterChange(category.value)}
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
                      {category.label}
                    </Button>
                  ) : (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => handleFilterChange(category.value)}
                      className="cursor-pointer px-6 py-3 h-[48px] md:px-10 md:py-4 md:h-[56px] rounded-[90px] font-inter font-medium text-xs sm:text-sm md:text-base leading-[120%] tracking-[-0.02em] transition-all border border-[var(--color-border-filter)] text-[var(--color-text-filter)] bg-transparent hover:border-[var(--color-gray)] hover:text-[var(--color-gray)]"
                    >
                      {category.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

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
          <CasesCarousel cases={filteredCases} lang={lang} />

          {!isOnCasesPage && (
            <div className="mt-6 md:mt-8 flex justify-center sm:justify-end px-[10px] md:px-5">
              <Link href={localePath(lang as Locale, "cases")}>
                <Button
                  variant="default"
                  style={{ background: "var(--gradient-button)" }}
                  className="min-w-[242px] sm:w-auto"
                >
                  {t("cases.buttonAllCases")}
                </Button>
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}
