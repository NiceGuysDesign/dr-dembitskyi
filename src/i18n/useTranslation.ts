import { useTranslation as useI18nTranslation } from "react-i18next";
import { Locale } from "./config";

export function useTranslation() {
  const { t, i18n } = useI18nTranslation();
  const currentLocale = i18n.language as Locale;

  return { t, currentLocale };
}
