import { DEFAULT_LOCALE, type SupportedLocale } from "@/lib/i18n/locales";

export interface ProductSpecItem {
  label: string;
  value: string;
}

export interface CatalogProductCard {
  id: string;
  slug: string;
  title: string;
  brand: string;
  year: string;
  weight: string;
  hours: string;
  engine: string;
  location: string;
  category: string;
  categorySlug: string;
  image: string;
}

export interface CatalogProductDetail extends CatalogProductCard {
  summary: string;
  description: string;
  images: string[];
  videoUrl: string | null;
  coreSpecs: ProductSpecItem[];
  detailedSpecs: ProductSpecItem[];
  stockAmount?: number;
  enableTrustCards?: boolean;
}

interface ApiProductListItem {
  id: string;
  name: string;
  nameZh?: string;
  nameEn?: string;
  slug: string;
  category: string;
  summary: string;
  summaryZh?: string;
  summaryEn?: string;
  coreMetrics?: {
    year?: string;
    hours?: string;
    tonnage?: string;
    location?: string;
    model?: string;
    brand?: string;
  };
  stockAmount?: number;
  coverImageUrl: string | null;
  createdAt: string;
}

interface ApiProductDetailItem extends ApiProductListItem {
  description: string;
  specs: Array<{ key: string; value: string }>;
  galleryImageUrls: string[];
  videoUrl: string | null;
  enableTrustCards?: boolean;
}

const FALLBACK_IMAGE = "/images/products/1.jpg";

const BRAND_ZH: Record<string, string> = {
  CAT: "卡特",
  Komatsu: "小松",
  SANY: "三一",
  Hitachi: "日立",
  KXTJ: "坤旋",
};

const LOCATION_ZH: Record<string, string> = {
  Shanghai: "上海",
  Guangzhou: "广州",
};

const CATEGORY_EN_TO_ZH: Record<string, string> = {
  excavator: "挖掘机",
  loader: "装载机",
  dozer: "推土机",
  roller: "压路机",
  crane: "起重机",
};

const SPEC_LABELS = {
  year: { zh: "出厂年份", en: "Year" },
  hours: { zh: "表显工时", en: "Hours" },
  weight: { zh: "公称吨位", en: "Operating Weight" },
  location: { zh: "实车地点", en: "Location" },
  engine: { zh: "发动机型号", en: "Engine Model" },
  power: { zh: "额定净功率", en: "Net Power" },
  bucket: { zh: "铲斗标配容量", en: "Bucket Capacity" },
  swing: { zh: "回转速度", en: "Swing Speed" },
  depth: { zh: "最大挖掘深度", en: "Max Digging Depth" },
  track: { zh: "底盘履带轨距", en: "Track Gauge" },
  tank: { zh: "燃油箱总容量", en: "Fuel Tank Capacity" },
  origin: { zh: "铭牌原产国", en: "Country of Origin" },
  brand: { zh: "设备品牌", en: "Brand" },
  category: { zh: "设备分类", en: "Category" },
  status: { zh: "库存状态", en: "Stock Status" },
} as const;

function normalizeCategoryKey(category: string) {
  const raw = category.trim().toLowerCase();
  if (raw.includes("挖") || raw.includes("excavator")) return "excavator";
  if (raw.includes("装载") || raw.includes("loader")) return "loader";
  if (raw.includes("推土") || raw.includes("dozer")) return "dozer";
  if (raw.includes("压路") || raw.includes("roller")) return "roller";
  if (raw.includes("起重") || raw.includes("crane")) return "crane";
  return "";
}

function localizeCategory(category: string, locale: SupportedLocale) {
  const key = normalizeCategoryKey(category);
  if (!key) return category;
  return locale === "zh" ? CATEGORY_EN_TO_ZH[key] : key.charAt(0).toUpperCase() + key.slice(1);
}

function localizeBrand(brand: string, locale: SupportedLocale) {
  if (locale === "en") return brand;
  return BRAND_ZH[brand] ?? brand;
}

function localizeLocation(location: string, locale: SupportedLocale) {
  if (locale === "en") return location;
  return LOCATION_ZH[location] ?? location;
}

