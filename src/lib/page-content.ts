import { getPageContentRepo } from "@/lib/data/repository";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/i18n/locales";

export const VALID_PAGE_IDS = [
  "home",
  "products",
  "product-detail",
  "services",
  "about",
  "contact",
] as const;

export type ValidPageId = (typeof VALID_PAGE_IDS)[number];

const OBSOLETE_PAGE_CONTENT_PREFIXES: Partial<Record<ValidPageId, string[]>> = {
  home: ["cta.", "hero.tag", "hero.subtitle", "hero.btn1", "hero.btn2", "hero.posterUrl", "hero.videoUrl", "depth."],
  /** 与前台 ProductsPageClient 对齐后移除的字段（曾存在于旧版 CMS） */
  products: [
    "hero.",
    "filter.badge",
    "filter.resultsPrefix",
    "filter.panelTitle",
    "filter.openBtn",
    "filter.mobileTitle",
    "filter.mobileSectionTitle",
    "filter.executeBtn",
    "filter.resetBtn",
    "filter.searchPlaceholder",
    "filter.sortLabel",
    "filter.sortNewest",
    "filter.sortHours",
    "filter.sortBrand",
    "filter.resultsSuffix",
    "card.hoursLabel",
    "card.weightLabel",
    "card.engineLabel",
    "card.locationLabel",
  ],
  /** 与前台产品详情页对齐：移除旧交付卡片与已固定化的状态/后缀文案 */
  "product-detail": [
    "delivery.",
    "gallery.yearSuffix",
    "gallery.stockPrefix",
    "gallery.stockSuffix",
    "page.",
  ],
  /** 与前台 AboutPageClient 对齐：移除未使用的 Hero 字段 */
  about: ["cta.", "hero."],
  /** 与前台 ServicesPageClient 对齐：移除未使用的 Hero 字段 */
  services: ["cta.", "hero."],
  /** 与前台 ContactPageClient 对齐：移除未使用的旧 Hero / 地图字段 */
  contact: ["bottomCta.", "hero.", "map.", "team.directLineLabel", "team.whatsappLabel"],
};

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

export function collectPageContentMediaUrls(data: Record<string, string> | null | undefined) {
  if (!data) return [];
  return Object.entries(data)
    .filter(([key, value]) => isSharedMediaField(key) && typeof value === "string" && value.trim())
    .map(([, value]) => value.trim());
}

export function sanitizePageContentData(
  pageId: ValidPageId,
  data: Record<string, string> | null | undefined
) {
  if (!data) return {};

  const obsoletePrefixes = OBSOLETE_PAGE_CONTENT_PREFIXES[pageId] ?? [];
  if (obsoletePrefixes.length === 0) {
    return { ...data };
  }

  return Object.fromEntries(
    Object.entries(data).filter(
      ([key]) => !obsoletePrefixes.some((prefix) => key.startsWith(prefix))
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

  return sanitizePageContentData(pageId, mergedData);
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
