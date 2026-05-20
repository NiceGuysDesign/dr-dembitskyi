import { Case } from "@/strapi/cases";

interface CasePostMetaProps {
  caseItem: Case;
}

export default function CasePostMeta({ caseItem }: CasePostMetaProps) {
  const categoryLabel =
    caseItem.categories.length > 0
      ? caseItem.categories.map((c) => c.name).join(", ")
      : "—";

  return (
    <div className="border-t border-b border-[var(--color-line)] py-4 md:py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
      <span className="font-manrope font-bold text-[20px] leading-[100%] tracking-[-0.05em] text-[#35355699] opacity-60">
        {categoryLabel}
      </span>
      <span className="font-manrope font-bold text-[20px] leading-[100%] tracking-[-0.05em] text-[#35355699] opacity-60 md:text-right">
        {caseItem.publishedAt}
      </span>
    </div>
  );
}
