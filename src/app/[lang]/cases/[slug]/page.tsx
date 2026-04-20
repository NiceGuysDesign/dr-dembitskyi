import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  getCaseBySlug,
  getCases,
  resolveCaseSlugForLocale,
} from "@/strapi/cases";
import CasePostClient from "@/components/cases/case-post-client";
import CasesList from "@/components/cases/cases-list";
import CTASection2 from "@/components/services/cta-section-2";

type CasePageProps = {
  params: Promise<{ slug: string; lang: string }>;
};

export async function generateMetadata({
  params,
}: CasePageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const resolved = await resolveCaseSlugForLocale(slug, lang);
  const effectiveSlug =
    resolved.kind === "found" || resolved.kind === "fallback"
      ? resolved.slug
      : slug;
  const caseItem = await getCaseBySlug(effectiveSlug, lang);

  if (!caseItem) {
    return {
      title: "Case Not Found",
      description: "The requested case could not be found.",
    };
  }

  const title = caseItem.seo?.title || caseItem.title;
  const description = caseItem.seo?.description || caseItem.description || "";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  return {
    title: `${title} | Dr. Dembitskyi`,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/cases/${slug}`,
      siteName: "Dr. Dembitskyi",
      images: caseItem.seo?.opengraphImage
        ? [
            {
              url: caseItem.seo.opengraphImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [
            {
              url: caseItem.image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
      locale: lang === "uk" ? "uk_UA" : "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: caseItem.seo?.opengraphImage
        ? [caseItem.seo.opengraphImage]
        : [caseItem.image],
    },
  };
}

export default async function CasePage({ params }: CasePageProps) {
  const { slug, lang } = await params;
  const resolved = await resolveCaseSlugForLocale(slug, lang);

  if (resolved.kind === "fallback") {
    redirect(`/${resolved.locale}/cases/${resolved.slug}`);
  }

  if (resolved.kind === "found" && resolved.slug !== slug) {
    redirect(`/${lang}/cases/${resolved.slug}`);
  }

  const caseItem =
    resolved.kind === "found" ? await getCaseBySlug(resolved.slug, lang) : null;

  if (!caseItem) {
    notFound();
  }

  const otherCasesTitle = lang === "uk" ? "Інші кейси" : "Other cases";

  // Get other cases (excluding current)
  const allCases = await getCases(lang);
  const otherCases = allCases
    .filter((c) => c.slug !== caseItem.slug)
    .slice(0, 3);

  return (
    <main className="relative w-full min-h-screen">
      <div className="relative z-10 pt-[110px] md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-24">
        <div className="px-3 md:px-5">
          {/* Case Title */}
          <h1 className="font-manrope font-bold text-[11vw] md:text-[48px] lg:text-[92px] leading-[100%] tracking-[-0.05em] text-[var(--color-text-heading)] mb-6 md:mb-8">
            {caseItem.title}
          </h1>

          {/* Case Meta and Content */}
          <CasePostClient caseItem={caseItem} />

          {/* Other Cases Section */}
          {otherCases.length > 0 && (
            <div className="mt-12 md:mt-16 lg:mt-24">
              <h4 className="font-manrope font-bold text-[11vw] md:text-[48px] lg:text-[92px] leading-[100%] tracking-[-0.05em] text-[var(--color-text-heading)] mb-6 md:mb-8">
                {otherCasesTitle}
              </h4>
              <CasesList cases={otherCases} activeFilter="all" lang={lang} />
            </div>
          )}
        </div>
      </div>
      {/* CTA Section */}
      <CTASection2 />
    </main>
  );
}
