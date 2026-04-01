import { getPageContentRepo } from "@/lib/data/repository";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/i18n/locales";

export const VALID_PAGE_IDS = [
  "home",
  "products",
  "product-detail",
  "services",
  "about",
  "insights",
  "contact",
] as const;

export type ValidPageId = (typeof VALID_PAGE_IDS)[number];

export function isSharedMediaField(fieldName: string) {
  return /(?:^|\.)(?:bgImage|image|photo|posterUrl|videoUrl)$/.test(fieldName);
}

export function pickSharedMediaFields(data: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(data).filter(
      ([key, value]) => isSharedMediaField(key) && typeof value === "string"
    )
  );
}

export async function getPageContentData(
  pageId: ValidPageId,
  locale: SupportedLocale
) {
  const repo = getPageContentRepo();
  const currentRecord = await repo.get(pageId, locale);
  const currentData = currentRecord?.data ?? {};
  const mergedData = { ...currentData };

  for (const otherLocale of SUPPORTED_LOCALES) {
    if (otherLocale === locale) continue;
    const otherRecord = await repo.get(pageId, otherLocale);
    const otherData = otherRecord?.data ?? {};
    for (const [key, value] of Object.entries(otherData)) {
      if (isSharedMediaField(key) && !mergedData[key] && value) {
        mergedData[key] = value;
      }
    }
  }

  return mergedData;
}

export async function syncSharedMediaFieldsToAllLocales(
  pageId: ValidPageId,
  sourceLocale: SupportedLocale,
  sharedMediaFields: Record<string, string>
) {
  const repo = getPageContentRepo();

  await Promise.all(
    SUPPORTED_LOCALES.filter((targetLocale) => targetLocale !== sourceLocale).map(
      async (targetLocale) => {
        const existing = await repo.get(pageId, targetLocale);
        await repo.upsert(pageId, targetLocale, {
          ...(existing?.data ?? {}),
          ...sharedMediaFields,
        });
      }
    )
  );
}
