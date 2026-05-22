import type { Metadata } from "next";
import { headers } from "next/headers";
import { defaultLocale, type Locale } from "@/i18n/config";
import { localePath } from "@/i18n/routing";
import { withSeoAlternates } from "@/lib/seo";
import { uk } from "@/i18n/locales/uk";
import { en } from "@/i18n/locales/en";
import RichText from "@/components/ui/rich-text";
import { getPrivacyPolicy } from "@/strapi/privacy-policy";
import { Container } from "@/components/ui/container";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang === "en" ? "en" : defaultLocale;
  const messages = locale === "en" ? en : uk;

  const pathname =
    (await headers()).get("x-pathname") ??
    localePath(locale as Locale, "privacy");

  return withSeoAlternates(pathname, {
    title: `${messages.footer.privacy} | Dr. Dembitskyi`,
    description:
      locale === "en"
        ? "Privacy policy and personal data processing information."
        : "Політика конфіденційності та обробки персональних даних.",
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang === "en" ? "en" : defaultLocale;
  const messages = locale === "en" ? en : uk;
  const privacyText = await getPrivacyPolicy(locale);

  return (
    <main className="relative w-full min-h-screen pt-24 md:pt-30 pb-16 md:pb-[60px]">
      <div className="px-[10px] md:px-5">
        <Container variant="content">
          <h1 className="font-manrope font-bold text-[9vw] md:text-[48px] lg:text-[84px] leading-[120%] tracking-[-0.04em] text-[var(--color-text-heading)] mb-6 md:mb-8">
            {messages.footer.privacy}
          </h1>
          {privacyText ? (
            <RichText content={privacyText} spacing="document" />
          ) : (
            <p className="font-manrope font-medium text-sm md:text-base leading-[150%] tracking-[-0.03em] text-black">
              {locale === "en"
                ? "Privacy policy content is not available at the moment."
                : "Текст політики конфіденційності наразі недоступний."}
            </p>
          )}
        </Container>
      </div>
    </main>
  );
}
