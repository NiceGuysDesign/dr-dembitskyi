import {
  areaServed,
  buildPageUrl,
  getMedicalClinicId,
  localeToLanguageTag,
  OG_IMAGE_URL,
  PHONE_PRIMARY,
  postalAddress,
  SOCIAL_LINKS,
} from "./constants";
import { buildPhysicianNode } from "./physician";

const clinicCopy = {
  uk: {
    name: "Dr. Dembitskyi — клініка пластичної хірургії",
    description:
      "Пластичний хірург і флеболог у Києві. Пластична хірургія, флебологія, ін'єкційна косметологія та комплексний супровід пацієнтів.",
  },
  en: {
    name: "Dr. Dembitskyi — plastic surgery clinic",
    description:
      "Plastic surgeon and phlebologist in Kyiv. Plastic surgery, phlebology, injection cosmetology, and comprehensive patient care.",
  },
};

export function buildMedicalClinicJsonLd(lang: string) {
  const locale = lang === "en" ? "en" : "uk";
  const copy = clinicCopy[locale];
  const pageUrl = buildPageUrl(lang);
  const physician = buildPhysicianNode(lang);

  const medicalClinic = {
    "@type": "MedicalClinic",
    "@id": getMedicalClinicId(),
    name: copy.name,
    url: pageUrl,
    image: OG_IMAGE_URL,
    description: copy.description,
    address: postalAddress,
    areaServed,
    telephone: PHONE_PRIMARY,
    sameAs: [...SOCIAL_LINKS],
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: copy.name,
    description: copy.description,
    inLanguage: localeToLanguageTag(lang),
    mainEntity: { "@id": getMedicalClinicId() },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [webPage, physician, medicalClinic],
  };
}
