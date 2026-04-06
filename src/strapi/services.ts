import { strapiFetch } from "./client";
import { defaultLocale, locales } from "@/i18n/config";

// Rich Text types
export interface RichTextImage {
  url: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

export interface RichTextNode {
  type: string;
  children?: RichTextNode[];
  text?: string;
  format?: string;
  level?: number; // For headings (1-6)
  url?: string; // For links
  image?: RichTextImage; // For images
}

// Strapi types
export interface StrapiImage {
  id: number;
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
  alternativeText?: string | null;
  caption?: string | null;
}

export interface StrapiDetailSection {
  id: number;
  textblock: RichTextNode[];
  heading?: string | null;
}

export interface StrapiAdvantage {
  id: number;
  title: string;
  description: string;
}

export interface StrapiAdvantagesSection {
  id: number;
  heading?: string | null;
  advantages?: StrapiAdvantage[];
}

export interface StrapiSubService {
  id: number;
  documentId: string;
  slug: string;
  title: string;
  description: string;
  locale?: string;
}

export interface StrapiSubServicesSection {
  id: number;
  heading?: string | null;
  sub_services?: StrapiSubService[];
}

export interface StrapiService {
  id: number;
  documentId: string;
  locale?: string;
  slug: string;
  title: string;
  description: string;
  category: string; // "Plastic Surgery" | "Phlebology" | "Injection Cosmetology"
  image?: StrapiImage;
  result: RichTextNode[]; // Rich Text для результатів
  symptoms: RichTextNode[]; // Rich Text для показань
  detailSection: StrapiDetailSection;
  advantagesSection: StrapiAdvantagesSection;
  subSrvices?: StrapiSubServicesSection;
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

export interface StrapiServicesResponse {
  data: StrapiService[];
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
export interface Advantage {
  id: string;
  title: string;
  description: string;
}

export type ServiceCategory = "surgical" | "phlebology" | "cosmetology";

// Map category strings to internal category keys
const categoryMap: Record<string, ServiceCategory> = {
  "Plastic Surgery": "surgical",
  Phlebology: "phlebology",
  "Injection Cosmetology": "cosmetology",
};

export interface ServiceData {
  slug: string;
  title: string;
  description: string;
  category: ServiceCategory;
  detailSection: {
    heading?: string;
    textblock: RichTextNode[];
  };
  result: RichTextNode[]; // Rich Text для результатів
  symptoms: RichTextNode[]; // Rich Text для показань
  advantagesSection: {
    heading?: string;
    advantages: Advantage[];
  };
  subServices?: {
    heading?: string;
    items: Array<{
      slug: string;
      title: string;
      description: string;
    }>;
  };
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
function getImageUrl(
  image: StrapiImage | null | undefined,
  baseUrl?: string,
): string {
  if (!image) return "";
  const base =
    baseUrl || process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  // Strapi повертає URL відносний або абсолютний
  if (image.url.startsWith("http")) {
    return image.url;
  }
  // Якщо URL починається з /, додаємо базовий URL
  if (image.url.startsWith("/")) {
    return `${base}${image.url}`;
  }
  // Інакше додаємо базовий URL з /
  return `${base}/${image.url}`;
}

// Helper function to parse Rich Text to HTML/plain text
function parseRichText(richText: RichTextNode[] | null | undefined): string {
  if (!richText || !Array.isArray(richText)) return "";

  return richText
    .map((node) => {
      if (node.type === "paragraph") {
        if (!node.children || node.children.length === 0) return "";
        return node.children
          .map((child) => (child.text || "").trim())
          .filter(Boolean)
          .join(" ");
      }
      if (node.type === "list") {
        if (!node.children || node.children.length === 0) return "";
        return node.children
          .map((item) => {
            if (item.type === "list-item" && item.children) {
              return item.children
                .map((child) => (child.text || "").trim())
                .filter(Boolean)
                .join(" ");
            }
            return "";
          })
          .filter(Boolean)
          .map((text) => `• ${text}`)
          .join("\n");
      }
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

// Transform Strapi service to ServiceData format
function transformStrapiService(
  strapiService: StrapiService,
  currentLocale: string = "uk",
): ServiceData {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  // Map category string to internal category
  const mappedCategory = categoryMap[strapiService.category] || "surgical";

  return {
    slug: strapiService.slug,
    title: strapiService.title,
    description: strapiService.description,
    category: mappedCategory,
    detailSection: {
      heading: strapiService.detailSection?.heading ?? undefined,
      textblock: strapiService.detailSection?.textblock || [],
    },
    result: strapiService.result || [],
    symptoms: strapiService.symptoms || [],
    advantagesSection: {
      heading: strapiService.advantagesSection?.heading ?? undefined,
      advantages: (strapiService.advantagesSection?.advantages || []).map(
        (advantage) => ({
          id: advantage.id.toString(),
          title: advantage.title || "",
          description: advantage.description || "",
        }),
      ),
    },
    subServices: strapiService.subSrvices
      ? {
          heading: strapiService.subSrvices.heading ?? undefined,
          items: (strapiService.subSrvices.sub_services || []).map((s) => ({
            slug: s.slug,
            title: s.title,
            description: s.description,
          })),
        }
      : undefined,
    seo: strapiService.seo
      ? {
          title: strapiService.seo.title,
          description: strapiService.seo.description,
          opengraphImage: strapiService.seo.opengraphImage
            ? getImageUrl(strapiService.seo.opengraphImage, baseUrl)
            : undefined,
        }
      : undefined,
    localizations: [
      // Додаємо поточний slug для поточної мови
      {
        slug: strapiService.slug,
        locale: currentLocale,
      },
      // Додаємо інші локалізації (фільтруємо поточну, щоб уникнути дублікатів)
      ...(strapiService.localizations || [])
        .filter((loc) => loc.locale !== currentLocale)
        .map((loc) => ({
          slug: loc.slug,
          locale: loc.locale,
        })),
    ],
  };
}

/**
 * Build href for a sub-service page:
 * `services/{serviceSlug}/{subServiceSlug}`
 *
 * Note: locale prefixing (if any) should be handled by the router layer.
 */
export function getSubServiceHref(serviceSlug: string, subServiceSlug: string) {
  return `services/${serviceSlug}/${subServiceSlug}`;
}

// Export Rich Text parsing functions for use in components
export { parseRichText };

const servicesPopulateQuery =
  "publicationState=live" +
  "&populate[detailSection]=*" +
  "&populate[advantagesSection][populate]=advantages" +
  "&populate[subSrvices][populate]=sub_services" +
  "&populate[seo][populate]=opengraphImage";

// Fetch services from Strapi
export async function getServices(
  locale: string = "uk",
): Promise<ServiceData[]> {
  try {
    const response = await strapiFetch<StrapiServicesResponse>(
      `/api/services?${servicesPopulateQuery}`,
      locale,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      },
    );

    return response.data.map((service) =>
      transformStrapiService(service, locale),
    );
  } catch {
    return [];
  }
}

// Fetch single service by slug
export async function getServiceBySlug(
  slug: string,
  locale: string = "uk",
): Promise<ServiceData | null> {
  try {
    const response = await strapiFetch<StrapiServicesResponse>(
      `/api/services?filters[slug][$eq]=${slug}&${servicesPopulateQuery}`,
      locale,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      },
    );

    if (response.data.length === 0) {
      return null;
    }

    return transformStrapiService(response.data[0], locale);
  } catch {
    return null;
  }
}

type StrapiServiceI18nLink = {
  id: number;
  attributes?: never;
  slug: string;
  locale?: string;
  localizations?: Array<{
    id: number;
    slug: string;
    locale: string;
  }>;
};

type StrapiServiceI18nLinkResponse = {
  data: StrapiServiceI18nLink[];
};

async function getServiceI18nLinksBySlug(
  slug: string,
  locale: string,
): Promise<StrapiServiceI18nLink | null> {
  try {
    const query =
      `/api/services?filters[slug][$eq]=${slug}` +
      `&fields[0]=slug&fields[1]=locale` +
      `&populate[localizations][fields][0]=slug` +
      `&populate[localizations][fields][1]=locale` +
      `&publicationState=live`;

    const response = await strapiFetch<StrapiServiceI18nLinkResponse>(
      query,
      locale,
      { next: { revalidate: 60 } },
    );

    const first = response.data?.[0] ?? null;
    return first;
  } catch {
    return null;
  }
}

async function getServiceBySlugInOtherLocales(
  slug: string,
  targetLocale: string,
): Promise<{ link: StrapiServiceI18nLink; serviceLocale: string } | null> {
  const otherLocales = locales.filter((l) => l !== targetLocale);
  for (const locale of otherLocales) {
    const link = await getServiceI18nLinksBySlug(slug, locale);
    if (link) {
      return { link, serviceLocale: locale };
    }
  }
  return null;
}

export type ResolveServiceSlugResult =
  | { kind: "found"; slug: string }
  | { kind: "fallback"; slug: string; locale: string }
  | { kind: "missing" };

/**
 * Resolves a service slug for a target locale using Strapi `localizations`.
 * Intended for server-side redirects when a user lands on a wrong-locale slug.
 */
export async function resolveServiceSlugForLocale(
  slug: string,
  targetLocale: string,
): Promise<ResolveServiceSlugResult> {
  // First try the obvious: slug exists in requested locale
  const direct = await getServiceBySlug(slug, targetLocale);
  if (direct) {
    return { kind: "found", slug: direct.slug };
  }

  // Otherwise, try to find the entry in other supported locales, then map via localizations.
  const other = await getServiceBySlugInOtherLocales(slug, targetLocale);
  if (!other) {
    return { kind: "missing" };
  }

  const localizedSlug =
    other.link.locale === targetLocale
      ? other.link.slug
      : other.link.localizations?.find((l) => l.locale === targetLocale)?.slug ??
        null;
  if (localizedSlug) {
    return { kind: "found", slug: localizedSlug };
  }

  const defaultSlug =
    other.link.locale === defaultLocale
      ? other.link.slug
      : other.link.localizations?.find((l) => l.locale === defaultLocale)?.slug ??
        null;
  if (defaultSlug) {
    return { kind: "fallback", slug: defaultSlug, locale: defaultLocale };
  }

  return { kind: "missing" };
}
