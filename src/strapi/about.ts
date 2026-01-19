import { strapiFetch } from "./client";

// Strapi types
export interface StrapiImage {
  id: number;
  documentId?: string;
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  width: number;
  height: number;
  formats?: {
    thumbnail?: {
      ext: string;
      url: string;
      hash: string;
      mime: string;
      name: string;
      path: string | null;
      size: number;
      width: number;
      height: number;
      sizeInBytes: number;
    };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string | null;
  provider?: string;
  provider_metadata?: unknown;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface StrapiEducation {
  id: number;
  title: string;
  city: string;
  country: string;
  year: string;
}

export interface StrapiAbout {
  id: number;
  documentId: string;
  name: string;
  position: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  image: StrapiImage;
  education: StrapiEducation[];
  localizations?: Array<{
    id: number;
    documentId: string;
    name: string;
    position: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
  }>;
}

export interface StrapiAboutResponse {
  data: StrapiAbout;
  meta: unknown;
}

// Transformed types
export interface Education {
  id: string;
  title: string;
  city: string;
  country: string;
  year: string;
  location: string; // Combined city, country, year
}

export interface AboutData {
  name: string;
  position: string;
  description: string;
  image: string;
  education: Education[];
}

// Helper function to get image URL
function getImageUrl(image: StrapiImage, baseUrl: string): string {
  if (image.url.startsWith("http")) {
    return image.url;
  }
  return `${baseUrl}${image.url}`;
}

// Transform Strapi about data to our format
function transformStrapiAbout(strapiAbout: StrapiAbout): AboutData {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  return {
    name: strapiAbout.name,
    position: strapiAbout.position,
    description: strapiAbout.description,
    image: getImageUrl(strapiAbout.image, baseUrl),
    education: strapiAbout.education.map((edu) => {
      // Filter out null/undefined values when building location string
      const locationParts = [
        edu.city,
        edu.country,
        edu.year,
      ].filter((part) => part != null && part !== "");

      return {
        id: edu.id.toString(),
        title: edu.title,
        city: edu.city,
        country: edu.country,
        year: edu.year,
        location: locationParts.length > 0 ? locationParts.join(", ") : "",
      };
    }),
  };
}

// Fetch about data from Strapi
export async function getAbout(
  locale: string = "uk"
): Promise<AboutData | null> {
  try {
    const response = await strapiFetch<StrapiAboutResponse>(
      `/api/about?populate=*&publicationState=live`,
      locale,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.data) {
      return null;
    }

    // Strapi automatically returns localized data when locale is specified
    return transformStrapiAbout(response.data);
  } catch (error) {
    console.error("Error fetching about data:", error);
    return null;
  }
}