function localizeWeight(weight: string, locale: SupportedLocale) {
  if (locale === "zh") return weight.replace("T", "吨").replace("t", "吨");
  return weight.replace("吨", "t");
}

function localizeHours(hours: string, locale: SupportedLocale) {
  if (locale === "zh") return hours.replace("H", "小时");
  return hours.replace("小时", "hours");
}

function normalizeSpecKey(label: string): keyof typeof SPEC_LABELS | "" {
  const lower = label.trim().toLowerCase();
  if (lower.includes("year") || label.includes("出厂年份")) return "year";
  if (lower.includes("hour") || label.includes("工时")) return "hours";
  if (lower.includes("weight") || lower.includes("tonnage") || label.includes("吨位")) return "weight";
  if (lower.includes("location") || label.includes("地点")) return "location";
  if (lower.includes("engine") || label.includes("发动机")) return "engine";
  if (lower.includes("power") || label.includes("功率")) return "power";
  if (lower.includes("bucket") || label.includes("铲斗")) return "bucket";
  if (lower.includes("swing") || label.includes("回转")) return "swing";
  if (lower.includes("depth") || label.includes("挖掘深度")) return "depth";
  if (lower.includes("track") || label.includes("轨距")) return "track";
  if (lower.includes("fuel") || label.includes("油箱")) return "tank";
  if (lower.includes("origin") || label.includes("原产国")) return "origin";
  if (lower === "brand" || label.includes("品牌")) return "brand";
  if (lower === "category" || label.includes("分类")) return "category";
  if (lower.includes("status") || label.includes("库存")) return "status";
  return "";
}

function localizeSpecLabel(label: string, locale: SupportedLocale) {
  const key = normalizeSpecKey(label);
  if (!key) return label;
  return SPEC_LABELS[key][locale];
}

function localizeSpecValue(value: string, locale: SupportedLocale) {
  if (locale === "zh") {
    return value
      .replace("In Stock", "现货在库")
      .replace("Bonded warehouse, Shanghai", "上海保税仓现车")
      .replace("Made in Japan", "日本制造")
      .replace("hours", "小时")
      .replace(" t", " 吨")
      .replace(" hp", " 马力")
      .replace("Shanghai", "上海")
      .replace("Guangzhou", "广州");
  }

  return value
    .replace("现货在库", "In Stock")
    .replace("上海保税仓现车", "Bonded warehouse, Shanghai")
    .replace("日本制造", "Made in Japan")
    .replace(" 小时", " hours")
    .replace(" 吨", " t")
    .replace(" 马力", " hp")
    .replace("上海", "Shanghai")
    .replace("广州", "Guangzhou");
}

function sanitizeImage(url: string | null | undefined) {
  if (!url) return FALLBACK_IMAGE;
  return url;
}

function toApiCard(item: ApiProductListItem, locale: SupportedLocale): CatalogProductCard {
  const year = item.coreMetrics?.year || String(new Date(item.createdAt).getFullYear() || "--");
  const title = locale === "zh" ? (item.nameZh || item.name) : (item.nameEn || item.name);
  
  return {
    id: item.id,
    slug: item.slug,
    title,
    brand: localizeBrand(item.coreMetrics?.brand || "KXTJ", locale),
    year,
    weight: localizeWeight(item.coreMetrics?.tonnage || "--", locale),
    hours: localizeHours(item.coreMetrics?.hours || "--", locale),
    engine: item.coreMetrics?.model || "--",
    location: localizeLocation(item.coreMetrics?.location || "Shanghai", locale),
    category: localizeCategory(item.category || "Excavator", locale),
    categorySlug: (item.category || "").trim().toLowerCase(),
    image: sanitizeImage(item.coverImageUrl),
  };
}

