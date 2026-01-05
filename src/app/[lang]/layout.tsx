import type { Metadata } from "next";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import I18nProvider from "@/components/providers/i18n-provider";
import SmoothScrollProvider from "@/components/providers/smooth-scroll-provider";
import ConsultationProvider from "@/components/consultation/consultation-provider";
import { MobileMenuProvider } from "@/components/header/mobile-menu-provider";
import MobileMenu from "@/components/header/mobile-menu";
import PageLoader from "@/components/ui/page-loader";

export const metadata: Metadata = {
  title: "Dr. Dembitskyi",
  description: "Dr. Dembitskyi",
};

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
