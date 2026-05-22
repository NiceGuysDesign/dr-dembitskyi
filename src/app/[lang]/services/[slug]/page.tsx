import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/strapi/services";
import { getCases } from "@/strapi/cases";
import ServicePageClient from "@/components/services/service-page-client";
import { JsonLd } from "@/components/schema/json-ld";
import { buildSingleServiceJsonLd } from "@/lib/schema/service-schema";
import { type Locale } from "@/i18n/config";
import { localePath } from "@/i18n/routing";
import { withSeoAlternates } from "@/lib/seo";

type ServicesPageProps = {
  params: Promise<{ slug: string; lang: string }>;
};

export async function generateMetadata({
  params,
}: ServicesPageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const service = await getServiceBySlug(slug, lang);

  if (!service) {
    return {
      title: "Service Not Found",
      description: "The requested service could not be found.",
    };
  }

  const title = service.seo?.title || service.title;
  const description = service.seo?.description || service.description;

  const locale = (lang === "en" ? "en" : "uk") as Locale;
  const pathname =
    (await headers()).get("x-pathname") ??
    localePath(locale, "services", slug);

  return withSeoAlternates(pathname, {
    title: `${title} | Dr. Dembitskyi`,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  });
}

export default async function ServicePage({ params }: ServicesPageProps) {
  const { slug, lang } = await params;
  const service = await getServiceBySlug(slug, lang);

  if (!service) {
    notFound();
  }

  const cases = await getCases(lang);

  return (
    <>
      <JsonLd data={buildSingleServiceJsonLd(lang, service)} />
      <ServicePageClient lang={lang} service={service} casesData={cases} />
    </>
  );
}