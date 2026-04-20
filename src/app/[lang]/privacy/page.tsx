import type { Metadata } from "next";
import { defaultLocale } from "@/i18n/config";
import { uk } from "@/i18n/locales/uk";
import { en } from "@/i18n/locales/en";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang === "en" ? "en" : defaultLocale;
  const messages = locale === "en" ? en : uk;

  return {
    title: `${messages.footer.privacy} | Dr. Dembitskyi`,
    description:
      locale === "en"
        ? "Privacy policy and personal data processing information."
        : "Політика конфіденційності та обробки персональних даних.",
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang === "en" ? "en" : defaultLocale;
  const messages = locale === "en" ? en : uk;

  return (
    <main className="relative w-full min-h-screen pt-24 md:pt-30 pb-16 md:pb-[60px]">
      <div className="px-[10px] md:px-5">
        <h1 className="font-manrope font-bold text-[11vw] md:text-[48px] lg:text-[92px] leading-[120%] tracking-[-0.04em] text-[var(--color-text-heading)] mb-6 md:mb-8">
          {messages.footer.privacy}
        </h1>

        <div className="max-w-[900px]">
          <p className="font-manrope font-semibold text-sm md:text-base leading-[150%] tracking-[-0.03em] text-black">
            {locale === "en"
              ? "This page describes how we collect, use, and protect personal data. The full text will be published here."
              : "На цій сторінці буде описано, як ми збираємо, використовуємо та захищаємо персональні дані. Повний текст політики буде розміщено тут."}
          </p>
        </div>
      </div>
    </main>
  );
}

