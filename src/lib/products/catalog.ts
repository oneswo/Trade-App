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
  image: string;
}

export interface CatalogProductDetail extends CatalogProductCard {
  summary: string;
  description: string;
  images: string[];
  videoUrl: string | null;
  coreSpecs: ProductSpecItem[];
  detailedSpecs: ProductSpecItem[];
}

interface ApiProductListItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  summary: string;
  coverImageUrl: string | null;
  createdAt: string;
}

interface ApiProductDetailItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  specs: Array<{ key: string; value: string }>;
  coverImageUrl: string | null;
  galleryImageUrls: string[];
  videoUrl: string | null;
  createdAt: string;
}

const FALLBACK_IMAGE = "/images/products/1.jpg";

const MOCK_TITLE_ZH: Record<string, string> = {
  "cat-320d-l": "卡特 320D L 履带挖掘机",
  "komatsu-pc200-8": "小松 PC200-8 液压挖掘机",
  "sany-sy365h": "三一 SY365H 大型挖掘机",
  "hitachi-zx210lc-5n": "日立 ZX210LC-5N 履带挖掘机",
  "cat-950h-loader": "卡特 950H 轮式装载机",
  "komatsu-d155a-6": "小松 D155A-6 履带推土机",
};

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

const MOCK_CARDS: CatalogProductCard[] = [
  {
    id: "mock-1",
    slug: "cat-320d-l",
    title: "Caterpillar 320D L Crawler Excavator",
    brand: "CAT",
    year: "2019",
    weight: "21.5T",
    hours: "3,200H",
    engine: "CAT C6.4",
    location: "Shanghai",
    category: "Excavator",
    image: "/images/products/1.jpg",
  },
  {
    id: "mock-2",
    slug: "komatsu-pc200-8",
    title: "Komatsu PC200-8 Hydraulic Excavator",
    brand: "Komatsu",
    year: "2018",
    weight: "20.8T",
    hours: "4,100H",
    engine: "SAA6D107E",
    location: "Shanghai",
    category: "Excavator",
    image: "/images/products/2.jpg",
  },
  {
    id: "mock-3",
    slug: "sany-sy365h",
    title: "SANY SY365H Heavy Large Excavator",
    brand: "SANY",
    year: "2021",
    weight: "36.0T",
    hours: "1,800H",
    engine: "Isuzu",
    location: "Guangzhou",
    category: "Excavator",
    image: "/images/products/3.jpg",
  },
  {
    id: "mock-4",
    slug: "hitachi-zx210lc-5n",
    title: "Hitachi ZX210LC-5N Track Excavator",
    brand: "Hitachi",
    year: "2017",
    weight: "21.2T",
    hours: "4,850H",
    engine: "Isuzu",
    location: "Shanghai",
    category: "Excavator",
    image: "/images/products/4.jpg",
  },
  {
    id: "mock-5",
    slug: "cat-950h-loader",
    title: "Caterpillar 950H Wheel Loader",
    brand: "CAT",
    year: "2019",
    weight: "18.5T",
    hours: "2,900H",
    engine: "CAT C7.1",
    location: "Shanghai",
    category: "Loader",
    image: "/images/products/5.jpg",
  },
  {
    id: "mock-6",
    slug: "komatsu-d155a-6",
    title: "Komatsu D155A-6 Crawler Dozer",
    brand: "Komatsu",
    year: "2016",
    weight: "39.5T",
    hours: "5,500H",
    engine: "SAA6D140E",
    location: "Shanghai",
    category: "Dozer",
    image: "/images/products/6.jpg",
  },
];

