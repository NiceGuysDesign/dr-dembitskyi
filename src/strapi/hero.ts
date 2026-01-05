import { strapiFetch } from "./client";
import { StrapiImage } from "./about";

// Strapi types
export interface StrapiHero {
  id: number;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  image: StrapiImage;
  video?: string | null;
  localizations?: Array<{
    id: number;
    documentId: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
  }>;
}

export interface StrapiHeroResponse {
  data: StrapiHero;
  meta: unknown;
}

// Transformed types
export interface HeroData {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

// Helper function to get image URL
function getImageUrl(image: StrapiImage, baseUrl: string): string {
  if (image.url.startsWith("http")) {
    return image.url;
  }
  return `${baseUrl}${image.url}`;
}

// Transform Strapi hero data to our format
function transformStrapiHero(strapiHero: StrapiHero): HeroData {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  return {
    title: strapiHero.title,
    description: strapiHero.description,
    image: getImageUrl(strapiHero.image, baseUrl),
    imageAlt: strapiHero.image.alternativeText || strapiHero.title,
  };
}

// Fetch hero data from Strapi
export async function getHero(locale: string = "uk"): Promise<HeroData | null> {
  try {
    const response = await strapiFetch<StrapiHeroResponse>(
      `/api/hero?populate=*&publicationState=live`,
      locale,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.data) {
      return null;
    }

    // Strapi automatically returns localized data when locale is specified
    return transformStrapiHero(response.data);
  } catch (error) {
    console.error("Error fetching hero data:", error);
    return null;
  }
}
