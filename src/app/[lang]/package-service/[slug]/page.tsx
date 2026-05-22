import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { type Locale } from "@/i18n/config";
import { localePath } from "@/i18n/routing";
import { withSeoAlternates } from "@/lib/seo";
import {
  getPackageServiceBySlug,
  resolvePackageServiceSlugForLocale,
} from "@/strapi/package-service";
import PackageServicePageClient from "@/components/services/package-service-page-client";

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

  const locale = (lang === "en" ? "en" : "uk") as Locale;
  const pathname =
    (await headers()).get("x-pathname") ??
    localePath(locale, "package-service", effectiveSlug);

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

export default async function PackageServicePage({
  params,
}: PackageServicePageProps) {
  const { slug, lang } = await params;

  const resolved = await resolvePackageServiceSlugForLocale(slug, lang);

  if (resolved.kind === "fallback") {
    redirect(
      localePath(resolved.locale as Locale, "package-service", resolved.slug),
    );
  }

  if (resolved.kind === "found" && resolved.slug !== slug) {
    redirect(
      localePath(lang as Locale, "package-service", resolved.slug),
    );
  }

  const packageService =
    resolved.kind === "found"
      ? await getPackageServiceBySlug(resolved.slug, lang)
      : null;

  if (!packageService) notFound();

  return <PackageServicePageClient service={packageService} />;
}
