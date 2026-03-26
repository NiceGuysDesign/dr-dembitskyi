import type { Metadata } from "next";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import I18nProvider from "@/components/providers/i18n-provider";
import SmoothScrollProvider from "@/components/providers/smooth-scroll-provider";
import ConsultationProvider from "@/components/consultation/consultation-provider";
import { MobileMenuProvider } from "@/components/header/mobile-menu-provider";
import MobileMenu from "@/components/header/mobile-menu";
import PageLoader from "@/components/ui/page-loader";
import { defaultLocale } from "@/i18n/config";
import { uk } from "@/i18n/locales/uk";
import { en } from "@/i18n/locales/en";

const OG_IMAGE_URL =
  "https://res.cloudinary.com/dcigzhbik/image/upload/v1774541308/Opengraph_rsbedp.png";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang === "en" ? "en" : defaultLocale;
  const localeMessages = locale === "en" ? en : uk;
  const description = localeMessages.serviceCtaSection.description;

  return {
    title: "Dr. Dembitskyi",
    description,
    openGraph: {
      title: "Dr. Dembitskyi",
      description,
      locale: locale === "en" ? "en_US" : "uk_UA",
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: "Dr. Dembitskyi",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Dr. Dembitskyi",
      description,
      images: [OG_IMAGE_URL],
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  await params; // Ensure params are resolved

  return (
    <>
      <PageLoader />
      <SmoothScrollProvider>
        <I18nProvider>
          <MobileMenuProvider>
            <ConsultationProvider>
              <Header />
              <MobileMenu />
              {children}
              <Footer />
            </ConsultationProvider>
          </MobileMenuProvider>
        </I18nProvider>
      </SmoothScrollProvider>
    </>
  );
}
