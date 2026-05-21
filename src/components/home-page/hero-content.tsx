"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { useConsultation } from "../consultation/consultation-provider";

type HeroContentProps = {
  title: string;
  description: string;
  lang: string;
};

export default function HeroContent({ title, description, lang }: HeroContentProps) {
  const { t } = useTranslation();
  const { openConsultation } = useConsultation();

  const titleParts = title.split(" ");
  const firstName = titleParts[0] || "";
  const lastName = titleParts.slice(1).join(" ") || "";

  return (
    <>
      <h1 className="hidden md:flex relative font-manrope font-bold leading-[100%] tracking-[-0.05em] text-[var(--color-gray)] text-[18vw] md:text-[18vw] xl:text-[19vw] flex-col md:mt-20 xl:mt-0 pointer-events-none">
        {firstName}
        {lastName && <span className="relative z-20">{lastName}</span>}
      </h1>

      <h1 className="mb-10 relative z-30 md:hidden font-manrope font-bold leading-[100%] tracking-[-0.05em] text-[var(--color-gray)] text-[17vw] md:text-[18vw] xl:text-[19vw] flex flex-col md:mt-20 xl:mt-0">
        {title}
      </h1>

      <div className="absolute bottom-0 left-0 lg:bottom-auto md:right-5 lg:top-[5%] lg:left-auto z-30 md:max-w-[50%] lg:max-w-[30%] flex flex-col gap-4 py-10 lg:py-0">
        <p className="font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-black">
          {description}
        </p>
        <div className="flex flex-row items-center gap-4">
          <Button
            variant="default"
            style={{ background: "var(--gradient-button)" }}
            className="min-w-[242px] sm:w-auto"
            onClick={openConsultation}
          >
            {t("header.consultation")}
          </Button>
          <Link href={`/${lang}/services`}>
            <Button
              variant="link"
              className="flex flex-col gap-2 items-start sm:items-center"
            >
              {t("navigation.services")}
              <span className="h-[2px] bg-black w-full" />
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
