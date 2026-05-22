import { defaultLocale, locales, type Locale } from "./config";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

/** Public URL path for a locale (uk has no prefix, en uses /en). */
export function localePath(locale: Locale, ...segments: string[]): string {
  const clean = segments.filter(Boolean);
  if (locale === defaultLocale) {
    return clean.length ? `/${clean.join("/")}` : "/";
  }
  return clean.length ? `/en/${clean.join("/")}` : "/en";
}

/** Parses locale from a public or legacy pathname. */
export function getLocaleFromPathname(pathname: string): Locale {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "en") return "en";
  return defaultLocale;
}

/** Path segments after locale (public or legacy /uk/...). */
export function getSegmentsFromPathname(pathname: string): string[] {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "en" || parts[0] === "uk") return parts.slice(1);
  return parts;
}

/** Normalizes any pathname to the public URL form. */
export function toPublicPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  const segments = getSegmentsFromPathname(pathname);
  return localePath(locale, ...segments);
}

/** Internal App Router path (always includes /uk or /en). */
export function toInternalPathname(publicPathname: string): string {
  const locale = getLocaleFromPathname(publicPathname);
  const segments = getSegmentsFromPathname(publicPathname);
  if (segments.length === 0) return `/${locale}`;
  return `/${locale}/${segments.join("/")}`;
}

/** Absolute public URL; homepage uses trailing slash for SEO. */
export function buildPublicAbsoluteUrl(
  base: string,
  locale: Locale,
  segments: string[] = [],
): string {
  const path = localePath(locale, ...segments);
  if (path === "/") return `${base}/`;
  if (path === "/en") return `${base}/en/`;
  return `${base}${path}`;
}
