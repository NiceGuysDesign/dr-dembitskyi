"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

export default function HeroImageSection() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full h-[700px] lg:h-[865px] overflow-hidden flex flex-col items-start justify-between px-[10px] lg:px-5 py-5">
      {/* Background Video */}
      <div className="absolute left-0 top-0 w-full h-full">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/video/video-bg.mp4" type="video/mp4" />
          <source src="/video/video-bg.mov" type="video/quicktime" />
        </video>
      </div>

      {/* Text Overlay */}
      <div className="w-full h-auto">
        <h2
          className="font-manrope font-bold text-[23vw] md:text-[20vw] lg:text-[180px] xl:text-[220px] leading-[100%] tracking-[-0.05em] text-white m-0"
          style={{ mixBlendMode: "soft-light" }}
        >
          {t("heroYoutube.title")}
        </h2>
      </div>
      <div className="relative">
        <div className="flex gap-[14px] items-center">
          <Image
            src="/images/Rectangle 29.png"
            alt={t("heroYoutube.avatarAlt")}
            width={66}
            height={66}
            className="rounded-full"
            unoptimized
          />
          <p className="font-bold font-inter text-white text-[24px] leading-[110%] max-w-[196px]">
            {t("heroYoutube.name")}
          </p>
        </div>
        <p className="text-white font-inter text-[16px] leading-[150%] tracking-[-0.03em] font-medium max-w-[460px] mt-[12px] mb-[20px]">
          {t("heroYoutube.description")}
        </p>
        <a href="https://www.youtube.com/@dr_dembitskyi">
          <Button
            variant="default"
            style={{
              background:
                "radial-gradient(114.39% 151.52% at 50% 151.52%, #3B3D7E 0%, #FFFFFF 100%)",
              width: "100%",
              height: "66px",
              minHeight: "54px",
              borderRadius: "50px",
              color: "#131445",
            }}
            className="font-inter font-medium text-sm sm:text-base leading-[100%] tracking-[-0.01em] md:max-w-[242px]"
          >
            {t("heroYoutube.buttonText")}
          </Button>
        </a>
      </div>
    </section>
  );
}
