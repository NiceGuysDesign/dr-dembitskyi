import type { Metadata } from "next";
import "./globals.css";
import { manrope } from "../fonts/manrope";
import { inter } from "../fonts/inter";
import LangAttributeSetter from "./lang-attribute-setter";
import {
  GoogleTagManagerBody,
  GoogleTagManagerHead,
} from "@/components/analytics/google-tag-manager";

export const metadata: Metadata = {
  title: "Dr. Dembitskyi",
  description: "Dr. Dembitskyi",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "EKIqjIvaIK-_6y0orY2IQflLWOE0Kd4c4nX3rF6EXdI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body className={`${manrope.variable} ${inter.variable} antialiased`}>
        <GoogleTagManagerHead />
        <GoogleTagManagerBody />
        <LangAttributeSetter />
        {children}
      </body>
    </html>
  );
}
