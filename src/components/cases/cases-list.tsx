"use client";

import { useMemo } from "react";
import { Case } from "@/strapi/cases";
import CaseCard from "./case-card";
import { useTranslation } from "react-i18next";
import type { CaseFilterType } from "./cases-filters";

interface CasesListProps {
  cases: Case[];
  activeFilter: CaseFilterType;
  lang: string;
}

// Map filter keys to Strapi category values
const categoryMap: Record<CaseFilterType, string | null> = {
  all: null,
  blepharoplasty: "Blepharoplasty",
  facelift: "Facelift",
  liposuction: "Liposuction",
  mammoplasty: "Mammoplasty",
};

export default function CasesList({ cases, activeFilter, lang }: CasesListProps) {
  const { t } = useTranslation();

  // Filter cases based on active filter
  const filteredCases = useMemo(() => {
    if (activeFilter === "all") {
      return cases;
    }
    const targetCategory = categoryMap[activeFilter];
    if (!targetCategory) return cases;

    return cases.filter((caseItem) => {
      if (!caseItem.category) return false;
      // Нормалізуємо категорії для порівняння (trim пробілів, toLowerCase)
      const normalizedCaseCategory = caseItem.category.trim().toLowerCase();
      const normalizedTargetCategory = targetCategory.trim().toLowerCase();
      return normalizedCaseCategory === normalizedTargetCategory;
    });
  }, [cases, activeFilter]);

  if (filteredCases.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-manrope font-semibold text-base leading-[140%] text-[var(--color-text-primary)]">
          {t("cases.noCases") || "Немає кейсів для відображення"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px]">
      {filteredCases.map((caseItem) => (
        <div key={caseItem.slug} className="w-full lg:mx-0">
          <CaseCard caseItem={caseItem} lang={lang} />
        </div>
      ))}
    </div>
  );
}
