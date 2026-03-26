import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getServiceBySlug, resolveServiceSlugForLocale } from "@/strapi/services";
import { getCases } from "@/strapi/cases";
import ServicePageClient from "@/components/services/service-page-client";

type ServicesPageProps = {
  params: Promise<{ slug: string; lang: string }>;
};

export async function generateMetadata({
  params,
}: ServicesPageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const resolved = await resolveServiceSlugForLocale(slug, lang);
  const effectiveSlug =
    resolved.kind === "found" || resolved.kind === "fallback"
      ? resolved.slug
      : slug;

  const service = await getServiceBySlug(effectiveSlug, lang);

  if (!service) {
    return {
      title: "Service Not Found",
      description: "The requested service could not be found.",
    };
  }

  const title = service.seo?.title || service.title;
  const description = service.seo?.description || service.description;

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

export default async function ServicePage({ params }: ServicesPageProps) {
  const { slug, lang } = await params;

  const resolved = await resolveServiceSlugForLocale(slug, lang);

  if (resolved.kind === "fallback") {
    redirect(`/${resolved.locale}/services/${resolved.slug}`);
  }

  if (resolved.kind === "found" && resolved.slug !== slug) {
    redirect(`/${lang}/services/${resolved.slug}`);
  }

  const service =
    resolved.kind === "found" ? await getServiceBySlug(resolved.slug, lang) : null;

  if (!service) {
    notFound();
  }

  const cases = await getCases(lang);

  return <ServicePageClient service={service} casesData={cases} />;
}