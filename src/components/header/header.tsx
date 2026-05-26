"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import LenguageSwitcher from "./lenguage-switcher";
import Logo from "../../../public/icons/logo";
import { useMobileMenu } from "./mobile-menu-provider";
import WhatsAppIcon from "../../../public/icons/whatsapp-icon";
import TelegramIcon from "../../../public/icons/telegram-icon";
import YoutubeIcon from "../../../public/icons/youtube-icon";
import { Button } from "../ui/button";
import { useConsultation } from "../consultation/consultation-provider";
import InstagramIcon from "../../../public/icons/instagram-icon";
import ViberIcon from "../../../public/icons/viber-icon";
import { type Locale } from "@/i18n/config";
import { localePath } from "@/i18n/routing";

export default function Header({ lang }: { lang: string }) {
  const locale = lang as Locale;
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { openMenu } = useMobileMenu();
  const { openConsultation } = useConsultation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Закоментовано кнопку "кейси"
  const navigationItems = [
    { key: "home", href: localePath(locale) },
    { key: "services", href: localePath(locale, "services") },
    { key: "about", href: localePath(locale, "about") },
    { key: "cases", href: localePath(locale, "cases") },
    { key: "blog", href: localePath(locale, "blog") },
    { key: "contacts", href: localePath(locale, "contacts") },
  ];

  return (
    <header
      className={`fixed left-0 right-0 z-50 md:px-5 px-[10px] flex items-center justify-between transition-all duration-300 ${
        isScrolled
          ? "bg-[var(--color-bg-light)]/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
      style={{
        top: "env(safe-area-inset-top, 0px)",
        paddingTop: "calc(10px + env(safe-area-inset-top, 0px))",
        paddingBottom: "10px",
      }}
    >
      {/* Logo */}
      <div className="flex-shrink-0">
        <Link href={localePath(locale)}>
          <Logo className="fill-[#353556]" />
        </Link>
      </div>

      {/* Navigation - centered, hidden on mobile */}
      <nav className="hidden lg:flex flex-1 justify-center">
        <ul className="flex flex-row items-center gap-[12px] xl:gap-[28px] 2xl:gap-[38px]">
          {navigationItems.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="font-manrope font-semibold text-base leading-[130%] tracking-[-0.02em] text-[#353556] uppercase hover:opacity-80 transition-opacity"
              >
                {t(`navigation.${item.key}`)}
              </Link>
            </li>
          ))}
          {/* 
          <li key="cases">
            <Link
              href={localePath(locale, "cases")}
              className="font-manrope font-semibold text-base leading-[130%] tracking-[-0.02em] text-[#353556] uppercase hover:opacity-80 transition-opacity"
            >
              {t('navigation.cases')}
            </Link>
          </li>
          */}
        </ul>
      </nav>

      {/* Right side - Social, Language, Menu - hidden on mobile */}
      <div className="hidden lg:flex flex-shrink-0 items-center gap-[24px]">
        {/* Social Media Icons */}
        <div className="hidden xl:flex items-center gap-[10px]">
          <a
            href="https://wa.me/380988800688"
            className="flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="WhatsApp"
            target="_blank"
            referrerPolicy="no-referrer"
          >
            <WhatsAppIcon />
          </a>
          <a
            href="https://www.instagram.com/dr_dembitskyi_/"
            className="flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="Instagram"
            target="_blank"
            referrerPolicy="no-referrer"
          >
            <InstagramIcon />
          </a>
          <a
            href="https://t.me/dembitskyi_surgery?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnvYF0gOIMlvnVIdGNeBjMAofM2HrcPhEgPteUVkqk6c9EgXoVO7ClcBdgvfk_aem_9oX9RAhWebk8jNi2hi21eA"
            className="flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="Telegram"
            target="_blank"
            referrerPolicy="no-referrer"
          >
            <TelegramIcon />
          </a>
          <a
            href="viber://chat?number=%2B380988800688"
            className="flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="Viber"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ViberIcon />
          </a>
          <a
            href="https://www.youtube.com/@dr_dembitskyi"
            className="flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="Youtube"
            target="_blank"
            referrerPolicy="no-referrer"
          >
            <YoutubeIcon />
          </a>
        </div>

        {/* Language Switcher */}
        <LenguageSwitcher />

        {/* Consultation Button - Desktop only */}
        <Button variant="menu" onClick={openConsultation}>
          {t("header.consultation")}
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden flex-shrink-0">
        <button
          onClick={openMenu}
          className="flex flex-col items-start p-[10px] gap-[10px] min-h-[73px] bg-[var(--color-bg-menu)] rounded-[190px] shadow-[inset_3px_4px_6.1px_rgba(0,0,0,0.23)] cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="bg-[var(--color-bg-menu-button)] text-[var(--color-text-menu)] font-inter font-semibold text-base leading-[100%] tracking-[-0.031em] rounded-[50px] w-fit h-[54px] min-h-[54px] px-6 flex items-center justify-center shadow-[3px_8px_7.7px_rgba(0,0,0,0.34)]">
            {t("header.menu")}
          </span>
        </button>
      </div>
    </header>
  );
}
