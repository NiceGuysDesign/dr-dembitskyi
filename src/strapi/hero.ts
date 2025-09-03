import { strapiFetch } from "./client";
import type { HeroEntity, StrapiSingleResponse } from "../types/strapi";

// Fetch hero section. Pass locale to Strapi; populate all relations.
export async function getHero(
  locale: string
): Promise<StrapiSingleResponse<HeroEntity>> {
  const path = "/api/hero?populate=*";
  return await strapiFetch<StrapiSingleResponse<HeroEntity>>(path, locale, {
    next: { revalidate: 60 },
  });
}
