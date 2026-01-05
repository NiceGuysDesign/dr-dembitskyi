import { strapiFetch } from "./client";

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
}

export interface StrapiAdvantage {
  id: number;
  title: string;
  description: string;
}

export interface StrapiAdvantagesSection {
  id: number;
  advantages?: StrapiAdvantage[];
}

export interface StrapiPackageService {
  id: number;
  documentId: string;
  slug: string;
  title: string;
  description: string;
  category: string; // "Plastic Surgery" | "Phlebology" | "Injection Cosmetology"
  image: StrapiImage;
  result: RichTextNode[]; // Rich Text для результатів
  symptoms: RichTextNode[]; // Rich Text для показань
  detailSection: StrapiDetailSection;
  advantagesSection: StrapiAdvantagesSection;
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

export interface StrapiPackageServicesResponse {
  data: StrapiPackageService[];
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
  image: string;
  category: ServiceCategory;
  detailSection: {
    textblock: RichTextNode[];
  };
  result: RichTextNode[]; // Rich Text для результатів
  symptoms: RichTextNode[]; // Rich Text для показань
  advantagesSection: {
    advantages: Advantage[];
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
  baseUrl?: string
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
function transformStrapiPackageService(
  strapiPackageService: StrapiPackageService,
  currentLocale: string = "uk"
): ServiceData {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  // Map category string to internal category
  const mappedCategory =
    categoryMap[strapiPackageService.category] || "surgical";

  return {
    slug: strapiPackageService.slug,
    title: strapiPackageService.title,
    description: strapiPackageService.description,
    image: getImageUrl(strapiPackageService.image, baseUrl),
    category: mappedCategory,
    detailSection: {
      textblock: strapiPackageService.detailSection?.textblock || [],
    },
    result: strapiPackageService.result || [],
    symptoms: strapiPackageService.symptoms || [],
    advantagesSection: {
      advantages: (
        strapiPackageService.advantagesSection?.advantages || []
      ).map((advantage) => ({
        id: advantage.id.toString(),
        title: advantage.title || "",
        description: advantage.description || "",
      })),
    },
    seo: strapiPackageService.seo
      ? {
          title: strapiPackageService.seo.title,
          description: strapiPackageService.seo.description,
          opengraphImage: strapiPackageService.seo.opengraphImage
            ? getImageUrl(strapiPackageService.seo.opengraphImage, baseUrl)
            : undefined,
        }
      : undefined,
    localizations: [
      // Додаємо поточний slug для поточної мови
      {
        slug: strapiPackageService.slug,
        locale: currentLocale,
      },
      // Додаємо інші локалізації (фільтруємо поточну, щоб уникнути дублікатів)
      ...(strapiPackageService.localizations || [])
        .filter((loc) => loc.locale !== currentLocale)
        .map((loc) => ({
          slug: loc.slug,
          locale: loc.locale,
        })),
    ],
  };
}

// Export Rich Text parsing functions for use in components
export { parseRichText };

// Fetch services from Strapi
export async function getPackageServices(
  locale: string = "uk"
): Promise<ServiceData[]> {
  try {
    const response = await strapiFetch<StrapiPackageServicesResponse>(
      `/api/package-services?populate=deep&publicationState=live`,
      locale,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    return response.data.map((service) =>
      transformStrapiPackageService(service, locale)
    );
  } catch {
    return [];
  }
}

// Fetch single service by slug
export async function getPackageServiceBySlug(
  slug: string,
  locale: string = "uk"
): Promise<ServiceData | null> {
  try {
    const response = await strapiFetch<StrapiPackageServicesResponse>(
      `/api/package-services?filters[slug][$eq]=${slug}&populate=deep&publicationState=live`,
      locale,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    if (response.data.length === 0) {
      return null;
    }

    return transformStrapiPackageService(response.data[0], locale);
  } catch {
    return null;
  }
}
