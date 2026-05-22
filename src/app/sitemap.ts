import { MetadataRoute } from "next";
import { locales, type Locale } from "@/i18n/config";
import { localePath } from "@/i18n/routing";
import { getBaseUrl } from "@/lib/site-url";
import { getServices } from "@/strapi/services";
import { getPackageServices } from "@/strapi/package-service";
import { getCases } from "@/strapi/cases";
import { getBlogPosts } from "@/strapi/blog";

function parseSitemapDate(value?: string): Date {
  if (!value) return new Date();

  const direct = new Date(value);
  if (!Number.isNaN(direct.getTime())) return direct;

  const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (match) {
    const [, dd, mm, yyyy] = match;
    const normalized = new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`);
    if (!Number.isNaN(normalized.getTime())) return normalized;
  }

  return new Date();
}

function sitemapUrl(locale: Locale, ...segments: string[]): string {
  const baseUrl = getBaseUrl();
  const path = localePath(locale, ...segments);
  if (path === "/") return `${baseUrl}/`;
  return `${baseUrl}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [];

  const hubRoutesUk = [
    { path: "services", priority: 0.9, changeFrequency: "daily" as const },
    { path: "cases", priority: 0.9, changeFrequency: "daily" as const },
    { path: "blog", priority: 0.9, changeFrequency: "daily" as const },
    { path: "about", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "contacts", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "privacy", priority: 0.5, changeFrequency: "monthly" as const },
  ];

  const hubRoutesEn = [
    { path: "services", priority: 0.8, changeFrequency: "daily" as const },
    { path: "cases", priority: 0.8, changeFrequency: "daily" as const },
    { path: "blog", priority: 0.8, changeFrequency: "daily" as const },
    { path: "about", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "contacts", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "privacy", priority: 0.5, changeFrequency: "monthly" as const },
  ];

  for (const locale of locales) {
    const isUk = locale === "uk";
    staticPages.push({
      url: sitemapUrl(locale),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: isUk ? 1.0 : 0.9,
    });

    const hubRoutes = isUk ? hubRoutesUk : hubRoutesEn;
    for (const route of hubRoutes) {
      staticPages.push({
        url: sitemapUrl(locale, route.path),
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }
  }

  const servicePages: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    try {
      const services = await getServices(locale);
      for (const service of services) {
        servicePages.push({
          url: sitemapUrl(locale, "services", service.slug),
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: locale === "uk" ? 0.8 : 0.7,
        });
      }
    } catch (error) {
      console.error(`Error fetching services for locale ${locale}:`, error);
    }
  }

  const packageServicePages: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    try {
      const packageServices = await getPackageServices(locale);
      for (const service of packageServices) {
        packageServicePages.push({
          url: sitemapUrl(locale, "package-service", service.slug),
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: locale === "uk" ? 0.8 : 0.7,
        });
      }
    } catch (error) {
      console.error(
        `Error fetching package services for locale ${locale}:`,
        error,
      );
    }
  }

  const casePages: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    try {
      const cases = await getCases(locale);
      const uniqueCases = cases.filter((c) => !c.slug.match(/-\d+$/));
      for (const caseItem of uniqueCases) {
        casePages.push({
          url: sitemapUrl(locale, "cases", caseItem.slug),
          lastModified: parseSitemapDate(caseItem.publishedAt),
          changeFrequency: "weekly",
          priority: locale === "uk" ? 0.7 : 0.6,
        });
      }
    } catch (error) {
      console.error(`Error fetching cases for locale ${locale}:`, error);
    }
  }

  const blogPages: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    try {
      const blogPosts = await getBlogPosts(locale);
      for (const post of blogPosts) {
        blogPages.push({
          url: sitemapUrl(locale, "blog", post.slug),
          lastModified: parseSitemapDate(post.publishedAt),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    } catch (error) {
      console.error(`Error fetching blog posts for locale ${locale}:`, error);
    }
  }

  return [
    ...staticPages,
    ...servicePages,
    ...packageServicePages,
    ...casePages,
    ...blogPages,
  ];
}
