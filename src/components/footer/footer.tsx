"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import Logo from "../../../public/icons/logo";

export default function Footer() {
  const { t } = useTranslation();
  const params = useParams() as { lang?: string };
  const lang = params?.lang ?? "uk";

  const navigationItems = [
    { key: "home", href: `/${lang}` },
    { key: "services", href: `/${lang}/services` },
    { key: "about", href: `/${lang}/about` },
    { key: "cases", href: `/${lang}/cases` },
    { key: "blog", href: `/${lang}/blog` },
    { key: "contacts", href: `/${lang}/contacts` },
  ];

  const socialLinks = [
    { key: "viber", href: "viber://chat?number=%2B380988800688" },
    { key: "instagram", href: "https://www.instagram.com/dr_dembitskyi_/" },
    { key: "telegram", href: "https://t.me/dembitskyi_surgery?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnvYF0gOIMlvnVIdGNeBjMAofM2HrcPhEgPteUVkqk6c9EgXoVO7ClcBdgvfk_aem_9oX9RAhWebk8jNi2hi21eA" },
    { key: "youtube", href: "https://www.youtube.com/@dr_dembitskyi" },
    { key: "whatsapp", href: "https://wa.me/380988800688" },
  ];

  const phoneNumbers = ["+38 063 88 006 88", "+38 098 88 006 88"];

  return (
    <footer className="relative w-full px-[10px] md:px-5 py-[48px]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(123.58% 123.58% at 38.64% 20.32%, #454794 0%, #15162E 100%)",
        }}
      />

      <div className="relative flex flex-col gap-[48px] md:gap-[136px]">
        {/* Main content - 50% Logo, 50% Navigation */}
        <div className="flex flex-col md:flex-row w-full">
          {/* Logo block - 50% width */}
          <div className="w-full md:w-1/2 flex items-center justify-center md:justify-start mb-8 md:mb-0">
            <div className="w-full max-w-[580px] h-[200px]">
              <Logo className="fill-white w-full h-full" />
            </div>
          </div>

          {/* Navigation block - 50% width with 3 column grid */}
          <div className="w-full md:w-1/2 md:px-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Navigation - Site */}
              <div className="flex flex-col gap-[18px]">
                <p className="font-inter font-medium text-sm leading-[120%] tracking-[-0.02em] text-white opacity-50 m-0">
                  {t("footer.site")}
                </p>
                <nav className="flex flex-col gap-[3px]">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="font-manrope font-semibold text-base leading-[130%] tracking-[-0.02em] text-white uppercase hover:opacity-80 transition-opacity"
                    >
                      {t(`navigation.${item.key}`)}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Social Networks */}
              <div className="flex flex-col gap-[18px]">
                <p className="font-inter font-medium text-sm leading-[120%] tracking-[-0.02em] text-white opacity-50 m-0">
                  {t("footer.social")}
                </p>
                <div className="flex flex-col gap-[4px]">
                  {socialLinks.map((link) => (
                    <a
                      key={link.key}
                      href={link.href}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="font-manrope font-semibold text-base leading-[130%] tracking-[-0.02em] text-white uppercase hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      {t(`footer.socialLinks.${link.key}`)}
                    </a>
                  ))}
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-[18px]">
                <p className="font-inter font-medium text-sm leading-[120%] tracking-[-0.02em] text-white opacity-50 m-0">
                  {t("footer.phone")}
                </p>
                <div className="flex flex-col gap-[2px]">
                  {phoneNumbers.map((phone, index) => (
                    <a
                      key={index}
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="font-manrope font-semibold text-base leading-[130%] tracking-[-0.02em] text-white uppercase hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section - License and Privacy - full width */}
        <div className="w-full flex flex-row justify-between items-end gap-4">
          <p className="font-manrope font-semibold text-base leading-[130%] tracking-[-0.02em] text-white uppercase opacity-40 m-0">
            {t("footer.license")}
          </p>
          <Link
            href={`/${lang}/privacy`}
            className="font-manrope font-semibold text-base leading-[130%] tracking-[-0.02em] text-white uppercase opacity-40 hover:opacity-60 transition-opacity m-0"
          >
            {t("footer.privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
