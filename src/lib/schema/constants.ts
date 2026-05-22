import { type Locale } from "@/i18n/config";
import { buildPublicAbsoluteUrl } from "@/i18n/routing";
import { getBaseUrl } from "@/lib/site-url";

export const OG_IMAGE_URL =
  "https://res.cloudinary.com/dcigzhbik/image/upload/v1774541308/Opengraph_rsbedp.png";

export const PHYSICIAN_ID_FRAGMENT = "#physician";
export const MEDICAL_CLINIC_ID_FRAGMENT = "#medical-clinic";

export const PHONE_PRIMARY = "+380638800688";
export const PHONE_SECONDARY = "+380988800688";

export const SOCIAL_LINKS = [
  "https://www.instagram.com/dr_dembitskyi_/",
  "https://www.facebook.com/100088983880508/",
  "https://www.youtube.com/@dr_dembitskyi",
] as const;

export function getPhysicianId(): string {
  return `${getBaseUrl()}${PHYSICIAN_ID_FRAGMENT}`;
}

export function getMedicalClinicId(): string {
  return `${getBaseUrl()}${MEDICAL_CLINIC_ID_FRAGMENT}`;
}

export function localeToLanguageTag(lang: string): "uk-UA" | "en-US" {
  return lang === "en" ? "en-US" : "uk-UA";
}

export function buildPageUrl(lang: string, path = ""): string {
  const base = getBaseUrl();
  const locale: Locale = lang === "en" ? "en" : "uk";
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  const segments = normalized ? normalized.split("/").filter(Boolean) : [];
  return buildPublicAbsoluteUrl(base, locale, segments);
}

export const postalAddress = {
  "@type": "PostalAddress" as const,
  streetAddress: "Бульвар Миколи Руденка, 14Д",
  addressLocality: "Київ",
  addressRegion: "Kyiv",
  addressCountry: "UA",
};

export const areaServed = {
  "@type": "City" as const,
  name: "Kyiv",
};
