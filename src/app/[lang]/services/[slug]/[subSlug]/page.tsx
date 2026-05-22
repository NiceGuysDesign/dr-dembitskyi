import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/schema/json-ld";
import { buildSubServiceJsonLd } from "@/lib/schema/service-schema";
import { type Locale } from "@/i18n/config";
import { localePath } from "@/i18n/routing";
import { withSeoAlternates } from "@/lib/seo";
import { getSubServiceBySlug } from "@/strapi/sub-services";
import { getCases } from "@/strapi/cases";
import SubServicePageClient from "@/components/services/sub-service-page-client";

type PageProps = {
  params: Promise<{ lang: string; slug: string; subSlug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug, subSlug } = await params;
  const subService = await getSubServiceBySlug(subSlug, lang);
  if (!subService) {
    return {
      title: "Sub-service Not Found",
      description: "The requested sub-service could not be found.",
    };
  }

  const title = subService.seo?.title || subService.title;
  const description = subService.seo?.description || subService.description;

  const locale = (lang === "en" ? "en" : "uk") as Locale;
  const pathname =
    (await headers()).get("x-pathname") ??
    localePath(locale, "services", slug, subSlug);

  return withSeoAlternates(pathname, {
    title: `${title} | Dr. Dembitskyi`,
    description,
    openGraph: { title, description, type: "website" },
  });
}

export default async function SubServicePage({ params }: PageProps) {
  const { lang, slug, subSlug } = await params;
  const subService = await getSubServiceBySlug(subSlug, lang);
  const cases = await getCases(lang);

  if (!subService) notFound();

  return (
    <>
      <JsonLd data={buildSubServiceJsonLd(lang, slug, subService)} />
      <SubServicePageClient lang={lang} subService={subService} casesData={cases} />
    </>
  );
}