const FIRST_DETAIL: CatalogProductDetail = {
  ...MOCK_CARDS[0],
  summary: "Best-selling classic model with stable condition and mature export workflow.",
  description:
    "This machine has passed a full inspection process and is suitable for diverse overseas working conditions.",
  images: [
    "/images/products/1.jpg",
    "/images/products/2.jpg",
    "/images/products/3.jpg",
    "/images/products/4.jpg",
    "/images/products/5.jpg",
    "/images/products/6.jpg",
  ],
  videoUrl: null,
  coreSpecs: [
    { label: "Year", value: "2019" },
    { label: "Hours", value: "3,200 hours" },
    { label: "Operating Weight", value: "21.5 t" },
    { label: "Location", value: "Bonded warehouse, Shanghai" },
  ],
  detailedSpecs: [
    { label: "Engine Model", value: "CAT C6.4 ACERT" },
    { label: "Net Power", value: "103 kW (138 hp)" },
    { label: "Bucket Capacity", value: "1.2 m³" },
    { label: "Swing Speed", value: "11.5 rpm" },
    { label: "Max Digging Depth", value: "6,650 mm" },
    { label: "Track Gauge", value: "2,380 mm" },
    { label: "Fuel Tank Capacity", value: "410 L" },
    { label: "Country of Origin", value: "Made in Japan" },
  ],
};

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

function localizeTitle(slug: string, title: string, locale: SupportedLocale) {
  if (locale === "en") return title;
  return MOCK_TITLE_ZH[slug] ?? title;
}

function toZHSummary(detail: CatalogProductDetail) {
  const title = localizeTitle(detail.slug, detail.title, "zh");
  return `${title}，整机状态良好，可快速安排视频验机。`;
}

function toZHDescription(detail: CatalogProductDetail) {
  const title = localizeTitle(detail.slug, detail.title, "zh");
  return `${title} 当前在库，可按出口流程完成整机检查与发运。`;
}

