import { strapiFetch } from "./client";
import type { RichTextNode } from "./services";

export interface StrapiFaqItem {
  id: number;
  question: string;
  answer: RichTextNode[];
}

export interface StrapiFaqHome {
  id: number;
  documentId: string;
  faqItem: StrapiFaqItem[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface StrapiFaqHomeResponse {
  data: StrapiFaqHome;
  meta: unknown;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: RichTextNode[];
}

export interface FaqHomeData {
  items: FaqItem[];
}

function transformFaqHome(data: StrapiFaqHome): FaqHomeData {
  return {
    items: (data.faqItem ?? []).map((item) => ({
      id: item.id,
      question: item.question,
      answer: item.answer ?? [],
    })),
  };
}

export async function getFaqHome(
  locale: string = "uk",
): Promise<FaqHomeData | null> {
  try {
    const response = await strapiFetch<StrapiFaqHomeResponse>(
      `/api/faq-home?populate=*&publicationState=live`,
      locale,
      {
        next: { revalidate: 60 },
      },
    );

    if (!response.data?.faqItem?.length) {
      return null;
    }

    return transformFaqHome(response.data);
  } catch (error) {
    console.error("Error fetching FAQ home data:", error);
    return null;
  }
}
