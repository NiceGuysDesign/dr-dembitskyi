import type { BlogPost } from "@/strapi/blog";
import {
  buildPageUrl,
  getPhysicianId,
  localeToLanguageTag,
  OG_IMAGE_URL,
} from "./constants";

const blogCopy = {
  uk: {
    listingName: "Блог | Андрій Дембіцький",
    listingDescription:
      "Медичні статті, огляди процедур та корисні матеріали від пластичного хірурга Андрія Дембіцького.",
    publisherName: "Андрій Дембіцький",
  },
  en: {
    listingName: "Blog | Andrii Dembitskyi",
    listingDescription:
      "Medical articles, procedure reviews, and educational materials by plastic surgeon Andrii Dembitskyi.",
    publisherName: "Andrii Dembitskyi",
  },
};

function parsePublishedDate(value: string): string | undefined {
  const dotted = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (dotted) {
    const [, dd, mm, yyyy] = dotted;
    return `${yyyy}-${mm}-${dd}`;
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return undefined;
}

function publisherNode(lang: string) {
  const locale = lang === "en" ? "en" : "uk";
  return {
    "@type": "Physician",
    "@id": getPhysicianId(),
    name: blogCopy[locale].publisherName,
  };
}

export function buildBlogListingJsonLd(lang: string) {
  const locale = lang === "en" ? "en" : "uk";
  const copy = blogCopy[locale];
  const pageUrl = buildPageUrl(lang, "blog");

  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: copy.listingName,
    description: copy.listingDescription,
    inLanguage: localeToLanguageTag(lang),
    image: OG_IMAGE_URL,
    publisher: publisherNode(lang),
    about: {
      "@type": "MedicalSpecialty",
      name: locale === "en" ? "Plastic surgery" : "Пластична хірургія",
    },
  };
}

export function buildBlogPostJsonLd(lang: string, post: BlogPost) {
  const pageUrl = buildPageUrl(lang, `blog/${post.slug}`);
  const datePublished = parsePublishedDate(post.publishedAt);
  const image = post.seo?.opengraphImage || post.image || OG_IMAGE_URL;

  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: post.seo?.title || post.title,
    description: post.seo?.description || post.description,
    inLanguage: localeToLanguageTag(lang),
    image,
    ...(datePublished ? { datePublished } : {}),
    publisher: publisherNode(lang),
    mainEntity: {
      "@type": "Article",
      headline: post.title,
      description: post.seo?.description || post.description,
      image,
      ...(datePublished ? { datePublished } : {}),
      author: publisherNode(lang),
    },
  };
}
