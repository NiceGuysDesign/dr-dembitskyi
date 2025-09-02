export const defaultLocale = "uk";
export const locales = ["uk", "en"] as const;

export type Locale = (typeof locales)[number];

// When translations are managed in Strapi, keys are dynamic
export type TranslationKey = string;
