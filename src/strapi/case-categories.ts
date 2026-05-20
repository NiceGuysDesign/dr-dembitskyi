import { strapiFetch } from "./client";

export interface CaseCategory {
  documentId: string;
  name: string;
}

interface StrapiCaseCategory {
  id: number;
  documentId: string;
  name: string;
  locale: string;
  localizations?: Array<{
    id: number;
    documentId: string;
    name: string;
    locale: string;
  }>;
}

interface StrapiCaseCategoriesResponse {
  data: StrapiCaseCategory[];
}

/**
 * Fetches localized case categories from Strapi (`cases-categories`).
 * Uses `documentId` as a stable filter key across locales.
 */
export async function getCaseCategories(
  locale: string = "uk",
): Promise<CaseCategory[]> {
  try {
    const response = await strapiFetch<StrapiCaseCategoriesResponse>(
      "/api/cases-categories?populate=*&publicationState=live&sort=name:asc",
      locale,
      { next: { revalidate: 60 } },
    );

    return response.data.map((category) => ({
      documentId: category.documentId,
      name: category.name,
    }));
  } catch {
    return [];
  }
}
