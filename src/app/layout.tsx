import type { Metadata } from "next";
import "./globals.css";
import { manrope } from "../fonts/manrope";
import { inter } from "../fonts/inter";
import LangAttributeSetter from "./lang-attribute-setter";

export const metadata: Metadata = {
  title: "Dr. Dembitskyi",
  description: "Dr. Dembitskyi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body className={`${manrope.variable} ${inter.variable} antialiased`}>
        <LangAttributeSetter />
        {children}
      </body>
    </html>
  );
}
