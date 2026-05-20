"use client";

import { useMemo } from "react";
import { Case } from "@/strapi/cases";
import CaseCard from "./case-card";
import { useTranslation } from "react-i18next";
import type { CaseFilterValue } from "./cases-filters";

interface CasesListProps {
  cases: Case[];
  activeFilter: CaseFilterValue;
  lang: string;
}

export default function CasesList({ cases, activeFilter, lang }: CasesListProps) {
  const { t } = useTranslation();

  const filteredCases = useMemo(() => {
    if (activeFilter === "all") {
      return cases;
    }

    // Кейси без категорії показуються лише у фільтрі «Усі»
    return cases.filter((caseItem) => {
      const ids = caseItem.categories ?? [];
      if (ids.length === 0) return false;
      return ids.some((cat) => cat.documentId === activeFilter);
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