function normalizeSpecKey(label: string) {
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

function localizeCard(card: CatalogProductCard, locale: SupportedLocale): CatalogProductCard {
  return {
    ...card,
    title: localizeTitle(card.slug, card.title, locale),
    brand: localizeBrand(card.brand, locale),
    category: localizeCategory(card.category, locale),
    location: localizeLocation(card.location, locale),
    weight: localizeWeight(card.weight, locale),
    hours: localizeHours(card.hours, locale),
  };
}

function localizeDetail(detail: CatalogProductDetail, locale: SupportedLocale): CatalogProductDetail {
  const localizedCard = localizeCard(detail, locale);
  return {
    ...detail,
    ...localizedCard,
    summary: locale === "zh" ? toZHSummary(detail) : detail.summary,
    description: locale === "zh" ? toZHDescription(detail) : detail.description,
    coreSpecs: detail.coreSpecs.map((spec) => ({
      label: localizeSpecLabel(spec.label, locale),
      value: localizeSpecValue(spec.value, locale),
    })),
    detailedSpecs: detail.detailedSpecs.map((spec) => ({
      label: localizeSpecLabel(spec.label, locale),
      value: localizeSpecValue(spec.value, locale),
    })),
  };
}

function buildDefaultDetail(card: CatalogProductCard): CatalogProductDetail {
  return {
    ...card,
    summary: `${card.title} is in good condition and can be inspected by video quickly.`,
    description: `${card.title} is currently in stock and ready for export delivery.`,
    images: [card.image],
    videoUrl: null,
    coreSpecs: [
      { label: "Year", value: card.year },
      { label: "Hours", value: card.hours.replace("H", " hours") },
      { label: "Operating Weight", value: card.weight.replace("T", " t") },
      { label: "Location", value: card.location },
    ],
    detailedSpecs: [
      { label: "Engine Model", value: card.engine },
      { label: "Brand", value: card.brand },
      { label: "Category", value: card.category },
      { label: "Stock Status", value: "In Stock" },
    ],
  };
}

const MOCK_DETAIL_MAP = new Map<string, CatalogProductDetail>(
  MOCK_CARDS.map((card) => [card.slug, buildDefaultDetail(card)])
);
MOCK_DETAIL_MAP.set(FIRST_DETAIL.slug, FIRST_DETAIL);

const ENABLE_PRODUCT_API =
  process.env.NEXT_PUBLIC_ENABLE_PRODUCT_API === "1" ||
  process.env.NEXT_PUBLIC_ENABLE_PRODUCT_API === "true";

function sanitizeImage(url: string | null | undefined) {
  if (!url) return FALLBACK_IMAGE;
  return url;
}

function toApiCard(item: ApiProductListItem): CatalogProductCard {
  const year = String(new Date(item.createdAt).getFullYear() || "--");
  return {
    id: item.id,
    slug: item.slug,
    title: item.name,
    brand: "KXTJ",
    year,
    weight: "--",
    hours: "--",
    engine: "--",
    location: "Shanghai",
    category: item.category || "Excavator",
    image: sanitizeImage(item.coverImageUrl),
  };
}

function pickTopSpecs(specs: Array<{ key: string; value: string }>): ProductSpecItem[] {
  return specs.slice(0, 4).map((item) => ({
    label: item.key,
    value: item.value,
  }));
}

function toApiDetail(item: ApiProductDetailItem): CatalogProductDetail {
  const specs = Array.isArray(item.specs) ? item.specs : [];
  const images = [item.coverImageUrl, ...(item.galleryImageUrls || [])].filter(
    (value): value is string => Boolean(value)
  );

  const coreSpecs = pickTopSpecs(specs);

  return {
    id: item.id,
    slug: item.slug,
    title: item.name,
    brand: "KXTJ",
    year: String(new Date(item.createdAt).getFullYear() || "--"),
    weight: specs.find((s) => /weight/i.test(s.key))?.value || "--",
    hours: specs.find((s) => /hour/i.test(s.key))?.value || "--",
    engine: specs.find((s) => /engine/i.test(s.key))?.value || "--",
    location: "Shanghai",
    category: item.category || "Excavator",
    image: sanitizeImage(item.coverImageUrl),
    summary: item.summary || "",
    description: item.description || "",
    images: images.length > 0 ? images : [FALLBACK_IMAGE],
    videoUrl: item.videoUrl || null,
    coreSpecs:
      coreSpecs.length > 0
        ? coreSpecs
        : [
            { label: "Category", value: item.category || "Excavator" },
            { label: "Brand", value: "KXTJ" },
            { label: "Location", value: "Shanghai" },
            { label: "Stock Status", value: "In Stock" },
          ],
    detailedSpecs:
      specs.length > 0
        ? specs.map((spec) => ({ label: spec.key, value: spec.value }))
        : [
            { label: "Brand", value: "KXTJ" },
            { label: "Category", value: item.category || "Excavator" },
          ],
  };
}

function mockList(locale: SupportedLocale) {
  const extendedCards = [
    ...MOCK_CARDS,
    ...MOCK_CARDS.map(c => ({...c, id: c.id + '-v2', slug: c.slug + '-v2'})),
    ...MOCK_CARDS.map(c => ({...c, id: c.id + '-v3', slug: c.slug + '-v3'}))
  ];
  return extendedCards.map((item) => localizeCard(item, locale));
}

function mockDetail(slug: string, locale: SupportedLocale) {
  // To handle duplicated slugs from extendedCards
  let baseSlug = slug;
  if (slug.endsWith('-v2')) baseSlug = slug.replace('-v2', '');
  if (slug.endsWith('-v3')) baseSlug = slug.replace('-v3', '');
  
  const item = MOCK_DETAIL_MAP.get(baseSlug);
  if (!item) return null;
  // clone item with current slug
  const matchedItem = { ...item, slug, id: slug };
  return localizeDetail(matchedItem, locale);
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
  if (!ENABLE_PRODUCT_API) {
    return mockList(locale);
  }

  try {
    const data = await fetchJson<ApiProductListItem[]>("/api/products");
    if (!data || data.length === 0) {
      return mockList(locale);
    }
    return data.map(toApiCard).map((item) => localizeCard(item, locale));
  } catch {
    return mockList(locale);
  }
}

export async function getCatalogProductDetail(
  slug: string,
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<CatalogProductDetail | null> {
  if (!slug) return null;

  if (!ENABLE_PRODUCT_API) {
    return mockDetail(slug, locale);
  }

  try {
    const data = await fetchJson<ApiProductDetailItem>(
      `/api/products/${encodeURIComponent(slug)}`
    );

    if (data) {
      return localizeDetail(toApiDetail(data), locale);
    }

    return mockDetail(slug, locale);
  } catch {
    return mockDetail(slug, locale);
  }
}

export async function getCatalogRelatedProducts(
  slug: string,
  limit = 3,
  locale: SupportedLocale = DEFAULT_LOCALE
): Promise<CatalogProductCard[]> {
  const list = await getCatalogProducts(locale);
  return list.filter((item) => item.slug !== slug).slice(0, limit);
}
