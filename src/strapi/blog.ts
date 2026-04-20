import { strapiFetch } from "./client";
import { StrapiImage } from "./services";
import { defaultLocale, locales } from "@/i18n/config";

// Content block types
export interface BlogHeadingBlock {
  __component: "blog-blocks.heading";
  id: number;
  text: string;
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export interface BlogTextBlock {
  __component: "blog-blocks.text";
  id: number;
  content: string; // Markdown content
}

export interface BlogBeforeAfterBlock {
  __component: "blog-blocks.before-after";
  id: number;
  caption: string;
  beforeImage: string; // Transformed to URL string
  afterImage: string; // Transformed to URL string
}

export interface BlogImageBlock {
  __component: "blog-blocks.image";
  id: number;
  caption: string | null;
  image: string; // Transformed to URL string
}

export interface BlogVideoBlock {
  __component: "blog-blocks.video";
  id: number;
  caption: string;
  videoUrl: string | null; // YouTube URL
  video: string | null; // Uploaded video URL (transformed)
}

export type BlogContentBlock =
  | BlogHeadingBlock
  | BlogTextBlock
  | BlogBeforeAfterBlock
  | BlogImageBlock
  | BlogVideoBlock;

// Strapi version of blocks (with StrapiImage/StrapiVideo)
interface StrapiBeforeAfterBlock {
  __component: "blog-blocks.before-after";
  id: number;
  caption: string;
  beforeImage: StrapiImage;
  afterImage: StrapiImage;
}

interface StrapiImageBlock {
  __component: "blog-blocks.image";
  id: number;
  caption: string | null;
  image: StrapiImage;
}

interface StrapiVideoBlock {
  __component: "blog-blocks.video";
  id: number;
  caption: string;
  videoUrl: string | null;
  video: StrapiImage | null; // Video file from Strapi
}

export type StrapiContentBlock =
  | BlogHeadingBlock
  | BlogTextBlock
  | StrapiBeforeAfterBlock
  | StrapiImageBlock
  | StrapiVideoBlock;

// Strapi types
export interface StrapiBlogPost {
  id: number;
  documentId: string;
  slug: string;
  title: string;
  description?: string;
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

export interface StrapiBlogPostsResponse {
  data: StrapiBlogPost[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Transformed types
export interface BlogPost {
  slug: string;
  title: string;
  description?: string;
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

// Transform Strapi blog post to BlogPost format
function transformStrapiBlogPost(
  strapiPost: StrapiBlogPost,
  currentLocale: string = "uk"
): BlogPost {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  // Transform content blocks - convert images/videos
  const transformedContent: BlogContentBlock[] = (strapiPost.content || []).map(
    (block) => {
      if (block.__component === "blog-blocks.before-after") {
        const beforeAfterBlock = block as StrapiBeforeAfterBlock;
        return {
          __component: "blog-blocks.before-after",
          id: beforeAfterBlock.id,
          caption: beforeAfterBlock.caption,
          beforeImage: getImageUrl(beforeAfterBlock.beforeImage, baseUrl),
          afterImage: getImageUrl(beforeAfterBlock.afterImage, baseUrl),
        } as BlogBeforeAfterBlock;
      }
      if (block.__component === "blog-blocks.image") {
        const imageBlock = block as StrapiImageBlock;
        return {
          __component: "blog-blocks.image",
          id: imageBlock.id,
          caption: imageBlock.caption,
          image: getImageUrl(imageBlock.image, baseUrl),
        } as BlogImageBlock;
      }
      if (block.__component === "blog-blocks.video") {
        const videoBlock = block as StrapiVideoBlock;
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
    slug: strapiPost.slug,
    title: strapiPost.title,
    description: strapiPost.description,
    image: getImageUrl(strapiPost.image, baseUrl),
    content: transformedContent,
    publishedAt: formatDate(strapiPost.publishedAt || strapiPost.createdAt),
    seo: strapiPost.seo
      ? {
          title: strapiPost.seo.title,
          description: strapiPost.seo.description,
          opengraphImage: strapiPost.seo.opengraphImage
            ? getImageUrl(strapiPost.seo.opengraphImage, baseUrl)
            : undefined,
        }
      : undefined,
    localizations: [
      // Додаємо поточний slug для поточної мови
      {
        slug: strapiPost.slug,
        locale: currentLocale,
      },
      // Додаємо інші локалізації (фільтруємо поточну, щоб уникнути дублікатів)
      ...(strapiPost.localizations || [])
        .filter((loc) => loc.locale !== currentLocale)
        .map((loc) => ({
          slug: loc.slug,
          locale: loc.locale,
        })),
    ],
  };
}

// Fetch blog posts from Strapi
export async function getBlogPosts(locale: string = "uk"): Promise<BlogPost[]> {
  try {
    const response = await strapiFetch<StrapiBlogPostsResponse>(
      `/api/blogs?populate=deep&publicationState=live&sort=publishedAt:desc`,
      locale,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    return response.data.map((post) => transformStrapiBlogPost(post, locale));
  } catch {
    return [];
  }
}

// Fetch single blog post by slug
export async function getBlogPostBySlug(
  slug: string,
  locale: string = "uk"
): Promise<BlogPost | null> {
  try {
    const response = await strapiFetch<StrapiBlogPostsResponse>(
      `/api/blogs?filters[slug][$eq]=${slug}&populate=deep&publicationState=live`,
      locale,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    if (response.data.length === 0) {
      return null;
    }

    return transformStrapiBlogPost(response.data[0], locale);
  } catch {
    return null;
  }
}

type StrapiBlogI18nLink = {
  id: number;
  attributes?: never;
  slug: string;
  locale: string;
  localizations?: Array<{
    id: number;
    slug: string;
    locale: string;
  }>;
};

type StrapiBlogI18nLinkResponse = {
  data: StrapiBlogI18nLink[];
};

async function getBlogI18nLinksBySlug(
  slug: string,
  locale: string,
): Promise<StrapiBlogI18nLink | null> {
  try {
    const query =
      `/api/blogs?filters[slug][$eq]=${slug}` +
      `&fields[0]=slug&fields[1]=locale` +
      `&populate[localizations][fields][0]=slug` +
      `&populate[localizations][fields][1]=locale` +
      `&publicationState=live`;

    const response = await strapiFetch<StrapiBlogI18nLinkResponse>(
      query,
      locale,
      { next: { revalidate: 60 } },
    );
    return response.data?.[0] ?? null;
  } catch {
    return null;
  }
}

async function getBlogBySlugInOtherLocales(
  slug: string,
  targetLocale: string,
): Promise<{ link: StrapiBlogI18nLink; postLocale: string } | null> {
  const otherLocales = locales.filter((l) => l !== targetLocale);
  for (const locale of otherLocales) {
    const link = await getBlogI18nLinksBySlug(slug, locale);
    if (link) return { link, postLocale: locale };
  }
  return null;
}

export type ResolveBlogSlugResult =
  | { kind: "found"; slug: string }
  | { kind: "fallback"; slug: string; locale: string }
  | { kind: "missing" };

export async function resolveBlogSlugForLocale(
  slug: string,
  targetLocale: string,
): Promise<ResolveBlogSlugResult> {
  const direct = await getBlogPostBySlug(slug, targetLocale);
  if (direct) return { kind: "found", slug: direct.slug };

  const other = await getBlogBySlugInOtherLocales(slug, targetLocale);
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
