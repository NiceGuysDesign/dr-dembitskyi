"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { FaqHomeData } from "@/strapi/faq-home";
import RichText from "../ui/rich-text";

function AccordionIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 ${
        isOpen ? "rotate-180" : ""
      }`}
      aria-hidden
    >
      <path
        d="M20 39.5C30.7696 39.5 39.5 30.7696 39.5 20C39.5 9.23045 30.7696 0.5 20 0.5C9.23045 0.5 0.5 9.23045 0.5 20C0.5 30.7696 9.23045 39.5 20 39.5Z"
        stroke="#0B0B0B"
      />
      <path
        d="M20 15.0503V24.9497M24.7518 20.198L20 24.9497L15.2483 20.198"
        stroke="#0B0B0B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface FaqSectionProps {
  faqData: FaqHomeData | null;
}

export default function FaqSection({ faqData }: FaqSectionProps) {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = faqData?.items ?? [];

  if (items.length === 0) {
    return null;
  }

  const toggleItem = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="w-full px-[10px] md:px-5 py-16 md:py-20 lg:py-24">
      <h2 className="font-manrope font-bold text-[40px] md:text-[70px] lg:text-[92px] leading-[100%] tracking-[-0.05em] text-center text-[#353556] max-w-[781px] mx-auto mb-10 md:mb-14 lg:mb-20">
        {t("faqSection.title")}
      </h2>

      <div className="mx-auto flex w-full max-w-[813px] flex-col gap-[30px]">
        {items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={item.id} className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => toggleItem(index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-6 text-left cursor-pointer"
              >
                <span className="font-manrope font-bold text-[20px] md:text-[24px] leading-[100%] tracking-[-0.05em] text-[#353556]">
                  {item.question}
                </span>
                <AccordionIcon isOpen={isOpen} />
              </button>

              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pr-14 text-[#353556]">
                    <RichText
                      content={item.answer}
                      bodyVariant="inter"
                      className="[&_li]:!text-[#353556] [&_p]:!text-[#353556]"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-[rgba(11,11,11,0.4)]" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
