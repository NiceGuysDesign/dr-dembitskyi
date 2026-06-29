import { strapiFetch } from "./client";
import type { RichTextNode } from "./services";

export interface StrapiTrustItem {
  id: number;
  title: string;
  description: RichTextNode[] | string;
}

export interface StrapiTrustSection {
  id: number;
  documentId: string;
  trustItem: StrapiTrustItem[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface StrapiTrustSectionResponse {
  data: StrapiTrustSection;
  meta: unknown;
}

export interface TrustItem {
  id: number;
  title: string;
  description: RichTextNode[];
}

export interface TrustSectionData {
  items: TrustItem[];
}

function normalizeDescription(
  description: RichTextNode[] | string | null | undefined,
): RichTextNode[] {
  if (!description) return [];

  if (typeof description === "string") {
    return [
      {
        type: "paragraph",
        children: [{ type: "text", text: description }],
      },
    ];
  }

  if (Array.isArray(description)) {
    return description;
  }

  return [];
}

function transformTrustSection(data: StrapiTrustSection): TrustSectionData {
  return {
    items: (data.trustItem ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      description: normalizeDescription(item.description),
    })),
  };
}

export async function getTrustSection(
  locale: string = "uk",
): Promise<TrustSectionData | null> {
  try {
    const response = await strapiFetch<StrapiTrustSectionResponse>(
      `/api/trust-section?populate=*&publicationState=live`,
      locale,
      {
        next: { revalidate: 60 },
      },
    );

    if (!response.data?.trustItem?.length) {
      return null;
    }

    return transformTrustSection(response.data);
  } catch (error) {
    console.error("Error fetching trust section data:", error);
    return null;
  }
}
