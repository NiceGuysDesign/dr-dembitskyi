"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import LenguageSwitcher from "./lenguage-switcher";
import WhatsAppIcon from "../../../public/icons/whatsapp-icon";
import TelegramIcon from "../../../public/icons/telegram-icon";
import InstagramIcon from "../../../public/icons/instagram-icon";
import { Button } from "../ui/button";
import { useConsultation } from "../consultation/consultation-provider";
import { useMobileMenu } from "./mobile-menu-provider";

export default function MobileMenu() {
  const { openConsultation } = useConsultation();
  const { isOpen, closeMenu } = useMobileMenu();

  // Block body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={closeMenu}
          />

          {/* Menu */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 lg:inset-auto lg:top-0 lg:right-0 lg:bottom-0 w-full lg:w-[80%] lg:max-w-[400px] bg-[var(--color-bg-light)] z-[60] shadow-2xl overflow-y-auto"
          >
            <div className="flex flex-col h-full p-5">
              {/* Close button */}
              <div className="flex justify-end mb-8">
                <button
                  onClick={closeMenu}
                  className="w-[40px] h-[40px] rounded-full border border-black flex items-center justify-center font-manrope font-semibold text-lg text-[#353556] hover:opacity-80 transition-opacity"
                >
                  ×
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 mb-8">
                <ul className="flex flex-col gap-6">
                  {navigationItems.map((item, index) => (
                    <motion.li
                      key={item.key}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="font-manrope font-semibold text-2xl leading-[130%] tracking-[-0.02em] text-[#353556] uppercase hover:opacity-80 transition-opacity block"
                      >
                        {t(`navigation.${item.key}`)}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Social Media */}
              <div className="mb-8">
                <p className="font-inter font-medium text-sm leading-[120%] tracking-[-0.02em] text-[#353556] opacity-50 mb-4">
                  {t("footer.social")}
                </p>
                <ul className="flex items-center gap-[10px]">
                  <li>
                    <a  
                    href="#"
                    className="w-[40px] h-[40px] rounded-full border border-black flex items-center justify-center hover:opacity-80 transition-opacity"
                    aria-label="WhatsApp"
                    referrerPolicy="no-referrer"
                    target="_blank"
                    >
                      <WhatsAppIcon />
                    </a>
                  </li>
                  <li>
                  <a
                    href="#"
                    className="w-[40px] h-[40px] rounded-full border border-black flex items-center justify-center hover:opacity-80 transition-opacity"
                    aria-label="Instagram"
                    referrerPolicy="no-referrer"
                    target="_blank"
                  >
                    <InstagramIcon />
                  </a>
                  </li>
                  <li>
                    <a
                    href="#"
                    className="w-[40px] h-[40px] rounded-full border border-black flex items-center justify-center hover:opacity-80 transition-opacity"
                    aria-label="Telegram"
                    referrerPolicy="no-referrer"
                    target="_blank"
                  >
                    <TelegramIcon />
                  </a>
                  </li>
                </ul>
              </div>

              {/* Language Switcher */}
              <div className="mb-8">
                <p className="font-inter font-medium text-sm leading-[120%] tracking-[-0.02em] text-[#353556] opacity-50 mb-4">
                  {t("header.language")}
                </p>
                <LenguageSwitcher />
              </div>

              {/* Consultation Button */}
              <Button
                variant="menu"
                onClick={() => {
                  closeMenu();
                  openConsultation();
                }}
                className="w-full"
              >
                {t("header.consultation")}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
