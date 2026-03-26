import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  getPackageServiceBySlug,
  resolvePackageServiceSlugForLocale,
} from "@/strapi/package-service";
import { getCases } from "@/strapi/cases";
import ServicePageClient from "@/components/services/service-page-client";
import { ServiceData } from "@/strapi/services";

type PackageServicePageProps = {
  params: Promise<{ slug: string; lang: string }>;
};

export async function generateMetadata({
  params,
}: PackageServicePageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const resolved = await resolvePackageServiceSlugForLocale(slug, lang);
  const effectiveSlug =
    resolved.kind === "found" || resolved.kind === "fallback"
      ? resolved.slug
      : slug;

  const packageService = await getPackageServiceBySlug(effectiveSlug, lang);

  if (!packageService) {
    return {
      title: "Package Service Not Found",
      description: "The requested package service could not be found.",
    };
  }

  const title = packageService.seo?.title || packageService.title;
  const description =
    packageService.seo?.description || packageService.description;

  return {
    title: `${title} | Dr. Dembitskyi`,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function PackageServicePage({
  params,
}: PackageServicePageProps) {
  const { slug, lang } = await params;

  const cases = await getCases(lang);

  const resolved = await resolvePackageServiceSlugForLocale(slug, lang);

  if (resolved.kind === "fallback") {
    redirect(`/${resolved.locale}/package-service/${resolved.slug}`);
  }

  if (resolved.kind === "found" && resolved.slug !== slug) {
    redirect(`/${lang}/package-service/${resolved.slug}`);
  }

  const packageService =
    resolved.kind === "found"
      ? await getPackageServiceBySlug(resolved.slug, lang)
      : null;

  if (!packageService) notFound();

  // Type assertion для сумісності типів (структури даних ідентичні)
  const serviceData = packageService as ServiceData;

  return (
    <ServicePageClient
      service={serviceData}
      casesData={cases}
      showCases={false}
    />
  );
}
