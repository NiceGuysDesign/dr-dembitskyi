"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import LenguageSwitcher from "./lenguage-switcher";
import MobileMenu from "./mobile-menu";
import Logo from "../../../public/icons/logo";
import WhatsAppIcon from "../../../public/icons/whatsapp-icon";
import TelegramIcon from "../../../public/icons/telegram-icon";
import InstagramIcon from "../../../public/icons/instagram-icon";
import { Button } from "../ui/button";

export default function Header() {
  const [windowWidth, setWindowWidth] = useState(1440); // Default to desktop width

  const { t } = useTranslation();
  const params = useParams() as { lang?: string };
  const lang = params?.lang ?? "uk";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Track window width for responsive animations
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    { key: "home", href: `/${lang}` },
    { key: "services", href: `/${lang}/services` },
    { key: "about", href: `/${lang}/about` },
    { key: "cases", href: `/${lang}/cases` },
    { key: "blog", href: `/${lang}/blog` },
    { key: "contacts", href: `/${lang}/contacts` },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-[10px] md:px-5 px-[10px] flex items-center justify-between transition-all duration-300 ${
        isScrolled
          ? "bg-[var(--color-bg-light)]/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
      style={{
        top:
          typeof window !== "undefined" && windowWidth >= 768
            ? "0px"
            : `calc(env(safe-area-inset-top, 0px))`,
      }}
    >
      {/* Logo */}
      <div className="flex-shrink-0">
        <Logo className="fill-[#353556]" />
      </div>

      {/* Navigation - centered, hidden on mobile */}
      <nav className="hidden lg:flex flex-1 justify-center">
        <ul className="flex flex-row items-center gap-[12px] xl:gap-[38px]">
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
        </ul>
      </nav>

      {/* Right side - Social, Language, Menu - hidden on mobile */}
      <div className="hidden lg:flex flex-shrink-0 items-center gap-[24px]">
        {/* Social Media Icons */}
        <div className="hidden xl:flex items-center gap-[10px]">
          <a
            href="#"
            className="w-[40px] h-[40px] rounded-full border border-black flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="WhatsApp"
          >
            <WhatsAppIcon />
          </a>
          <a
            href="#"
            className="w-[40px] h-[40px] rounded-full border border-black flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="Viber"
          >
            <InstagramIcon />
          </a>
          <a
            href="#"
            className="w-[40px] h-[40px] rounded-full border border-black flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="Telegram"
          >
            <TelegramIcon />
          </a>
        </div>

        {/* Language Switcher */}
        <LenguageSwitcher />

        {/* Consultation Button - Desktop only */}
        <Button variant="menu">{t("header.consultation")}</Button>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden flex-shrink-0">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-start p-[10px] gap-[10px] min-h-[73px] bg-[var(--color-bg-menu)] rounded-[190px] shadow-[inset_3px_4px_6.1px_rgba(0,0,0,0.23)] cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="bg-[var(--color-bg-menu-button)] text-[var(--color-text-menu)] font-inter font-semibold text-base leading-[100%] tracking-[-0.031em] rounded-[50px] w-fit h-[54px] min-h-[54px] px-6 flex items-center justify-center shadow-[3px_8px_7.7px_rgba(0,0,0,0.34)]">
            {t("header.menu")}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}
