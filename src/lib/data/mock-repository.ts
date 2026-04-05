import type {
  AdminAuthRepo,
  AdminRecord,
  CategoryRecord,
  CategoryRepo,
  CreateCategoryInput,
  CreateInquiryInput,
  CreateProductInput,
  InquiryRecord,
  InquiryRepo,
  PageContentRecord,
  PageContentRepo,
  ProductRecord,
  ProductRepo,
  SiteSettings,
  SiteSettingsRepo,
  UpdateCategoryInput,
  UpdateInquiryInput,
  UpdateProductInput,
} from "./types";
import { DEFAULT_SITE_SETTINGS } from "./types";

interface MockStore {
  inquiries: InquiryRecord[];
  products: ProductRecord[];
  pageContents: Record<string, PageContentRecord>;
  categories: CategoryRecord[];
  admins: AdminRecord[];
}

interface MockStoreWithSettings extends MockStore {
  siteSettings: SiteSettings;
}

declare global {
  var __kxtjMockStore__: MockStore | undefined;
}

function createInitialStore(): MockStore {
  const now = new Date().toISOString();
  return {
    pageContents: {},
    categories: [
      { id: "cat_1", slug: "Excavators", nameZh: "挖掘机", nameEn: "Excavators", imageUrl: null, sortOrder: 1, enabled: true, createdAt: now, updatedAt: now },
      { id: "cat_2", slug: "Loaders", nameZh: "装载机", nameEn: "Loaders", imageUrl: null, sortOrder: 2, enabled: true, createdAt: now, updatedAt: now },
      { id: "cat_3", slug: "Dozers", nameZh: "推土机", nameEn: "Dozers", imageUrl: null, sortOrder: 3, enabled: true, createdAt: now, updatedAt: now },
      { id: "cat_4", slug: "Rollers", nameZh: "压路机", nameEn: "Rollers", imageUrl: null, sortOrder: 4, enabled: true, createdAt: now, updatedAt: now },
      { id: "cat_5", slug: "Cranes", nameZh: "起重机", nameEn: "Cranes", imageUrl: null, sortOrder: 5, enabled: true, createdAt: now, updatedAt: now },
    ],
    inquiries: [],
    admins: [
      {
        id: "admin-local-1",
        email: process.env.ADMIN_EMAIL ?? "admin@kxtj.com",
        password: process.env.ADMIN_PASSWORD ?? "admin123456",
        createdAt: new Date().toISOString(),
      },
    ],
    products: [
      {
        id: "prod_local_1",
        name: "KXTJ-360 Hydraulic Excavator",
        slug: "kxtj-360-hydraulic-excavator",
        category: "Large Excavators",
        summary: "36T heavy excavator, export-ready stock in Shanghai.",
        description: "KXTJ-360 is built for high-load construction projects and mining operations.",
        specs: [
          { key: "Operating Weight", value: "36,000 kg" },
          { key: "Engine Power", value: "212 kW" },
        ],
        coverImageUrl: null,
        galleryImageUrls: [],
        videoUrl: null,
        status: "PUBLISHED",
        createdAt: new Date("2026-03-20T08:00:00.000Z").toISOString(),
        updatedAt: new Date("2026-03-20T08:00:00.000Z").toISOString(),
      },
      {
        id: "prod_local_2",
        name: "KXTJ-220 Compact Excavator",
        slug: "kxtj-220-compact-excavator",
        category: "Mini Excavators",
        summary: "Compact machine for city construction and tight spaces.",
        description: "KXTJ-220 balances fuel efficiency and digging force for mid-sized projects.",
        specs: [
          { key: "Operating Weight", value: "22,000 kg" },
          { key: "Engine Power", value: "124 kW" },
        ],
        coverImageUrl: null,
        galleryImageUrls: [],
        videoUrl: null,
        status: "DRAFT",
        createdAt: new Date("2026-03-22T09:30:00.000Z").toISOString(),
        updatedAt: new Date("2026-03-22T09:30:00.000Z").toISOString(),
      },
    ],
  };
}

function getMockStore(): MockStore {
  if (!globalThis.__kxtjMockStore__) {
    globalThis.__kxtjMockStore__ = createInitialStore();
  }
  if (!globalThis.__kxtjMockStore__.pageContents) {
    globalThis.__kxtjMockStore__.pageContents = {};
  }
  if (!globalThis.__kxtjMockStore__.categories) {
    globalThis.__kxtjMockStore__.categories = createInitialStore().categories;
  }
  return globalThis.__kxtjMockStore__;
}

function getMockStoreWithSettings(): MockStoreWithSettings {
  const store = getMockStore() as MockStoreWithSettings;
  if (!store.siteSettings) {
    store.siteSettings = { ...DEFAULT_SITE_SETTINGS };
  }
  return store;
}

