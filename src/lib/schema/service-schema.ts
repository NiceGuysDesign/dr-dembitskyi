import type { ServiceCategory, ServiceData } from "@/strapi/services";
import {
  areaServed,
  buildPageUrl,
  localeToLanguageTag,
  OG_IMAGE_URL,
} from "./constants";
import { physicianProviderRef } from "./physician";

const catalogCopy = {
  uk: {
    serviceType: "Хірургічні та естетичні медичні послуги",
    description:
      "Хірургічні та діагностичні послуги лікаря Андрія Дембіцького: пластична хірургія, флебологія, ін'єкційна косметологія.",
    catalogName: "Послуги лікаря Андрія Дембіцького",
  },
  en: {
    serviceType: "Surgical and aesthetic medical services",
    description:
      "Surgical and diagnostic services by Dr. Andrii Dembitskyi: plastic surgery, phlebology, and injection cosmetology.",
    catalogName: "Services by Dr. Andrii Dembitskyi",
  },
};

const categoryServiceType: Record<ServiceCategory, { uk: string; en: string }> =
  {
    surgical: {
      uk: "Пластична хірургія",
      en: "Plastic surgery",
    },
    phlebology: {
      uk: "Флебологія",
      en: "Phlebology",
    },
    cosmetology: {
      uk: "Ін'єкційна косметологія",
      en: "Injection cosmetology",
    },
  };

export function buildServicesCatalogJsonLd(
  lang: string,
  services: ServiceData[],
) {
  const locale = lang === "en" ? "en" : "uk";
  const copy = catalogCopy[locale];

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: copy.serviceType,
    url: buildPageUrl(lang, "services"),
    inLanguage: localeToLanguageTag(lang),
    description: copy.description,
    provider: physicianProviderRef(lang),
    areaServed,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: copy.catalogName,
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.seo?.description || service.description,
          url: buildPageUrl(lang, `services/${service.slug}`),
        },
      })),
    },
  };
}

export function buildSingleServiceJsonLd(
  lang: string,
  service: ServiceData,
) {
  const locale = lang === "en" ? "en" : "uk";
  const serviceType =
    categoryServiceType[service.category][locale];

  const image = service.seo?.opengraphImage || OG_IMAGE_URL;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType,
    description: service.seo?.description || service.description,
    url: buildPageUrl(lang, `services/${service.slug}`),
    inLanguage: localeToLanguageTag(lang),
    image,
    provider: physicianProviderRef(lang),
    areaServed,
  };
}

export function buildSubServiceJsonLd(
  lang: string,
  serviceSlug: string,
  subService: {
    slug: string;
    title: string;
    description: string;
    seo?: { description?: string; opengraphImage?: string };
  },
) {
  const image = subService.seo?.opengraphImage || OG_IMAGE_URL;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: subService.title,
    description: subService.seo?.description || subService.description,
    url: buildPageUrl(lang, `services/${serviceSlug}/${subService.slug}`),
    inLanguage: localeToLanguageTag(lang),
    image,
    provider: physicianProviderRef(lang),
    areaServed,
  };
}
