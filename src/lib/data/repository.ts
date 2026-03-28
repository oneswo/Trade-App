export type InquiryStatus = "PENDING" | "CONTACTED" | "CLOSED";

export interface InquiryRecord {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  locale: string;
  source: string | null;
  pagePath: string | null;
  isRead: boolean;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInquiryInput {
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  locale: string;
  source?: string | null;
  pagePath?: string | null;
}

export interface UpdateInquiryInput {
  status?: InquiryStatus;
  isRead?: boolean;
}

export interface InquiryRepo {
  create(input: CreateInquiryInput): Promise<InquiryRecord>;
  list(): Promise<InquiryRecord[]>;
  markRead(id: string): Promise<InquiryRecord | null>;
  update(id: string, input: UpdateInquiryInput): Promise<InquiryRecord | null>;
}

export interface AdminRecord {
  id: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface AdminAuthRepo {
  findByEmail(email: string): Promise<AdminRecord | null>;
}

export type ProductStatus = "DRAFT" | "PUBLISHED";

export interface ProductSpec {
  key: string;
  value: string;
}

export interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  specs: ProductSpec[];
  coverImageUrl: string | null;
  galleryImageUrls: string[];
  videoUrl: string | null;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  specs: ProductSpec[];
  coverImageUrl?: string | null;
  galleryImageUrls?: string[];
  videoUrl?: string | null;
  status?: ProductStatus;
}

export interface UpdateProductInput {
  name?: string;
  slug?: string;
  category?: string;
  summary?: string;
  description?: string;
  specs?: ProductSpec[];
  coverImageUrl?: string | null;
  galleryImageUrls?: string[];
  videoUrl?: string | null;
  status?: ProductStatus;
}

export interface ProductRepo {
  list(): Promise<ProductRecord[]>;
  findById(id: string): Promise<ProductRecord | null>;
  findBySlug(slug: string): Promise<ProductRecord | null>;
  create(input: CreateProductInput): Promise<ProductRecord>;
  update(id: string, input: UpdateProductInput): Promise<ProductRecord | null>;
  remove(id: string): Promise<boolean>;
}

export type ArticleStatus = "DRAFT" | "PUBLISHED";

export interface ArticleRecord {
  id: string;
  title: string;
  titleZh: string | null;
  slug: string;
  category: string;
  summary: string;
  summaryZh: string | null;
  content: string;
  contentZh: string | null;
  coverImageUrl: string | null;
  readTime: string | null;
  status: ArticleStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleInput {
  title: string;
  titleZh?: string | null;
  slug: string;
  category: string;
  summary: string;
  summaryZh?: string | null;
  content: string;
  contentZh?: string | null;
  coverImageUrl?: string | null;
  readTime?: string | null;
  status?: ArticleStatus;
}

export interface UpdateArticleInput {
  title?: string;
  titleZh?: string | null;
  slug?: string;
  category?: string;
  summary?: string;
  summaryZh?: string | null;
  content?: string;
  contentZh?: string | null;
  coverImageUrl?: string | null;
  readTime?: string | null;
  status?: ArticleStatus;
}

export interface ArticleRepo {
  list(statusFilter?: ArticleStatus): Promise<ArticleRecord[]>;
  findById(id: string): Promise<ArticleRecord | null>;
  findBySlug(slug: string): Promise<ArticleRecord | null>;
  create(input: CreateArticleInput): Promise<ArticleRecord>;
  update(id: string, input: UpdateArticleInput): Promise<ArticleRecord | null>;
  remove(id: string): Promise<boolean>;
}

// ─── PageContent ─────────────────────────────────────────────────────────────

export interface PageContentRecord {
  pageId: string;
  locale: string;
  data: Record<string, string>;
  updatedAt: string;
}

export interface PageContentRepo {
  get(pageId: string, locale: string): Promise<PageContentRecord | null>;
  upsert(pageId: string, locale: string, data: Record<string, string>): Promise<PageContentRecord>;
}

// ─── MockStore ───────────────────────────────────────────────────────────────

interface MockStore {
  inquiries: InquiryRecord[];
  admins: AdminRecord[];
  products: ProductRecord[];
  articles: ArticleRecord[];
  pageContents: Record<string, PageContentRecord>;
}

declare global {
  var __kxtjMockStore__: MockStore | undefined;
}

function createInitialStore(): MockStore {
  const now = new Date().toISOString();
  return {
    pageContents: {},
    articles: [
      {
        id: "art_1",
        title: "Comprehensive Guide for Buying Used Excavators from China",
        titleZh: "从中国购买二手挖掘机的全面避坑指南与跨国交割总结",
        slug: "buying-used-excavators-from-china-guide",
        category: "GUIDE",
        summary: "From inspecting the swing motor to checking undercarriage blind spots, this guide helps you avoid costly pitfalls.",
        summaryZh: "从查验回转马达到审查底盘件盲区，这篇详尽的出海提货指南将帮你避免损失数万美金的暗坑。",
        content: "Full article content goes here.",
        contentZh: "完整文章内容。",
        coverImageUrl: "/images/insights/1.jpg",
        readTime: "8 MIN READ",
        status: "PUBLISHED",
        publishedAt: new Date("2026-10-24").toISOString(),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "art_2",
        title: "Maximizing Excavator ROI: Lifespan Extension & Simplified Maintenance",
        titleZh: "挖掘机投资效益最大化：延长使用寿命和极简化维保策略",
        slug: "maximizing-excavator-roi-maintenance",
        category: "MAINTENANCE",
        summary: "An experienced engineer tears down the Volvo EC210D cooling system to reveal the secrets of hydraulic longevity.",
        summaryZh: "资深工程师亲自拆解沃尔沃 EC210D 的冷却系统，带您掌握核心液压部件的长效存活指标。",
        content: "Full article content goes here.",
        contentZh: "完整文章内容。",
        coverImageUrl: "/images/insights/2.jpg",
        readTime: "5 MIN READ",
        status: "PUBLISHED",
        publishedAt: new Date("2026-09-18").toISOString(),
        createdAt: now,
        updatedAt: now,
      },
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
        description:
          "KXTJ-360 is built for high-load construction projects and mining operations.",
        specs: [
          { key: "Operating Weight", value: "36,000 kg" },
          { key: "Engine Power", value: "212 kW" },
        ],
        coverImageUrl: "/images/products/1.jpg",
        galleryImageUrls: ["/images/products/1.jpg", "/images/products/2.jpg"],
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
        description:
          "KXTJ-220 balances fuel efficiency and digging force for mid-sized projects.",
        specs: [
          { key: "Operating Weight", value: "22,000 kg" },
          { key: "Engine Power", value: "124 kW" },
        ],
        coverImageUrl: "/images/products/3.jpg",
        galleryImageUrls: ["/images/products/3.jpg"],
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
  // 热更新后旧 store 可能缺少新字段，补全它
  if (!globalThis.__kxtjMockStore__.pageContents) {
    globalThis.__kxtjMockStore__.pageContents = {};
  }
  return globalThis.__kxtjMockStore__;
}

const mockInquiryRepo: InquiryRepo = {
  async create(input) {
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
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

  async update(id, input) {
    const store = getMockStore();
    const inquiry = store.inquiries.find((item) => item.id === id);
    if (!inquiry) return null;

    if (input.status !== undefined) inquiry.status = input.status;
    if (input.isRead !== undefined) inquiry.isRead = input.isRead;
    inquiry.updatedAt = new Date().toISOString();
    return { ...inquiry };
  },
};

const mockAdminAuthRepo: AdminAuthRepo = {
  async findByEmail(email) {
    const store = getMockStore();
    return store.admins.find((admin) => admin.email === email) ?? null;
  },
};

function cloneProduct(record: ProductRecord): ProductRecord {
  return {
    ...record,
    specs: record.specs.map((spec) => ({ ...spec })),
    galleryImageUrls: [...record.galleryImageUrls],
  };
}

const mockProductRepo: ProductRepo = {
  async list() {
    const store = getMockStore();
    return [...store.products]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
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

  async create(input) {
    const now = new Date().toISOString();
    const record: ProductRecord = {
      id: `prod_${crypto.randomUUID()}`,
      name: input.name,
      slug: input.slug,
      category: input.category,
      summary: input.summary,
      description: input.description,
      specs: input.specs.map((spec) => ({ ...spec })),
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

  async update(id, input) {
    const store = getMockStore();
    const product = store.products.find((item) => item.id === id);

    if (!product) return null;

    if (typeof input.name === "string") product.name = input.name;
    if (typeof input.slug === "string") product.slug = input.slug;
    if (typeof input.category === "string") product.category = input.category;
    if (typeof input.summary === "string") product.summary = input.summary;
    if (typeof input.description === "string")
      product.description = input.description;
    if (Array.isArray(input.specs)) {
      product.specs = input.specs.map((spec) => ({ ...spec }));
    }
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

function cloneArticle(record: ArticleRecord): ArticleRecord {
  return { ...record };
}

const mockArticleRepo: ArticleRepo = {
  async list(statusFilter) {
    const store = getMockStore();
    const items = statusFilter
      ? store.articles.filter((a) => a.status === statusFilter)
      : [...store.articles];
    return items
      .sort(
        (a, b) =>
          new Date(b.publishedAt ?? b.createdAt).getTime() -
          new Date(a.publishedAt ?? a.createdAt).getTime()
      )
      .map(cloneArticle);
  },

  async findById(id) {
    const store = getMockStore();
    const item = store.articles.find((a) => a.id === id);
    return item ? cloneArticle(item) : null;
  },

  async findBySlug(slug) {
    const store = getMockStore();
    const target = slug.trim().toLowerCase();
    const item = store.articles.find(
      (a) => a.slug.trim().toLowerCase() === target
    );
    return item ? cloneArticle(item) : null;
  },

  async create(input) {
    const now = new Date().toISOString();
    const record: ArticleRecord = {
      id: `art_${crypto.randomUUID()}`,
      title: input.title,
      titleZh: input.titleZh ?? null,
      slug: input.slug,
      category: input.category,
      summary: input.summary,
      summaryZh: input.summaryZh ?? null,
      content: input.content,
      contentZh: input.contentZh ?? null,
      coverImageUrl: input.coverImageUrl ?? null,
      readTime: input.readTime ?? null,
      status: input.status ?? "DRAFT",
      publishedAt:
        input.status === "PUBLISHED" ? now : null,
      createdAt: now,
      updatedAt: now,
    };
    const store = getMockStore();
    store.articles.unshift(record);
    return cloneArticle(record);
  },

  async update(id, input) {
    const store = getMockStore();
    const item = store.articles.find((a) => a.id === id);
    if (!item) return null;

    if (input.title !== undefined) item.title = input.title;
    if (input.titleZh !== undefined) item.titleZh = input.titleZh;
    if (input.slug !== undefined) item.slug = input.slug;
    if (input.category !== undefined) item.category = input.category;
    if (input.summary !== undefined) item.summary = input.summary;
    if (input.summaryZh !== undefined) item.summaryZh = input.summaryZh;
    if (input.content !== undefined) item.content = input.content;
    if (input.contentZh !== undefined) item.contentZh = input.contentZh;
    if ("coverImageUrl" in input) item.coverImageUrl = input.coverImageUrl ?? null;
    if (input.readTime !== undefined) item.readTime = input.readTime;
    if (input.status !== undefined) {
      const wasPublished = item.status === "PUBLISHED";
      item.status = input.status;
      if (!wasPublished && input.status === "PUBLISHED" && !item.publishedAt) {
        item.publishedAt = new Date().toISOString();
      }
    }
    item.updatedAt = new Date().toISOString();
    return cloneArticle(item);
  },

  async remove(id) {
    const store = getMockStore();
    const index = store.articles.findIndex((a) => a.id === id);
    if (index < 0) return false;
    store.articles.splice(index, 1);
    return true;
  },
};

function isSupabaseConfigured() {
  return !!(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function getInquiryRepo(): InquiryRepo {
  if (isSupabaseConfigured()) {
    const { supabaseInquiryRepo } = require("./supabase-repository") as typeof import("./supabase-repository");
    return supabaseInquiryRepo;
  }
  return mockInquiryRepo;
}

export function getAdminAuthRepo(): AdminAuthRepo {
  if (isSupabaseConfigured()) {
    const { supabaseAdminAuthRepo } = require("./supabase-repository") as typeof import("./supabase-repository");
    return supabaseAdminAuthRepo;
  }
  return mockAdminAuthRepo;
}

export function getProductRepo(): ProductRepo {
  if (isSupabaseConfigured()) {
    const { supabaseProductRepo } = require("./supabase-repository") as typeof import("./supabase-repository");
    return supabaseProductRepo;
  }
  return mockProductRepo;
}

export function getArticleRepo(): ArticleRepo {
  if (isSupabaseConfigured()) {
    const { supabaseArticleRepo } = require("./supabase-repository") as typeof import("./supabase-repository");
    return supabaseArticleRepo;
  }
  return mockArticleRepo;
}

// ─── PageContent mock + factory ──────────────────────────────────────────────

const mockPageContentRepo: PageContentRepo = {
  async get(pageId, locale) {
    const store = getMockStore();
    return store.pageContents[`${pageId}:${locale}`] ?? null;
  },
  async upsert(pageId, locale, data) {
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

export function getPageContentRepo(): PageContentRepo {
  if (isSupabaseConfigured()) {
    const { supabasePageContentRepo } = require("./supabase-repository") as typeof import("./supabase-repository");
    return supabasePageContentRepo;
  }
  return mockPageContentRepo;
}
