import { NextResponse } from "next/server";
import { type Locale } from "@/i18n/config";
import { getSegmentsFromPathname, localePath } from "@/i18n/routing";
import { resolveServiceSlugForLocale } from "@/strapi/services";
import { resolveSubServiceSlugForLocale } from "@/strapi/sub-services";
import { resolvePackageServiceSlugForLocale } from "@/strapi/package-service";
import { resolveCaseSlugForLocale } from "@/strapi/cases";
import { resolveBlogSlugForLocale } from "@/strapi/blog";

type ResolveRequest = {
  pathname: string;
  targetLocale: Locale;
};

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
  if (!targetLocale || (targetLocale !== "uk" && targetLocale !== "en")) {
    return NextResponse.json(
      { pathname: null, error: "targetLocale is invalid" },
      { status: 400 },
    );
  }

  const rest = getSegmentsFromPathname(pathname);
  const section = rest[0] ?? "";

  let resolvedPathname = localePath(targetLocale, ...rest);

  try {
    if (section === "services" && rest.length >= 2) {
      const serviceSlug = rest[1];
      const serviceResolved = await resolveServiceSlugForLocale(
        serviceSlug,
        targetLocale,
      );
      if (serviceResolved.kind === "found") {
        const pathSegments = ["services", serviceResolved.slug];

        if (rest.length >= 3) {
          const subSlug = rest[2];
          const subResolved = await resolveSubServiceSlugForLocale(
            subSlug,
            targetLocale,
          );
          if (subResolved.kind === "found") {
            pathSegments.push(subResolved.slug);
          } else {
            pathSegments.push(subSlug);
          }
        }

        resolvedPathname = localePath(targetLocale, ...pathSegments);
      }
    }

    if (section === "package-service" && rest.length >= 2) {
      const slug = rest[1];
      const resolved = await resolvePackageServiceSlugForLocale(
        slug,
        targetLocale,
      );
      if (resolved.kind === "found") {
        resolvedPathname = localePath(
          targetLocale,
          "package-service",
          resolved.slug,
        );
      }
    }

    if (section === "cases" && rest.length >= 2) {
      const slug = rest[1];
      const resolved = await resolveCaseSlugForLocale(slug, targetLocale);
      if (resolved.kind === "found") {
        resolvedPathname = localePath(targetLocale, "cases", resolved.slug);
      }
    }

    if (section === "blog" && rest.length >= 2) {
      const slug = rest[1];
      const resolved = await resolveBlogSlugForLocale(slug, targetLocale);
      if (resolved.kind === "found") {
        resolvedPathname = localePath(targetLocale, "blog", resolved.slug);
      }
    }
  } catch (error) {
    console.error("i18n resolve error", error);
  }

  return NextResponse.json({ pathname: resolvedPathname });
}
