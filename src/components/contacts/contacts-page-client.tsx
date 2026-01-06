"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

export default function ContactsPageClient() {
  const { t } = useTranslation();

  const socialLinks = [
    { key: "instagram", href: "#" },
    { key: "youtube", href: "#" },
    { key: "telegram", href: "#" },
    { key: "viber", href: "#" },
  ];

  const phoneNumbers = ["+38 066 777 33 22", "+38 066 777 33 22"];
  const address = "м. Київ, вул. Саксаганського, 155а";

  return (
    <main className="relative w-full">
      {/* Content Grid - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column - Image */}
        <div className="relative w-full h-[100vh] ml-[-30px]">
          <Image
            src="/images/0655537E-4939-4EA3-AC61-75FE37A2B3BE-Photoroom 1.png"
            alt="Armchair with laptop"
            fill
            className="object-contain"
          />
        </div>

        {/* Right Column - Title and Contact Information */}
        <div className="flex flex-col gap-0 h-full mt-[15%]">
          {/* Title */}
          <h1 className="font-manrope font-bold text-[60px] md:text-[80px] lg:text-[92px] leading-[100%] tracking-[-0.05em] text-[#353556] mb-[60px]">
            {t("contacts.title")}
          </h1>

          {/* Social Networks and Phone in one row on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-[18px]">
            {/* Social Networks Section */}
            <div className="flex flex-col gap-[18px]">
              <p className="font-inter font-medium text-sm leading-[120%] tracking-[-0.02em] text-[#353556] opacity-50 m-0">
                {t("footer.social")}
              </p>
              <div className="flex flex-col gap-[4px]">
                {socialLinks.map((link) => (
                  <a
                    key={link.key}
                    href={link.href}
                    className="font-manrope font-semibold text-base leading-[130%] tracking-[-0.02em] text-[#353556] uppercase hover:opacity-70 transition-opacity"
                  >
                    {t(`footer.socialLinks.${link.key}`)}
                  </a>
                ))}
              </div>
            </div>

            {/* Phone Section */}
            <div className="flex flex-col gap-[18px]">
              <p className="font-inter font-medium text-sm leading-[120%] tracking-[-0.02em] text-[#353556] opacity-50 m-0">
                {t("footer.phone")}
              </p>
              <div className="flex flex-col gap-[2px]">
                {phoneNumbers.map((phone, index) => (
                  <a
                    key={index}
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="font-manrope font-semibold text-base leading-[130%] tracking-[-0.02em] text-[#353556] uppercase hover:opacity-70 transition-opacity"
                  >
                    {phone}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="flex flex-col gap-[18px]">
            <p className="font-inter font-medium text-sm leading-[120%] tracking-[-0.02em] text-[#353556] opacity-50 m-0">
              {t("contacts.address")}
            </p>
            <p className="font-manrope font-semibold text-base leading-[130%] tracking-[-0.02em] text-[#353556] uppercase m-0">
              {address}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
