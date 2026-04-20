import { NextResponse } from "next/server";
import { locales, type Locale } from "@/i18n/config";
import { resolveServiceSlugForLocale } from "@/strapi/services";
import { resolveSubServiceSlugForLocale } from "@/strapi/sub-services";
import { resolvePackageServiceSlugForLocale } from "@/strapi/package-service";
import { resolveCaseSlugForLocale } from "@/strapi/cases";
import { resolveBlogSlugForLocale } from "@/strapi/blog";

type ResolveRequest = {
  pathname: string;
  targetLocale: Locale;
};

function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

function withLocale(pathname: string, locale: Locale) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return `/${locale}`;
  if (isLocale(parts[0])) {
    parts[0] = locale;
  } else {
    parts.unshift(locale);
  }
  return `/${parts.join("/")}`;
}

export async function POST(req: Request) {
  let body: ResolveRequest | null = null;
  try {
    body = (await req.json()) as ResolveRequest;
  } catch {
    return NextResponse.json(
      { pathname: null, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const pathname = body?.pathname;
  const targetLocale = body?.targetLocale;

  if (!pathname || typeof pathname !== "string") {
    return NextResponse.json(
      { pathname: null, error: "pathname is required" },
      { status: 400 },
    );
  }
  if (!targetLocale || !isLocale(targetLocale)) {
    return NextResponse.json(
      { pathname: null, error: "targetLocale is invalid" },
      { status: 400 },
    );
  }

  const parts = pathname.split("/").filter(Boolean);
  const hasLocale = parts[0] && isLocale(parts[0]);
  const rest = hasLocale ? parts.slice(1) : parts;
  const section = rest[0] ?? "";

  // Default behavior: just replace/insert locale segment.
  let resolvedPathname = withLocale(pathname, targetLocale);

  try {
    if (section === "services" && rest.length >= 2) {
      const serviceSlug = rest[1];
      const serviceResolved = await resolveServiceSlugForLocale(
        serviceSlug,
        targetLocale,
      );
      if (serviceResolved.kind === "found") {
        const nextParts = [targetLocale, "services", serviceResolved.slug];

        // /services/[slug]/[subSlug]
        if (rest.length >= 3) {
          const subSlug = rest[2];
          const subResolved = await resolveSubServiceSlugForLocale(
            subSlug,
            targetLocale,
          );
          if (subResolved.kind === "found") {
            nextParts.push(subResolved.slug);
          } else {
            nextParts.push(subSlug);
          }
        }

        resolvedPathname = `/${nextParts.join("/")}`;
      }
    }

    if (section === "package-service" && rest.length >= 2) {
      const slug = rest[1];
      const resolved = await resolvePackageServiceSlugForLocale(slug, targetLocale);
      if (resolved.kind === "found") {
        resolvedPathname = `/${targetLocale}/package-service/${resolved.slug}`;
      }
    }

    if (section === "cases" && rest.length >= 2) {
      const slug = rest[1];
      const resolved = await resolveCaseSlugForLocale(slug, targetLocale);
      if (resolved.kind === "found") {
        resolvedPathname = `/${targetLocale}/cases/${resolved.slug}`;
      }
    }

    if (section === "blog" && rest.length >= 2) {
      const slug = rest[1];
      const resolved = await resolveBlogSlugForLocale(slug, targetLocale);
      if (resolved.kind === "found") {
        resolvedPathname = `/${targetLocale}/blog/${resolved.slug}`;
      }
    }
  } catch (error) {
    // On any failure, fall back to simple locale swap.
    console.error("i18n resolve error", error);
  }

  return NextResponse.json({ pathname: resolvedPathname });
}

