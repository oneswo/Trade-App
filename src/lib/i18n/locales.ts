export const SUPPORTED_LOCALES = ["en", "zh"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "en";

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: "English",
  zh: "中文",
};

export const LOCALE_FLAGS: Record<SupportedLocale, string> = {
  en: "🇬🇧",
  zh: "🇨🇳",
};

export function isSupportedLocale(value: string): value is SupportedLocale {
  return SUPPORTED_LOCALES.includes(value as SupportedLocale);
}
