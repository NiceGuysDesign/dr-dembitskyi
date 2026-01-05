import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getPackageServiceBySlug } from "@/strapi/package-service";
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
  const packageService = await getPackageServiceBySlug(slug, lang);

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

  const packageService = await getPackageServiceBySlug(slug, lang);
  const cases = await getCases(lang);

  if (!packageService) {
    notFound();
  }

  // Перевіряємо, чи поточний slug відповідає локалізації для поточної мови
  // Якщо ні - перенаправляємо на правильний slug
  if (packageService.localizations && packageService.localizations.length > 0) {
    const currentLocalization = packageService.localizations.find(
      (loc) => loc.locale === lang
    );
    // Якщо поточний slug не відповідає локалізації для поточної мови
    if (currentLocalization && currentLocalization.slug !== slug) {
      redirect(`/${lang}/package-service/${currentLocalization.slug}`);
    }
  }

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
