"use client";

import { useTranslation } from "react-i18next";
import type { TrustSectionData } from "@/strapi/trust-section";
import RichText from "../ui/rich-text";

interface TrustSectionProps {
  trustData: TrustSectionData | null;
}

export default function TrustSection({ trustData }: TrustSectionProps) {
  const { t } = useTranslation();

  const items = trustData?.items ?? [];

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-[10px] md:px-5 pb-10 md:pb-16">
      <h2 className="font-manrope font-bold text-[40px] md:text-[70px] lg:text-[92px] leading-[100%] tracking-[-0.05em] text-center text-[#353556] max-w-[781px] mx-auto mb-10 md:mb-14 lg:mb-16">
        {t("trustSection.title")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mx-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-start p-5 gap-[14px] bg-[#49497D]"
          >
            <h3 className="font-manrope font-bold text-[22px] leading-[100%] tracking-[-0.05em] text-white">
              {item.title}
            </h3>
            <RichText
              content={item.description}
              bodyVariant="inter"
              className="[&_li]:!text-white [&_p]:!mb-0 [&_p]:!text-white"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
