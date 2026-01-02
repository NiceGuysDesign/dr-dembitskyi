import { Case } from "@/strapi/cases";

interface CasePostMetaProps {
  caseItem: Case;
}

// Map Strapi category to Ukrainian label
const getCategoryLabel = (category?: string): string => {
  if (!category) return "Пластична хірургія";

  const normalized = category.trim().toLowerCase();

  if (normalized.includes("blepharoplasty")) return "Блефаропластика";
  if (normalized.includes("facelift")) return "Підтяжка обличчя";
  if (normalized.includes("liposuction")) return "Ліпосакція";
  if (normalized.includes("mammoplasty")) return "Мамопластика";

  return "Пластична хірургія";
};

export default function CasePostMeta({ caseItem }: CasePostMetaProps) {
  const categoryLabel = getCategoryLabel(caseItem.category);

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
