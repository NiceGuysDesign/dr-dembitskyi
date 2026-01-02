"use client";

import { useTranslation } from "react-i18next";

export default function BlogHeader() {
  const { t } = useTranslation();

  return (
    <div className="mb-8 md:mb-12 lg:mb-[60px]">
      <h1 className="font-manrope font-bold text-[11vw] md:text-[48px] lg:text-[92px] leading-[120%] tracking-[-0.04em] text-[var(--color-text-heading)]">
        {t("blog.title")}
      </h1>
    </div>
  );
}
