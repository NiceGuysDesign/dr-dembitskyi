import { strapiFetch } from "./client";
import { StrapiImage } from "./services";
import type {
  BlogHeadingBlock,
  BlogTextBlock,
  BlogBeforeAfterBlock,
  BlogImageBlock,
  BlogVideoBlock,
  BlogContentBlock,
  StrapiContentBlock,
} from "./blog";

// Re-export content block types for cases (same structure as blog)
export type {
  BlogHeadingBlock as CaseHeadingBlock,
  BlogTextBlock as CaseTextBlock,
  BlogBeforeAfterBlock as CaseBeforeAfterBlock,
  BlogImageBlock as CaseImageBlock,
  BlogVideoBlock as CaseVideoBlock,
  BlogContentBlock as CaseContentBlock,
};

// Strapi types for cases (same structure as blog)
export interface StrapiCase {
  id: number;
  documentId: string;
  slug: string;
  title: string;
  description?: string;
  category?: string;
  image: StrapiImage;
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
  category?: string;
  image: string;
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
    category: strapiCase.category,
    image: getImageUrl(strapiCase.image, baseUrl),
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

// Fetch cases from Strapi
export async function getCases(locale: string = "uk"): Promise<Case[]> {
  try {
    const response = await strapiFetch<StrapiCasesResponse>(
      `/api/cases?populate=deep&publicationState=live&sort=publishedAt:desc`,
      locale,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    const cases = response.data.map((caseItem) =>
      transformStrapiCase(caseItem, locale)
    );

    // Якщо кейсів менше 10, дублюємо їх до 10
    if (cases.length > 0 && cases.length < 10) {
      const duplicatedCases: Case[] = [...cases];
      const originalCase = cases[0];

      while (duplicatedCases.length < 10) {
        const index = duplicatedCases.length;
        duplicatedCases.push({
          ...originalCase,
          slug: `${originalCase.slug}-${index}`,
          title: `${originalCase.title} ${index > 1 ? `(${index})` : ""}`,
        });
      }

      return duplicatedCases;
    }

    return cases;
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
    // Спочатку шукаємо в поточній мові
    let response = await strapiFetch<StrapiCasesResponse>(
      `/api/cases?filters[slug][$eq]=${slug}&populate[localizations][fields][0]=slug&populate[localizations][fields][1]=locale&populate=deep&publicationState=live`,
      locale,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    // Якщо не знайшли в поточній мові, шукаємо в іншій мові
    if (response.data.length === 0) {
      const otherLocale = locale === "uk" ? "en" : "uk";
      response = await strapiFetch<StrapiCasesResponse>(
        `/api/cases?filters[slug][$eq]=${slug}&populate[localizations][fields][0]=slug&populate[localizations][fields][1]=locale&populate=deep&publicationState=live`,
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
      return transformStrapiCase(strapiCase, locale);
    }

    // Якщо знайдений кейс не в поточній мові, використовуємо documentId для пошуку локалізації
    // Strapi використовує documentId для зв'язку локалізацій
    if (strapiCase.documentId) {
      // Шукаємо кейс з тим самим documentId в поточній мові
      const localizedResponse = await strapiFetch<StrapiCasesResponse>(
        `/api/cases?filters[documentId][$eq]=${strapiCase.documentId}&populate=deep&publicationState=live`,
        locale,
        {
          next: { revalidate: 60 },
        }
      );

      if (localizedResponse.data.length > 0) {
        return transformStrapiCase(localizedResponse.data[0], locale);
      }
    }

    // Якщо не знайшли через documentId, спробуємо через localizations
    if (strapiCase.localizations && strapiCase.localizations.length > 0) {
      const targetLocalization = strapiCase.localizations.find(
        (loc) => loc.locale === locale
      );

      // Якщо є локалізація для поточної мови, шукаємо кейс за правильним slug
      if (targetLocalization) {
        const localizedResponse = await strapiFetch<StrapiCasesResponse>(
          `/api/cases?filters[slug][$eq]=${targetLocalization.slug}&populate=deep&publicationState=live`,
          locale,
          {
            next: { revalidate: 60 },
          }
        );

        if (localizedResponse.data.length > 0) {
          return transformStrapiCase(localizedResponse.data[0], locale);
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
