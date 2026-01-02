export const defaultLocale = "uk";
export const locales = ["uk", "en"] as const;

export type Locale = (typeof locales)[number];
