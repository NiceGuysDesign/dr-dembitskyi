import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { getBaseUrl } from "./site-url";
import { resolveServiceSlugForLocale } from "@/strapi/services";
import { resolveSubServiceSlugForLocale } from "@/strapi/sub-services";
import { resolveCaseSlugForLocale } from "@/strapi/cases";
import { resolvePackageServiceSlugForLocale } from "@/strapi/package-service";
import { resolveBlogSlugForLocale } from "@/strapi/blog";

type PathSegment = string;

function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

/** Builds absolute URL; homepage uses trailing slash per SEO audit. */
export function buildAbsoluteUrl(lang: Locale, segments: PathSegment[]): string {
  const base = getBaseUrl();
  if (segments.length === 0) {
    return `${base}/${lang}/`;
  }
  return `${base}/${lang}/${segments.join("/")}`;
}

async function resolveSlugForLocale(
  section: "services" | "cases" | "package-service" | "blog",
  slug: string,
  targetLocale: Locale,
): Promise<string | null> {
  const resolvers = {
    services: resolveServiceSlugForLocale,
    cases: resolveCaseSlugForLocale,
    "package-service": resolvePackageServiceSlugForLocale,
    blog: resolveBlogSlugForLocale,
  } as const;

  const result = await resolvers[section](slug, targetLocale);
  if (result.kind === "found" || result.kind === "fallback") {
    return result.slug;
  }
  return null;
}

/**
 * Resolves path segments after locale for both uk and en (localized slugs).
 */
async function resolveLocalizedPaths(
  currentLang: Locale,
  segments: PathSegment[],
): Promise<{ uk: PathSegment[]; en: PathSegment[] }> {
  if (segments.length === 0) {
    return { uk: [], en: [] };
  }

  const section = segments[0];

  if (
    section === "services" &&
    segments.length >= 2 &&
    typeof segments[1] === "string"
  ) {
    const slug = segments[1];
    const ukService =
      currentLang === "uk"
        ? slug
        : (await resolveSlugForLocale("services", slug, "uk")) ?? slug;
    const enService =
      currentLang === "en"
        ? slug
        : (await resolveSlugForLocale("services", slug, "en")) ?? slug;

    if (segments.length >= 3) {
      const subSlug = segments[2];
      let ukSub = subSlug;
      let enSub = subSlug;

      if (currentLang !== "uk") {
        const r = await resolveSubServiceSlugForLocale(subSlug, "uk");
        if (r.kind === "found" || r.kind === "fallback") ukSub = r.slug;
      }
      if (currentLang !== "en") {
        const r = await resolveSubServiceSlugForLocale(subSlug, "en");
        if (r.kind === "found" || r.kind === "fallback") enSub = r.slug;
      }

      return {
        uk: ["services", ukService, ukSub],
        en: ["services", enService, enSub],
      };
    }

    return {
      uk: ["services", ukService],
      en: ["services", enService],
    };
  }

  if (
    (section === "cases" || section === "package-service" || section === "blog") &&
    segments.length >= 2 &&
    typeof segments[1] === "string"
  ) {
    const slug = segments[1];
    const ukSlug =
      currentLang === "uk"
        ? slug
        : (await resolveSlugForLocale(section, slug, "uk")) ?? slug;
    const enSlug =
      currentLang === "en"
        ? slug
        : (await resolveSlugForLocale(section, slug, "en")) ?? slug;

    return {
      uk: [section, ukSlug],
      en: [section, enSlug],
    };
  }

  // Static hub pages: same path in both locales
  return { uk: [...segments], en: [...segments] };
}

export async function buildAlternatesFromPathname(
  pathname: string,
): Promise<NonNullable<Metadata["alternates"]>> {
  const parts = pathname.split("/").filter(Boolean);
  const currentLang = parts[0] && isLocale(parts[0]) ? parts[0] : defaultLocale;
  const segments = parts[0] && isLocale(parts[0]) ? parts.slice(1) : parts;

  const { uk: ukSegments, en: enSegments } = await resolveLocalizedPaths(
    currentLang,
    segments,
  );

  const canonical = buildAbsoluteUrl(currentLang, segments);

  return {
    canonical,
    languages: {
      uk: buildAbsoluteUrl("uk", ukSegments),
      en: buildAbsoluteUrl("en", enSegments),
      "x-default": buildAbsoluteUrl(defaultLocale, ukSegments),
    },
  };
}

/** Merges page metadata with self-referencing canonical + hreflang alternates. */
export async function withSeoAlternates(
  pathname: string,
  metadata: Metadata,
): Promise<Metadata> {
  const alternates = await buildAlternatesFromPathname(pathname);
  return {
    ...metadata,
    alternates,
  };
}
