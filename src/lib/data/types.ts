import type { ProductMediaSlot } from "@/lib/products/media";

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
  findByIdentifier(identifier: string): Promise<AdminRecord | null>;
}

export type ProductStatus = "DRAFT" | "PUBLISHED";

export interface ProductSpec {
  key: string;
  value: string;
}

export interface ProductRecord {
  id: string;
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
  coreMetrics?: {
    year?: string;
    hours?: string;
    tonnage?: string;
    location?: string;
    model?: string;
    brand?: string;
    mediaSlots?: ProductMediaSlot[];
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

export interface CategoryRecord {
  id: string;
  slug: string;
  nameZh: string;
  nameEn: string;
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

export interface PageContentRecord {
  pageId: string;
  locale: string;
  data: Record<string, string>;
  updatedAt: string;
}

export interface PageContentRepo {
  get(pageId: string, locale: string): Promise<PageContentRecord | null>;
  upsert(
    pageId: string,
    locale: string,
    data: Record<string, string>
  ): Promise<PageContentRecord>;
}

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

export interface SiteSettings {
  siteName: string;
  siteNameEn: string;
  logoText: string;
  logoTextEn: string;
  logoImageUrl: string | null;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactWhatsApp: string;
  contactAddress: string;
  contactAddressEn: string;
  copyrightText: string;
  copyrightTextEn: string;
  copyrightUrl: string;
  updatedAt: string;
}

export interface SiteSettingsRepo {
  get(): Promise<SiteSettings>;
  update(
    settings: Partial<Omit<SiteSettings, "updatedAt">>
  ): Promise<SiteSettings>;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "海沃克斯",
  siteNameEn: "Heavox — Heavy Power, Global Trust",
  logoText: "海沃克斯",
  logoTextEn: "Heavox",
  logoImageUrl: null,
  contactName: "Andy",
  contactPhone: "+86 13866668888",
  contactEmail: "Andy@163.com",
  contactWhatsApp: "+86 13866668888",
  contactAddress: "中国上海市黄浦江边",
  contactAddressEn: "Huangpu River, Shanghai, China",
  copyrightText: "海沃克斯",
  copyrightTextEn: "CHINA MACHINERY",
  copyrightUrl: "www.heavox.com",
  updatedAt: new Date().toISOString(),
};
