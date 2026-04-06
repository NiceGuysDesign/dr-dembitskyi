import { defaultLocale, locales } from "@/i18n/config";
import { strapiFetch } from "./client";
import type { RichTextNode } from "./services";

export interface StrapiBlockSection {
  id: number;
  heading?: string | null;
  content?: RichTextNode[] | null;
}

export interface StrapiAdvantage {
  id: number;
  title: string;
  description: string;
}

export interface StrapiSubService {
  id: number;
  documentId: string;
  locale?: string;
  slug: string;
  title: string;
  description: string;
  detailSection?: {
    id: number;
    heading?: string | null;
    textblock?: RichTextNode[] | null;
  } | null;
  detailAdvantagesSection?: {
    id: number;
    heading?: string | null;
    advantages?: StrapiAdvantage[] | null;
  } | null;
  block_sections?: StrapiBlockSection[] | null;
  seo?: {
    id: number;
    title: string;
    description: string;
  } | null;
  localizations?: Array<{
    id: number;
    slug: string;
    locale: string;
  }>;
}

export interface StrapiSubServicesResponse {
  data: StrapiSubService[];
  meta?: unknown;
}

export interface SubServiceData {
  slug: string;
  title: string;
  description: string;
  detailSection: {
    heading?: string;
    textblock: RichTextNode[];
  };
  detailAdvantagesSection?: {
    heading?: string;
    advantages: Array<{
      id: string;
      title: string;
      description: string;
    }>;
  };
  blockSections: Array<{
    id: string;
    heading?: string;
    content: RichTextNode[];
  }>;
  seo?: {
    title: string;
    description: string;
  };
  localizations?: Array<{
    slug: string;
    locale: string;
  }>;
}

function transformStrapiSubService(
  sub: StrapiSubService,
  currentLocale: string,
): SubServiceData {
  return {
    slug: sub.slug,
    title: sub.title,
    description: sub.description,
    detailSection: {
      heading: sub.detailSection?.heading ?? undefined,
      textblock: sub.detailSection?.textblock ?? [],
    },
    detailAdvantagesSection: sub.detailAdvantagesSection
      ? {
          heading: sub.detailAdvantagesSection.heading ?? undefined,
          advantages: (sub.detailAdvantagesSection.advantages ?? []).map((a) => ({
            id: a.id.toString(),
            title: a.title,
            description: a.description,
          })),
        }
      : undefined,
    blockSections: (sub.block_sections ?? [])
      .filter(Boolean)
      .map((s) => ({
        id: s.id.toString(),
        heading: s.heading ?? undefined,
        content: s.content ?? [],
      })),
    seo: sub.seo
      ? { title: sub.seo.title, description: sub.seo.description }
      : undefined,
    localizations: [
      { slug: sub.slug, locale: currentLocale },
      ...(sub.localizations ?? [])
        .filter((l) => l.locale !== currentLocale)
        .map((l) => ({ slug: l.slug, locale: l.locale })),
    ],
  };
}

export async function getSubServiceBySlug(
  slug: string,
  locale: string,
): Promise<SubServiceData | null> {
  try {
    const populateQuery =
      `publicationState=live` +
      `&populate[detailSection]=*` +
      `&populate[detailAdvantagesSection][populate]=advantages` +
      `&populate[block_sections]=*` +
      `&populate[seo][populate]=opengraphImage` +
      `&populate[localizations][fields][0]=slug` +
      `&populate[localizations][fields][1]=locale`;
    const query =
      `/api/sub-services?filters[slug][$eq]=${slug}` +
      `&${populateQuery}`;
    const res = await strapiFetch<StrapiSubServicesResponse>(query, locale, {
      next: { revalidate: 60 },
    });
    const first = res.data?.[0];
    if (!first) return null;
    return transformStrapiSubService(first, locale);
  } catch {
    return null;
  }
}

type StrapiSubServiceI18nLink = {
  id: number;
  slug: string;
  locale?: string;
  localizations?: Array<{
    id: number;
    slug: string;
    locale: string;
  }>;
};

type StrapiSubServiceI18nLinkResponse = {
  data: StrapiSubServiceI18nLink[];
};

async function getSubServiceI18nLinksBySlug(
  slug: string,
  locale: string,
): Promise<StrapiSubServiceI18nLink | null> {
  try {
    const query =
      `/api/sub-services?filters[slug][$eq]=${slug}` +
      `&fields[0]=slug&fields[1]=locale` +
      `&populate[localizations][fields][0]=slug` +
      `&populate[localizations][fields][1]=locale` +
      `&publicationState=live`;
    const response = await strapiFetch<StrapiSubServiceI18nLinkResponse>(
      query,
      locale,
      { next: { revalidate: 60 } },
    );
    return response.data?.[0] ?? null;
  } catch {
    return null;
  }
}

async function getSubServiceBySlugInOtherLocales(
  slug: string,
  targetLocale: string,
): Promise<{ link: StrapiSubServiceI18nLink; subServiceLocale: string } | null> {
  const otherLocales = locales.filter((l) => l !== targetLocale);
  for (const locale of otherLocales) {
    const link = await getSubServiceI18nLinksBySlug(slug, locale);
    if (link) return { link, subServiceLocale: locale };
  }
  return null;
}

export type ResolveSubServiceSlugResult =
  | { kind: "found"; slug: string }
  | { kind: "fallback"; slug: string; locale: string }
  | { kind: "missing" };

export async function resolveSubServiceSlugForLocale(
  slug: string,
  targetLocale: string,
): Promise<ResolveSubServiceSlugResult> {
  const direct = await getSubServiceBySlug(slug, targetLocale);
  if (direct) return { kind: "found", slug: direct.slug };

  const other = await getSubServiceBySlugInOtherLocales(slug, targetLocale);
  if (!other) return { kind: "missing" };

  const localizedSlug =
    other.link.locale === targetLocale
      ? other.link.slug
      : other.link.localizations?.find((l) => l.locale === targetLocale)?.slug ??
        null;
  if (localizedSlug) return { kind: "found", slug: localizedSlug };

  const defaultSlug =
    other.link.locale === defaultLocale
      ? other.link.slug
      : other.link.localizations?.find((l) => l.locale === defaultLocale)?.slug ??
        null;
  if (defaultSlug) return { kind: "fallback", slug: defaultSlug, locale: defaultLocale };

  return { kind: "missing" };
}

