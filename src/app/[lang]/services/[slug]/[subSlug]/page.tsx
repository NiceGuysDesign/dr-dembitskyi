import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSubServiceBySlug } from "@/strapi/sub-services";
import { getCases } from "@/strapi/cases";
import SubServicePageClient from "@/components/services/sub-service-page-client";

type PageProps = {
  params: Promise<{ lang: string; slug: string; subSlug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, subSlug } = await params;
  const subService = await getSubServiceBySlug(subSlug, lang);
  if (!subService) {
    return {
      title: "Sub-service Not Found",
      description: "The requested sub-service could not be found.",
    };
  }

  const title = subService.seo?.title || subService.title;
  const description = subService.seo?.description || subService.description;

  return {
    title: `${title} | Dr. Dembitskyi`,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function SubServicePage({ params }: PageProps) {
  const { lang, subSlug } = await params;
  const subService = await getSubServiceBySlug(subSlug, lang);
  const cases = await getCases(lang);

  if (!subService) notFound();

  return (
    <SubServicePageClient lang={lang} subService={subService} casesData={cases} />
  );
}

