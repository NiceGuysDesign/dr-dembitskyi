import {
  areaServed,
  getPhysicianId,
  localeToLanguageTag,
  OG_IMAGE_URL,
  PHONE_PRIMARY,
  postalAddress,
  SOCIAL_LINKS,
  buildPageUrl,
} from "./constants";

const physicianCopy = {
  uk: {
    name: "Андрій Дембіцький",
    description:
      "Пластичний хірург і флеболог у Києві. Пластична хірургія, флебологія, естетична медицина та малоінвазивні методи лікування.",
    knowsAbout: [
      "Пластична хірургія",
      "Флебологія",
      "Варикозна хвороба",
      "Естетична хірургія",
      "Малоінвазивна хірургія",
      "Ультразвукова діагностика",
    ],
    credentialUniversity:
      "Вінницький національний медичний університет ім. М.І. Пирогова",
  },
  en: {
    name: "Andrii Dembitskyi",
    description:
      "Plastic surgeon and phlebologist in Kyiv. Plastic surgery, phlebology, aesthetic medicine, and minimally invasive treatments.",
    knowsAbout: [
      "Plastic surgery",
      "Phlebology",
      "Varicose veins",
      "Aesthetic surgery",
      "Minimally invasive surgery",
      "Ultrasound diagnostics",
    ],
    credentialUniversity:
      "Vinnytsia National Pirogov Medical University",
  },
};

export function buildPhysicianNode(lang: string) {
  const locale = lang === "en" ? "en" : "uk";
  const copy = physicianCopy[locale];

  return {
    "@type": "Physician",
    "@id": getPhysicianId(),
    name: copy.name,
    url: buildPageUrl(lang),
    image: OG_IMAGE_URL,
    description: copy.description,
    inLanguage: localeToLanguageTag(lang),
    medicalSpecialty: [
      "https://schema.org/PlasticSurgery",
      "https://schema.org/Cardiovascular",
    ],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      recognizedBy: {
        "@type": "CollegeOrUniversity",
        name: copy.credentialUniversity,
      },
    },
    knowsAbout: copy.knowsAbout,
    address: postalAddress,
    areaServed,
    telephone: PHONE_PRIMARY,
    sameAs: [...SOCIAL_LINKS],
  };
}

export function physicianProviderRef(lang: string) {
  const locale = lang === "en" ? "en" : "uk";
  return {
    "@type": "Physician",
    "@id": getPhysicianId(),
    name: physicianCopy[locale].name,
  };
}
