import {
  buildPageUrl,
  getPhysicianId,
  localeToLanguageTag,
  PHONE_PRIMARY,
  PHONE_SECONDARY,
  postalAddress,
  SOCIAL_LINKS,
} from "./constants";

const contactCopy = {
  uk: {
    name: "Контакти | Андрій Дембіцький",
    physicianName: "Андрій Дембіцький",
  },
  en: {
    name: "Contacts | Andrii Dembitskyi",
    physicianName: "Andrii Dembitskyi",
  },
};

export function buildContactPageJsonLd(lang: string) {
  const locale = lang === "en" ? "en" : "uk";
  const copy = contactCopy[locale];
  const pageUrl = buildPageUrl(lang, "contacts");

  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${pageUrl}#contactpage`,
    url: pageUrl,
    name: copy.name,
    inLanguage: localeToLanguageTag(lang),
    mainEntity: {
      "@type": "Physician",
      "@id": getPhysicianId(),
      name: copy.physicianName,
      url: buildPageUrl(lang),
      telephone: [PHONE_PRIMARY, PHONE_SECONDARY],
      address: postalAddress,
      sameAs: [...SOCIAL_LINKS],
    },
  };
}