function cloneProduct(record: ProductRecord): ProductRecord {
  return {
    ...record,
    specs: record.specs.map((spec) => ({ ...spec })),
    galleryImageUrls: [...record.galleryImageUrls],
    coreMetrics: record.coreMetrics
      ? {
          ...record.coreMetrics,
          i18n: record.coreMetrics.i18n
            ? {
                ...record.coreMetrics.i18n,
                zh: record.coreMetrics.i18n.zh
                  ? { ...record.coreMetrics.i18n.zh }
                  : undefined,
                en: record.coreMetrics.i18n.en
                  ? { ...record.coreMetrics.i18n.en }
                  : undefined,
              }
            : undefined,
          mediaSlots: record.coreMetrics.mediaSlots?.map((slot) => ({ ...slot })),
        }
      : undefined,
  };
}

const SETTINGS_FILE = (() => {
  try {
    /* eslint-disable @typescript-eslint/no-require-imports */
    const { join } = require("path") as typeof import("path");
    return join(process.cwd(), ".mock-site-settings.json");
  } catch {
    return null;
  }
})();

function loadSettingsFromFile(): SiteSettings | null {
  if (!SETTINGS_FILE) return null;
  try {
    const { existsSync, readFileSync } = require("fs") as typeof import("fs");
    if (existsSync(SETTINGS_FILE)) {
      return JSON.parse(readFileSync(SETTINGS_FILE, "utf-8")) as SiteSettings;
    }
  } catch {}
  return null;
}

function saveSettingsToFile(settings: SiteSettings) {
  if (!SETTINGS_FILE) return;
  try {
    const { writeFileSync } = require("fs") as typeof import("fs");
    writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
  } catch {}
}
/* eslint-enable @typescript-eslint/no-require-imports */

