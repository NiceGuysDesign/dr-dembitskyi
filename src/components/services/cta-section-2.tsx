"use client";

import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { useConsultation } from "../consultation/consultation-provider";

export default function CTASection2() {
  const { openConsultation } = useConsultation();
  const { t } = useTranslation();

  return (
    <section
      className="
        relative w-full overflow-hidden
        max-md:flex max-md:flex-col max-md:min-h-[778px]
        md:h-[70vh] lg:h-screen
      "
    >
      {/* Image block + gradient (mobile: top 528px; desktop: right) */}
      <div
        className="
          relative shrink-0 overflow-hidden pointer-events-none
          max-md:h-[528px] max-md:w-full
          md:absolute md:z-20 md:bottom-0 md:right-0 md:top-auto md:h-full md:w-auto md:left-auto
        "
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/unnamed-2 2.png"
          alt={t("serviceCtaSection.imageAlt")}
          className="
            w-full h-full object-cover object-top
            md:object-contain md:object-right-bottom
            md:w-auto md:h-full
          "
        />
        <div
          className="
            absolute inset-x-0 bottom-0 z-[1]
            h-40 md:h-56
            bg-gradient-to-t from-[#F4F4F5] to-transparent
            pointer-events-none
          "
        />

        {/* Mobile: title on gradient at bottom of image */}
        <h2
          className="
            md:hidden absolute z-[2] left-[10px] right-[10px] bottom-4
            font-manrope font-bold text-[42px] leading-[100%] tracking-[-0.05em] text-[#353556]
          "
        >
          <span className="block">{t("serviceCtaSection.title1")}</span>
          <span className="block mt-[5px]">{t("serviceCtaSection.title2")}</span>
        </h2>
      </div>

      {/* Desktop: heading under photo */}
      <h2
        className="
          hidden md:block relative z-10 px-5 pt-20
          font-manrope font-bold leading-[100%] tracking-[-0.05em] text-[#353556]
          text-[84px] lg:text-[108px] xl:text-[122px] 2xl:text-[179px]
        "
      >
        {t("serviceCtaSection.title1")}
        <br />
        <span className="md:ml-[10%] 2xl:ml-[10%]">
          {t("serviceCtaSection.title2")}
        </span>
      </h2>

      {/* Description + CTA — mobile: flow below image; desktop: above gradient */}
      <div
        className="
          relative z-40 flex flex-col gap-5
          px-[10px] pt-4 pb-10
          md:absolute md:bottom-0 md:left-0 md:right-0 md:px-5 md:pb-64 md:pt-0 md:gap-6
        "
      >
        <p
          className="
            w-full max-w-[340px]
            font-manrope font-semibold text-base
            leading-[150%] tracking-[-0.03em] text-black
            md:max-w-[460px]
          "
        >
          {t("serviceCtaSection.description")}
        </p>

        <Button
          onClick={openConsultation}
          className="
            w-full max-w-[327px] h-[66px] min-h-[54px]
            rounded-[50px] font-inter font-medium text-base
            leading-[100%] tracking-[-0.01em] text-white
          "
          style={{
            background:
              "radial-gradient(114.39% 151.52% at 50% 151.52%, #000000 0%, #3A3A45 100%)",
          }}
        >
          {t("serviceCtaSection.buttonText")}
        </Button>
      </div>
    </section>
  );
}
