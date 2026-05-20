import { strapiFetch } from "./client";
import { StrapiImage } from "./services";
import { defaultLocale, locales } from "@/i18n/config";
import type { CaseCategory } from "./case-categories";
import type {
  BlogBeforeAfterBlock,
  BlogImageBlock,
  BlogVideoBlock,
  BlogContentBlock,
  StrapiContentBlock,
} from "./blog";

// Content block types are available from blog.ts if needed in the future

// Strapi types for cases (same structure as blog)
export interface StrapiCase {
  id: number;
  documentId: string;
  slug: string;
  title: string;
  description?: string;
  cases_categories?: Array<{
    id: number;
    documentId: string;
    name: string;
    locale?: string;
  }>;
  image?: StrapiImage | null;
  content: StrapiContentBlock[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  locale: string;
  seo?: {
    id: number;
    title: string;
    description: string;
    opengraphImage?: StrapiImage;
  };
  localizations?: Array<{
    id: number;
    slug: string;
    title: string;
    locale: string;
  }>;
}

export interface StrapiCasesResponse {
  data: StrapiCase[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Transformed types (same structure as blog)
export interface Case {
  slug: string;
  title: string;
  description?: string;
  categories: CaseCategory[];
  image: string | null;
  content: BlogContentBlock[];
  publishedAt: string;
  seo?: {
    title: string;
    description: string;
    opengraphImage?: string;
  };
  localizations?: Array<{
    slug: string;
    locale: string;
  }>;
}

// Helper function to get image URL
function getImageUrl(image: StrapiImage, baseUrl?: string): string {
  if (!image) return "";
  const base =
    baseUrl || process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  if (image.url.startsWith("http")) {
    return image.url;
  }
  if (image.url.startsWith("/")) {
    return `${base}${image.url}`;
  }
  return `${base}/${image.url}`;
}

/** Case list/card cover — returns null when Strapi has no image (avoids empty `src`). */
function resolveCaseCoverImage(
  image: StrapiImage | null | undefined,
  baseUrl?: string,
): string | null {
  if (!image?.url?.trim()) return null;
  const url = getImageUrl(image, baseUrl);
  return url.trim() ? url : null;
}

// Format date to DD.MM.YYYY
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Transform Strapi case to Case format (same logic as blog)
function transformStrapiCase(
  strapiCase: StrapiCase,
  currentLocale: string = "uk"
): Case {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  // Transform content blocks - convert images/videos
  const transformedContent: BlogContentBlock[] = (strapiCase.content || []).map(
    (block) => {
      if (block.__component === "blog-blocks.before-after") {
        const beforeAfterBlock = block as {
          __component: "blog-blocks.before-after";
          id: number;
          caption: string;
          beforeImage: StrapiImage;
          afterImage: StrapiImage;
        };
        return {
          __component: "blog-blocks.before-after",
          id: beforeAfterBlock.id,
          caption: beforeAfterBlock.caption,
          beforeImage: getImageUrl(beforeAfterBlock.beforeImage, baseUrl),
          afterImage: getImageUrl(beforeAfterBlock.afterImage, baseUrl),
        } as BlogBeforeAfterBlock;
      }
      if (block.__component === "blog-blocks.image") {
        const imageBlock = block as {
          __component: "blog-blocks.image";
          id: number;
          caption: string | null;
          image: StrapiImage;
        };
        return {
          __component: "blog-blocks.image",
          id: imageBlock.id,
          caption: imageBlock.caption,
          image: getImageUrl(imageBlock.image, baseUrl),
        } as BlogImageBlock;
      }
      if (block.__component === "blog-blocks.video") {
        const videoBlock = block as {
          __component: "blog-blocks.video";
          id: number;
          caption: string;
          videoUrl: string | null;
          video: StrapiImage | null;
        };
        return {
          __component: "blog-blocks.video",
          id: videoBlock.id,
          caption: videoBlock.caption,
          videoUrl: videoBlock.videoUrl,
          video: videoBlock.video
            ? getImageUrl(videoBlock.video, baseUrl)
            : null,
        } as BlogVideoBlock;
      }
      return block;
    }
  ) as BlogContentBlock[];

  return {
    slug: strapiCase.slug,
    title: strapiCase.title,
    description: strapiCase.description,
    categories: (strapiCase.cases_categories || []).map((cat) => ({
      documentId: cat.documentId,
      name: cat.name,
    })),
    image: resolveCaseCoverImage(strapiCase.image, baseUrl),
    content: transformedContent,
    publishedAt: formatDate(strapiCase.publishedAt || strapiCase.createdAt),
    seo: strapiCase.seo
      ? {
          title: strapiCase.seo.title,
          description: strapiCase.seo.description,
          opengraphImage: strapiCase.seo.opengraphImage
            ? getImageUrl(strapiCase.seo.opengraphImage, baseUrl)
            : undefined,
        }
      : undefined,
    localizations: [
      // Додаємо поточний slug для поточної мови
      {
        slug: strapiCase.slug,
        locale: currentLocale,
      },
      // Додаємо інші локалізації (фільтруємо поточну, щоб уникнути дублікатів)
      ...(strapiCase.localizations || [])
        .filter((loc) => loc.locale !== currentLocale)
        .map((loc) => ({
          slug: loc.slug,
          locale: loc.locale,
        })),
    ],
  };
}

/** `populate=deep` alone — extra populate keys break image loading in Strapi */
const casesPopulateQuery = "populate=deep";

type StrapiCategoryWithCases = {
  documentId: string;
  name: string;
  cases?: Array<{ slug: string }>;
};

type StrapiCaseCategoriesForEnrichResponse = {
  data: StrapiCategoryWithCases[];
};

/**
 * Merges many-to-many categories onto cases via `cases-categories`
 * (separate request so we don't override `populate=deep` on cases).
 */
async function enrichCasesWithCategories(
  cases: Case[],
  locale: string,
): Promise<Case[]> {
  try {
    const response = await strapiFetch<StrapiCaseCategoriesForEnrichResponse>(
      "/api/cases-categories?fields[0]=name&fields[1]=documentId" +
        "&populate[cases][fields][0]=slug&publicationState=live&sort=name:asc",
      locale,
      { next: { revalidate: 60 } },
    );

    const slugToCategories = new Map<string, CaseCategory[]>();

    for (const cat of response.data) {
      const category: CaseCategory = {
        documentId: cat.documentId,
        name: cat.name,
      };
      for (const linkedCase of cat.cases ?? []) {
        if (!linkedCase.slug) continue;
        const existing = slugToCategories.get(linkedCase.slug) ?? [];
        if (!existing.some((c) => c.documentId === category.documentId)) {
          existing.push(category);
          slugToCategories.set(linkedCase.slug, existing);
        }
      }
    }

    return cases.map((caseItem) => {
      const fromRelation = slugToCategories.get(caseItem.slug);
      if (fromRelation && fromRelation.length > 0) {
        return { ...caseItem, categories: fromRelation };
      }
      return caseItem;
    });
  } catch {
    return cases;
  }
}

// Fetch cases from Strapi
export async function getCases(locale: string = "uk"): Promise<Case[]> {
  try {
    const response = await strapiFetch<StrapiCasesResponse>(
      `/api/cases?${casesPopulateQuery}&publicationState=live&sort=publishedAt:desc`,
      locale,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    const cases = response.data.map((caseItem) =>
      transformStrapiCase(caseItem, locale)
    );

    return enrichCasesWithCategories(cases, locale);
  } catch {
    return [];
  }
}

// Fetch single case by slug
export async function getCaseBySlug(
  slug: string,
  locale: string = "uk"
): Promise<Case | null> {
  try {
    const encodedSlug = encodeURIComponent(slug);

    // Спочатку шукаємо в поточній мові
    let response = await strapiFetch<StrapiCasesResponse>(
      `/api/cases?filters[slug][$eq]=${encodedSlug}&${casesPopulateQuery}&publicationState=live`,
      locale,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    // Якщо не знайшли в поточній мові, шукаємо в іншій мові
    if (response.data.length === 0) {
      const otherLocale = locale === "uk" ? "en" : "uk";
      response = await strapiFetch<StrapiCasesResponse>(
        `/api/cases?filters[slug][$eq]=${encodedSlug}&${casesPopulateQuery}&publicationState=live`,
        otherLocale,
        {
          next: { revalidate: 60 },
        }
      );
    }

    if (response.data.length === 0) {
      return null;
    }

    const strapiCase = response.data[0];

    // Якщо знайдений кейс в поточній мові - повертаємо його
    if (strapiCase.locale === locale) {
      const caseItem = transformStrapiCase(strapiCase, locale);
      const [enriched] = await enrichCasesWithCategories([caseItem], locale);
      return enriched;
    }

    // Якщо знайдений кейс не в поточній мові, використовуємо documentId для пошуку локалізації
    // Strapi використовує documentId для зв'язку локалізацій
    if (strapiCase.documentId) {
      // Шукаємо кейс з тим самим documentId в поточній мові
      const localizedResponse = await strapiFetch<StrapiCasesResponse>(
        `/api/cases?filters[documentId][$eq]=${strapiCase.documentId}&${casesPopulateQuery}&publicationState=live`,
        locale,
        {
          next: { revalidate: 60 },
        }
      );

      if (localizedResponse.data.length > 0) {
        const caseItem = transformStrapiCase(localizedResponse.data[0], locale);
        const [enriched] = await enrichCasesWithCategories([caseItem], locale);
        return enriched;
      }
    }

    // Якщо не знайшли через documentId, спробуємо через localizations
    if (strapiCase.localizations && strapiCase.localizations.length > 0) {
      const targetLocalization = strapiCase.localizations.find(
        (loc) => loc.locale === locale
      );

      // Якщо є локалізація для поточної мови, шукаємо кейс за правильним slug
      if (targetLocalization) {
        const encodedTargetSlug = encodeURIComponent(targetLocalization.slug);
        const localizedResponse = await strapiFetch<StrapiCasesResponse>(
          `/api/cases?filters[slug][$eq]=${encodedTargetSlug}&${casesPopulateQuery}&publicationState=live`,
          locale,
          {
            next: { revalidate: 60 },
          }
        );

        if (localizedResponse.data.length > 0) {
          const caseItem = transformStrapiCase(
            localizedResponse.data[0],
            locale,
          );
          const [enriched] = await enrichCasesWithCategories(
            [caseItem],
            locale,
          );
          return enriched;
        }
      }
    }

    // Якщо немає локалізації для поточної мови, повертаємо null
    return null;
  } catch (error) {
    console.error("Error fetching case by slug:", error);
    return null;
  }
}

type StrapiCaseI18nLink = {
  id: number;
  slug: string;
  locale?: string;
  localizations?: Array<{
    id: number;
    slug: string;
    locale: string;
  }>;
};

type StrapiCaseI18nLinkResponse = {
  data: StrapiCaseI18nLink[];
};

async function getCaseI18nLinksBySlug(
  slug: string,
  locale: string
): Promise<StrapiCaseI18nLink | null> {
  try {
    const encodedSlug = encodeURIComponent(slug);
    const query =
      `/api/cases?filters[slug][$eq]=${encodedSlug}` +
      `&fields[0]=slug&fields[1]=locale` +
      `&populate[localizations][fields][0]=slug` +
      `&populate[localizations][fields][1]=locale` +
      `&publicationState=live`;

    const response = await strapiFetch<StrapiCaseI18nLinkResponse>(query, locale, {
      next: { revalidate: 60 },
    });

    return response.data?.[0] ?? null;
  } catch {
    return null;
  }
}

async function getCaseBySlugInOtherLocales(
  slug: string,
  targetLocale: string
): Promise<{ link: StrapiCaseI18nLink; caseLocale: string } | null> {
  const otherLocales = locales.filter((l) => l !== targetLocale);
  for (const locale of otherLocales) {
    const link = await getCaseI18nLinksBySlug(slug, locale);
    if (link) return { link, caseLocale: locale };
  }
  return null;
}

export type ResolveCaseSlugResult =
  | { kind: "found"; slug: string }
  | { kind: "fallback"; slug: string; locale: string }
  | { kind: "missing" };

export async function resolveCaseSlugForLocale(
  slug: string,
  targetLocale: string
): Promise<ResolveCaseSlugResult> {
  const direct = await getCaseBySlug(slug, targetLocale);
  if (direct) return { kind: "found", slug: direct.slug };

  const other = await getCaseBySlugInOtherLocales(slug, targetLocale);
  if (!other) return { kind: "missing" };

  const localizedSlug =
    other.link.locale === targetLocale
      ? other.link.slug
      : other.link.localizations?.find((l) => l.locale === targetLocale)?.slug ??
        null;
  if (localizedSlug) return { kind: "found", slug: localizedSlug };

  const fallbackSlug =
    other.link.locale === defaultLocale
      ? other.link.slug
      : other.link.localizations?.find((l) => l.locale === defaultLocale)?.slug ??
        null;
  if (fallbackSlug) {
    return { kind: "fallback", slug: fallbackSlug, locale: defaultLocale };
  }

  return { kind: "missing" };
}
