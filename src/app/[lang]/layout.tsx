import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import I18nProvider from "@/components/providers/i18n-provider";
import { manrope } from "../../fonts/manrope";
import { inter } from "../../fonts/inter";

export const metadata: Metadata = {
  title: "Dr. Dembitskyi",
  description: "Dr. Dembitskyi",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;

  return (
    <html lang={lang}>
      <body className={`${manrope.variable} ${inter.variable} antialiased`}>
        <I18nProvider>
          <Header />
          {children}
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