export const mockInquiryRepo: InquiryRepo = {
  async create(input: CreateInquiryInput) {
    const now = new Date().toISOString();
    const record: InquiryRecord = {
      id: `inq_${crypto.randomUUID()}`,
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
      locale: input.locale,
      source: input.source ?? null,
      pagePath: input.pagePath ?? null,
      isRead: false,
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    };
    const store = getMockStore();
    store.inquiries.unshift(record);
    return record;
  },

  async list() {
    const store = getMockStore();
    return [...store.inquiries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async markRead(id) {
    const store = getMockStore();
    const inquiry = store.inquiries.find((item) => item.id === id);
    if (!inquiry) return null;
    inquiry.isRead = true;
    inquiry.updatedAt = new Date().toISOString();
    return inquiry;
  },

  async update(id, input: UpdateInquiryInput) {
    const store = getMockStore();
    const inquiry = store.inquiries.find((item) => item.id === id);
    if (!inquiry) return null;
    if (input.status !== undefined) inquiry.status = input.status;
    if (input.isRead !== undefined) inquiry.isRead = input.isRead;
    inquiry.updatedAt = new Date().toISOString();
    return { ...inquiry };
  },

  async remove(id) {
    const store = getMockStore();
    const index = store.inquiries.findIndex((item) => item.id === id);
    if (index === -1) return false;
    store.inquiries.splice(index, 1);
    return true;
  },
};

export const mockAdminAuthRepo: AdminAuthRepo = {
  async findByIdentifier(identifier: string) {
    const store = getMockStore();
    const normalized = identifier.trim().toLowerCase();
    return (
      store.admins.find((admin) => admin.email.trim().toLowerCase() === normalized) ??
      null
    );
  },
};

export const mockProductRepo: ProductRepo = {
  async list() {
    const store = getMockStore();
    return [...store.products]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(cloneProduct);
  },

  async findById(id) {
    const store = getMockStore();
    const product = store.products.find((item) => item.id === id);
    return product ? cloneProduct(product) : null;
  },

  async findBySlug(slug) {
    const store = getMockStore();
    const target = slug.trim().toLowerCase();
    const product = store.products.find(
      (item) => item.slug.trim().toLowerCase() === target
    );
    return product ? cloneProduct(product) : null;
  },

  async create(input: CreateProductInput) {
    const now = new Date().toISOString();
    const record: ProductRecord = {
      id: `prod_${crypto.randomUUID()}`,
      name: input.name,
      nameZh: input.nameZh,
      nameEn: input.nameEn,
      slug: input.slug,
      category: input.category,
      summary: input.summary,
      summaryZh: input.summaryZh,
      summaryEn: input.summaryEn,
      description: input.description,
      specs: input.specs.map((spec) => ({ ...spec })),
      coreMetrics: input.coreMetrics ? { ...input.coreMetrics } : undefined,
      stockAmount: input.stockAmount,
      coverImageUrl: input.coverImageUrl ?? null,
      galleryImageUrls: [...(input.galleryImageUrls ?? [])],
      videoUrl: input.videoUrl ?? null,
      status: input.status ?? "DRAFT",
      createdAt: now,
      updatedAt: now,
    };
    const store = getMockStore();
    store.products.unshift(record);
    return cloneProduct(record);
  },

  async update(id, input: UpdateProductInput) {
    const store = getMockStore();
    const product = store.products.find((item) => item.id === id);
    if (!product) return null;
    if (typeof input.name === "string") product.name = input.name;
    if (typeof input.nameZh === "string") product.nameZh = input.nameZh;
    if (typeof input.nameEn === "string") product.nameEn = input.nameEn;
    if (typeof input.slug === "string") product.slug = input.slug;
    if (typeof input.category === "string") product.category = input.category;
    if (typeof input.summary === "string") product.summary = input.summary;
    if (typeof input.summaryZh === "string") product.summaryZh = input.summaryZh;
    if (typeof input.summaryEn === "string") product.summaryEn = input.summaryEn;
    if (typeof input.description === "string") product.description = input.description;
    if (Array.isArray(input.specs)) product.specs = input.specs.map((spec) => ({ ...spec }));
    if (input.coreMetrics !== undefined) {
      product.coreMetrics = input.coreMetrics ? { ...input.coreMetrics } : undefined;
    }
    if (typeof input.stockAmount === "number") product.stockAmount = input.stockAmount;
    if (Array.isArray(input.galleryImageUrls)) {
      product.galleryImageUrls = [...input.galleryImageUrls];
    }
    if ("coverImageUrl" in input) {
      product.coverImageUrl = input.coverImageUrl ?? null;
    }
    if ("videoUrl" in input) {
      product.videoUrl = input.videoUrl ?? null;
    }
    if (input.status) {
      product.status = input.status;
    }
    product.updatedAt = new Date().toISOString();
    return cloneProduct(product);
  },

  async remove(id) {
    const store = getMockStore();
    const index = store.products.findIndex((item) => item.id === id);
    if (index < 0) return false;
    store.products.splice(index, 1);
    return true;
  },
};

export const mockCategoryRepo: CategoryRepo = {
  async list() {
    const store = getMockStore();
    return [...store.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async findById(id) {
    const store = getMockStore();
    return store.categories.find((category) => category.id === id) ?? null;
  },

  async create(input: CreateCategoryInput) {
    const now = new Date().toISOString();
    const store = getMockStore();
    const maxOrder = store.categories.reduce(
      (max, category) => Math.max(max, category.sortOrder),
      0
    );
    const record: CategoryRecord = {
      id: `cat_${crypto.randomUUID()}`,
      slug: input.slug,
      nameZh: input.nameZh,
      nameEn: input.nameEn,
      imageUrl: input.imageUrl ?? null,
      sortOrder: input.sortOrder ?? maxOrder + 1,
      enabled: input.enabled ?? true,
      createdAt: now,
      updatedAt: now,
    };
    store.categories.push(record);
    return { ...record };
  },

  async update(id, input: UpdateCategoryInput) {
    const store = getMockStore();
    const item = store.categories.find((category) => category.id === id);
    if (!item) return null;
    if (input.slug !== undefined) item.slug = input.slug;
    if (input.nameZh !== undefined) item.nameZh = input.nameZh;
    if (input.nameEn !== undefined) item.nameEn = input.nameEn;
    if ("imageUrl" in input) item.imageUrl = input.imageUrl ?? null;
    if (input.sortOrder !== undefined) item.sortOrder = input.sortOrder;
    if (input.enabled !== undefined) item.enabled = input.enabled;
    item.updatedAt = new Date().toISOString();
    return { ...item };
  },

  async remove(id) {
    const store = getMockStore();
    const idx = store.categories.findIndex((category) => category.id === id);
    if (idx < 0) return false;
    store.categories.splice(idx, 1);
    return true;
  },
};

export const mockPageContentRepo: PageContentRepo = {
  async get(pageId: string, locale: string) {
    const store = getMockStore();
    return store.pageContents[`${pageId}:${locale}`] ?? null;
  },

  async upsert(pageId: string, locale: string, data: Record<string, string>) {
    const store = getMockStore();
    const record: PageContentRecord = {
      pageId,
      locale,
      data,
      updatedAt: new Date().toISOString(),
    };
    store.pageContents[`${pageId}:${locale}`] = record;
    return record;
  },
};

export const mockSiteSettingsRepo: SiteSettingsRepo = {
  async get() {
    const fileSettings = loadSettingsFromFile();
    if (fileSettings) return fileSettings;
    const store = getMockStoreWithSettings();
    return { ...store.siteSettings };
  },

  async update(input) {
    const store = getMockStoreWithSettings();
    const base = loadSettingsFromFile() ?? store.siteSettings;
    store.siteSettings = {
      ...base,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    saveSettingsToFile(store.siteSettings);
    return { ...store.siteSettings };
  },
};
