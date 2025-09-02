"use client";

import { useTranslation } from "react-i18next";

type ServicesPageProps = {
  params: { slug: string };
};

export default function ServicePage({ params }: ServicesPageProps) {
  const { slug } = params;
  const { t } = useTranslation();
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1>
        {t("services.title")}: {slug}
      </h1>
    </div>
  );
}