function toApiDetail(item: ApiProductDetailItem, locale: SupportedLocale): CatalogProductDetail {
  const card = toApiCard(item, locale);
  const specs = Array.isArray(item.specs) ? item.specs : [];
  const images = [item.coverImageUrl, ...(item.galleryImageUrls || [])].filter(
    (value): value is string => Boolean(value)
  );

  const summary = locale === "zh" ? (item.summaryZh || item.summary) : (item.summaryEn || item.summary);
  // Optional: add descriptionZh to DB if needed, fallback to description for now
  const description = item.description || "";

  const coreSpecs: ProductSpecItem[] = [];
  if (item.coreMetrics) {
    if (item.coreMetrics.year) coreSpecs.push({ label: localizeSpecLabel("Year", locale), value: item.coreMetrics.year });
    if (item.coreMetrics.hours) coreSpecs.push({ label: localizeSpecLabel("Hours", locale), value: localizeSpecValue(item.coreMetrics.hours, locale) });
    if (item.coreMetrics.tonnage) coreSpecs.push({ label: localizeSpecLabel("Operating Weight", locale), value: localizeSpecValue(item.coreMetrics.tonnage, locale) });
    if (item.coreMetrics.location) coreSpecs.push({ label: localizeSpecLabel("Location", locale), value: localizeLocation(item.coreMetrics.location, locale) });
    if (item.coreMetrics.model) coreSpecs.push({ label: localizeSpecLabel("Engine Model", locale), value: item.coreMetrics.model });
    if (item.coreMetrics.brand) coreSpecs.push({ label: localizeSpecLabel("Brand", locale), value: localizeBrand(item.coreMetrics.brand, locale) });
  }

  return {
    ...card,
    summary: summary || "",
    description,
    images: images.length > 0 ? images : [FALLBACK_IMAGE],
    videoUrl: item.videoUrl || null,
    stockAmount: item.stockAmount,
    enableTrustCards: item.enableTrustCards ?? true,
    coreSpecs: coreSpecs.length > 0 ? coreSpecs : [
      { label: localizeSpecLabel("Category", locale), value: card.category },
      { label: localizeSpecLabel("Brand", locale), value: card.brand },
      { label: localizeSpecLabel("Location", locale), value: card.location },
      { label: localizeSpecLabel("Stock Status", locale), value: localizeSpecValue("In Stock", locale) },
    ],
    detailedSpecs: specs.length > 0
      ? specs.map((spec) => ({
          label: localizeSpecLabel(spec.key, locale),
          value: localizeSpecValue(spec.value, locale),
        }))
      : [
          { label: localizeSpecLabel("Brand", locale), value: card.brand },
          { label: localizeSpecLabel("Category", locale), value: card.category },
        ],
  };
}

async function fetchJson<T>(url: string): Promise<T | null> {
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) return null;

  const result = (await response.json()) as { ok: boolean; data?: T };
  if (!result.ok || !result.data) return null;

  return result.data;
}

export async function getCatalogProducts(
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<CatalogProductCard[]> {
  try {
    const data = await fetchJson<ApiProductListItem[]>("/api/products");
    if (!data) return [];
    return data.map((item) => toApiCard(item, locale));
  } catch {
    return [];
  }
}

export async function getCatalogProductDetail(
  slug: string,
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<CatalogProductDetail | null> {
  if (!slug) return null;

  try {
    const data = await fetchJson<ApiProductDetailItem>(
      `/api/products/${encodeURIComponent(slug)}`
    );

    if (data) {
      return toApiDetail(data, locale);
    }
    return null;
  } catch {
    return null;
  }
}

export async function getCatalogRelatedProducts(
  slug: string,
  limit = 3,
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<CatalogProductCard[]> {
  const list = await getCatalogProducts(locale);
  const currentProduct = list.find((item) => item.slug === slug);
  const others = list.filter((item) => item.slug !== slug);

  if (!currentProduct) {
    return others.slice(0, limit);
  }

  const parseWeight = (w: string) => parseFloat(w.replace(/[^\d.]/g, '')) || 0;
  const currentWeight = parseWeight(currentProduct.weight);

  const sameCategory = others.filter((item) => item.category === currentProduct.category);

  sameCategory.sort((a, b) => {
    const diffA = Math.abs(parseWeight(a.weight) - currentWeight);
    const diffB = Math.abs(parseWeight(b.weight) - currentWeight);
    return diffA - diffB;
  });

  const differentCategory = others.filter((item) => item.category !== currentProduct.category);

  const results = [...sameCategory, ...differentCategory];

  return results.slice(0, limit);
}
