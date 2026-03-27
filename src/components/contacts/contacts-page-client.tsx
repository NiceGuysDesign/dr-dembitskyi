"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

export default function ContactsPageClient() {
  const { t } = useTranslation();

  const socialLinks = [
    { key: "viber", href: "viber://chat?number=%2B380988800688" },
    { key: "instagram", href: "https://www.instagram.com/dr_dembitskyi_/" },
    { key: "telegram", href: "https://t.me/dembitskyi_surgery?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnvYF0gOIMlvnVIdGNeBjMAofM2HrcPhEgPteUVkqk6c9EgXoVO7ClcBdgvfk_aem_9oX9RAhWebk8jNi2hi21eA" },
    { key: "youtube", href: "https://www.youtube.com/@dr_dembitskyi" },
    { key: "whatsapp", href: "https://wa.me/380988800688" },
  ];

  const phoneNumbers = ["+38 063 88 006 88", "+38 098 88 006 88"];
  const address = "м. Київ, Бульвар Миколи Руденка, 14Д";

  return (
    <main className="relative w-full mb-10 md:mb-0">
      {/* Content Grid - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column - Image */}
        <div className="relative hidden md:block w-full h-[100vh] ml-[-30px]">
          <Image
            src="/images/0655537E-4939-4EA3-AC61-75FE37A2B3BE-Photoroom 1.png"
            alt="Armchair with laptop"
            fill
            className="object-contain"
          />
        </div>

        {/* Right Column - Title and Contact Information */}
        <div className="flex flex-col gap-0 h-full mt-[120px] md:mt-[15%] px-[10px]">
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
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="font-manrope font-semibold text-base leading-[130%] tracking-[-0.02em] text-[#353556] uppercase hover:opacity-70 transition-opacity cursor-pointer"
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
                    className="font-manrope font-semibold text-base leading-[130%] tracking-[-0.02em] text-[#353556] uppercase hover:opacity-70 transition-opacity cursor-pointer"
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
