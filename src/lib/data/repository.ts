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
  remove(id: string): Promise<boolean>;
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
  name: string; // Primary name for backward compatibility
  nameZh?: string;
  nameEn?: string;
  slug: string;
  category: string;
  summary: string;
  summaryZh?: string;
  summaryEn?: string;
  description: string;
  specs: ProductSpec[];
  coreMetrics?: {
    year?: string;
    hours?: string;
    tonnage?: string;
    location?: string;
    model?: string;
    brand?: string;
  };
  stockAmount?: number;
  enableTrustCards?: boolean;
  coverImageUrl: string | null;
  galleryImageUrls: string[];
  videoUrl: string | null;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  nameZh?: string;
  nameEn?: string;
  slug: string;
  category: string;
  summary: string;
  summaryZh?: string;
  summaryEn?: string;
  description: string;
  specs: ProductSpec[];
  coreMetrics?: ProductRecord["coreMetrics"];
  stockAmount?: number;
  enableTrustCards?: boolean;
  coverImageUrl?: string | null;
  galleryImageUrls?: string[];
  videoUrl?: string | null;
  status?: ProductStatus;
}

export interface UpdateProductInput {
  name?: string;
  nameZh?: string;
  nameEn?: string;
  slug?: string;
  category?: string;
  summary?: string;
  summaryZh?: string;
  summaryEn?: string;
  description?: string;
  specs?: ProductSpec[];
  coreMetrics?: ProductRecord["coreMetrics"];
  stockAmount?: number;
  enableTrustCards?: boolean;
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

// ─── Category ────────────────────────────────────────────────────────────────

export interface CategoryRecord {
  id: string;
  slug: string;         // 唯一标识符，对应产品 category 字段 & 产品页筛选参数
  nameZh: string;       // 中文显示名
  nameEn: string;       // 英文显示名
  imageUrl: string | null;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  slug: string;
  nameZh: string;
  nameEn: string;
  imageUrl?: string | null;
  sortOrder?: number;
  enabled?: boolean;
}

export interface UpdateCategoryInput {
  slug?: string;
  nameZh?: string;
  nameEn?: string;
  imageUrl?: string | null;
  sortOrder?: number;
  enabled?: boolean;
}

export interface CategoryRepo {
  list(): Promise<CategoryRecord[]>;
  findById(id: string): Promise<CategoryRecord | null>;
  create(input: CreateCategoryInput): Promise<CategoryRecord>;
  update(id: string, input: UpdateCategoryInput): Promise<CategoryRecord | null>;
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

// ─── Tickets ──────────────────────────────────────────────────────────────────

export type TicketStatus = "PENDING" | "PROCESSING" | "RESOLVED";
export type TicketType = "BUG" | "FEATURE" | "QUESTION";

export interface TicketRecord {
  id: string;
  title: string;
  description: string;
  type: TicketType;
  status: TicketStatus;
  reply: string | null;
  screenshots: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketInput {
  title: string;
  description: string;
  type: TicketType;
  screenshots?: string[];
}

export interface UpdateTicketInput {
  status?: TicketStatus;
  reply?: string | null;
}

export interface TicketRepo {
  list(): Promise<TicketRecord[]>;
  findById(id: string): Promise<TicketRecord | null>;
  create(input: CreateTicketInput): Promise<TicketRecord>;
  update(id: string, input: UpdateTicketInput): Promise<TicketRecord | null>;
  remove(id: string): Promise<boolean>;
}

// ─── MockStore ───────────────────────────────────────────────────────────────

interface MockStore {
  inquiries: InquiryRecord[];
  tickets: TicketRecord[];
  products: ProductRecord[];
  articles: ArticleRecord[];
  pageContents: Record<string, PageContentRecord>;
  categories: CategoryRecord[];
  admins: AdminRecord[];
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
      { id: "cat_2", slug: "Loaders",    nameZh: "装载机", nameEn: "Loaders",    imageUrl: null, sortOrder: 2, enabled: true, createdAt: now, updatedAt: now },
      { id: "cat_3", slug: "Dozers",     nameZh: "推土机", nameEn: "Dozers",     imageUrl: null, sortOrder: 3, enabled: true, createdAt: now, updatedAt: now },
      { id: "cat_4", slug: "Rollers",    nameZh: "压路机", nameEn: "Rollers",    imageUrl: null, sortOrder: 4, enabled: true, createdAt: now, updatedAt: now },
      { id: "cat_5", slug: "Cranes",     nameZh: "起重机", nameEn: "Cranes",     imageUrl: null, sortOrder: 5, enabled: true, createdAt: now, updatedAt: now },
    ],
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
    tickets: [
      {
        id: "tk-001",
        title: "前台产品视频好像在手机上有点卡",
        description: "我用 iPhone 13 看那个挖掘机视频的时候，刚打开要转圈圈好几秒，能不能帮忙优化一下加载速度？",
        type: "BUG",
        status: "RESOLVED",
        reply: "已为您接通全球 CDN 加速节点，并对视频进行了 WebM 格式压缩，现在手机端应该是秒开了，您可以清下缓存试试！",
        createdAt: "2026-03-25T10:00:00.000Z",
        updatedAt: "2026-03-25T14:00:00.000Z",
      },
      {
        id: "tk-002",
        title: "可以在首页加一排合作品牌的 Logo 吗",
        description: "我们最近拿到了几个欧洲大厂的代理权，想在首页下面滚动的放几个 Logo 彰显实力。",
        type: "FEATURE",
        status: "PROCESSING",
        reply: "收到，设计稿已经出好了，预计今晚给您上线这个新模块。",
        createdAt: "2026-03-28T14:30:00.000Z",
        updatedAt: "2026-03-28T15:30:00.000Z",
      }
    ],
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
  if (!globalThis.__kxtjMockStore__.categories) {
    globalThis.__kxtjMockStore__.categories = createInitialStore().categories;
  }
  if (!globalThis.__kxtjMockStore__.tickets) {
    globalThis.__kxtjMockStore__.tickets = createInitialStore().tickets;
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

  async remove(id) {
    const store = getMockStore();
    const index = store.inquiries.findIndex((item) => item.id === id);
    if (index === -1) return false;
    store.inquiries.splice(index, 1);
    return true;
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
    coreMetrics: record.coreMetrics ? { ...record.coreMetrics } : undefined,
  };
}

// ─── Tickets ─────────────────────────────────────────────────────────────────

const mockTicketRepo: TicketRepo = {
  async list() {
    const store = getMockStore();
    return [...store.tickets].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
  async findById(id) {
    const store = getMockStore();
    return store.tickets.find((t) => t.id === id) || null;
  },
  async create(input) {
    const now = new Date().toISOString();
    const record: TicketRecord = {
      id: `tk-${Date.now()}`,
      title: input.title,
      description: input.description,
      type: input.type,
      status: "PENDING",
      reply: null,
      screenshots: input.screenshots ?? [],
      createdAt: now,
      updatedAt: now,
    };
    const store = getMockStore();
    store.tickets.unshift(record);
    return { ...record };
  },
  async update(id, input) {
    const store = getMockStore();
    const ticket = store.tickets.find((t) => t.id === id);
    if (!ticket) return null;

    if (input.status) ticket.status = input.status;
    if (input.reply !== undefined) ticket.reply = input.reply;
    ticket.updatedAt = new Date().toISOString();
    return { ...ticket };
  },
  async remove(id) {
    const store = getMockStore();
    const idx = store.tickets.findIndex((t) => t.id === id);
    if (idx < 0) return false;
    store.tickets.splice(idx, 1);
    return true;
  },
};

// ─── Products ────────────────────────────────────────────────────────────────

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
      enableTrustCards: input.enableTrustCards,
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
    if (typeof input.nameZh === "string") product.nameZh = input.nameZh;
    if (typeof input.nameEn === "string") product.nameEn = input.nameEn;
    if (typeof input.slug === "string") product.slug = input.slug;
    if (typeof input.category === "string") product.category = input.category;
    if (typeof input.summary === "string") product.summary = input.summary;
    if (typeof input.summaryZh === "string") product.summaryZh = input.summaryZh;
    if (typeof input.summaryEn === "string") product.summaryEn = input.summaryEn;
    if (typeof input.description === "string") product.description = input.description;
    
    if (Array.isArray(input.specs)) {
      product.specs = input.specs.map((spec) => ({ ...spec }));
    }
    if (input.coreMetrics !== undefined) {
      product.coreMetrics = input.coreMetrics ? { ...input.coreMetrics } : undefined;
    }
    if (typeof input.stockAmount === "number") product.stockAmount = input.stockAmount;
    if (typeof input.enableTrustCards === "boolean") product.enableTrustCards = input.enableTrustCards;

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

/* eslint-disable @typescript-eslint/no-require-imports */

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

export function getTicketRepo(): TicketRepo {
  if (isSupabaseConfigured()) {
    const { supabaseTicketRepo } = require("./supabase-repository") as typeof import("./supabase-repository");
    if (supabaseTicketRepo) return supabaseTicketRepo;
  }
  return mockTicketRepo;
}

// ─── Category mock + factory ─────────────────────────────────────────────────

const mockCategoryRepo: CategoryRepo = {
  async list() {
    const store = getMockStore();
    return [...store.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  },
  async findById(id) {
    const store = getMockStore();
    return store.categories.find((c) => c.id === id) ?? null;
  },
  async create(input) {
    const now = new Date().toISOString();
    const store = getMockStore();
    const maxOrder = store.categories.reduce((m, c) => Math.max(m, c.sortOrder), 0);
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
  async update(id, input) {
    const store = getMockStore();
    const item = store.categories.find((c) => c.id === id);
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
    const idx = store.categories.findIndex((c) => c.id === id);
    if (idx < 0) return false;
    store.categories.splice(idx, 1);
    return true;
  },
};

export function getCategoryRepo(): CategoryRepo {
  if (isSupabaseConfigured()) {
    const { supabaseCategoryRepo } = require("./supabase-repository") as typeof import("./supabase-repository");
    return supabaseCategoryRepo;
  }
  return mockCategoryRepo;
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

// ─── SiteSettings 站点全局配置 ─────────────────────────────────────────────

export interface SiteSettings {
  // 品牌标识
  siteName: string;           // 站点名称（浏览器标题）
  siteNameEn: string;         // 英文站点名称
  logoText: string;           // 导航栏 Logo 文字（中文）
  logoTextEn: string;         // 导航栏 Logo 文字（英文）
  logoImageUrl: string | null; // Logo 图片 URL（可选）
  
  // 联系信息
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactWhatsApp: string;
  contactAddress: string;
  contactAddressEn: string;
  
  // 社交媒体链接
  socialX: string;
  socialInstagram: string;
  socialFacebook: string;
  socialYoutube: string;
  socialTiktok: string;
  socialLinkedin: string;
  
  // 版权信息
  copyrightText: string;      // 版权文字（中文）
  copyrightTextEn: string;    // 版权文字（英文）
  copyrightUrl: string;       // 版权链接
  
  updatedAt: string;
}

export interface SiteSettingsRepo {
  get(): Promise<SiteSettings>;
  update(settings: Partial<Omit<SiteSettings, 'updatedAt'>>): Promise<SiteSettings>;
}

function isMissingSiteSettingsTableError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const maybeError = error as { code?: unknown; message?: unknown };
  return (
    maybeError.code === "PGRST205" &&
    typeof maybeError.message === "string" &&
    maybeError.message.includes("public.site_settings")
  );
}

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "KXTJ 重工机械",
  siteNameEn: "KXTJ Heavy Machinery",
  logoText: "中国机械",
  logoTextEn: "CHINA MACHINERY",
  logoImageUrl: null,
  contactName: "Jack Yin",
  contactPhone: "+86 17321077956",
  contactEmail: "15156888267@163.com",
  contactWhatsApp: "+86 15375319246",
  contactAddress: "中国上海市奉贤区金海路6055号",
  contactAddressEn: "No. 6055, Jinhai Rd, Fengxian District, Shanghai, China",
  socialX: "",
  socialInstagram: "",
  socialFacebook: "",
  socialYoutube: "",
  socialTiktok: "",
  socialLinkedin: "",
  copyrightText: "中国机械",
  copyrightTextEn: "CHINA MACHINERY",
  copyrightUrl: "WWW.ONESWO.COM",
  updatedAt: new Date().toISOString(),
};

// 扩展 MockStore
interface MockStoreWithSettings extends MockStore {
  siteSettings: SiteSettings;
}

function getMockStoreWithSettings(): MockStoreWithSettings {
  const store = getMockStore() as MockStoreWithSettings;
  if (!store.siteSettings) {
    store.siteSettings = { ...DEFAULT_SITE_SETTINGS };
  }
  return store;
}

// 本地文件持久化路径（开发环境，防止 dev server 重启后丢失数据）
const SETTINGS_FILE = (() => {
  try {
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
  } catch {
    // 读取失败时静默降级
  }
  return null;
}

function saveSettingsToFile(settings: SiteSettings) {
  if (!SETTINGS_FILE) return;
  try {
    const { writeFileSync } = require("fs") as typeof import("fs");
    writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
  } catch {
    // 写入失败时静默降级
  }
}

const mockSiteSettingsRepo: SiteSettingsRepo = {
  async get() {
    const fileSettings = loadSettingsFromFile();
    if (fileSettings) return fileSettings;
    const store = getMockStoreWithSettings();
    return { ...store.siteSettings };
  },
  async update(input) {
    const store = getMockStoreWithSettings();
    // 先用文件里的最新值作为基础，避免内存重置后覆盖
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

export function getSiteSettingsRepo(): SiteSettingsRepo {
  if (isSupabaseConfigured()) {
    const { supabaseSiteSettingsRepo } = require("./supabase-repository") as typeof import("./supabase-repository");
    return {
      async get() {
        try {
          return await supabaseSiteSettingsRepo.get();
        } catch (error) {
          if (isMissingSiteSettingsTableError(error)) {
            return mockSiteSettingsRepo.get();
          }
          throw error;
        }
      },
      async update(settings) {
        try {
          return await supabaseSiteSettingsRepo.update(settings);
        } catch (error) {
          if (isMissingSiteSettingsTableError(error)) {
            return mockSiteSettingsRepo.update(settings);
          }
          throw error;
        }
      },
    };
  }
  return mockSiteSettingsRepo;
}

/* eslint-enable @typescript-eslint/no-require-imports */

export { DEFAULT_SITE_SETTINGS };
