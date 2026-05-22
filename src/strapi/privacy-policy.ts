import { strapiFetch } from "./client";
import type { RichTextNode } from "./services";

export interface StrapiPrivacyPolicy {
  id: number;
  documentId: string;
  privacyText: RichTextNode[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface StrapiPrivacyPolicyResponse {
  data: StrapiPrivacyPolicy;
  meta: unknown;
}

export async function getPrivacyPolicy(
  locale: string = "uk",
): Promise<RichTextNode[] | null> {
  try {
    const response = await strapiFetch<StrapiPrivacyPolicyResponse>(
      `/api/privacy-policy?populate=*&publicationState=live`,
      locale,
      {
        next: { revalidate: 60 },
      },
    );

    if (!response.data?.privacyText?.length) {
      return null;
    }

    return response.data.privacyText;
  } catch (error) {
    console.error("Error fetching privacy policy:", error);
    return null;
  }
}
