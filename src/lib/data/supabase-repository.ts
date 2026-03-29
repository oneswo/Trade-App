/**
 * Supabase Repository 实现
 * 当 SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY 环境变量存在时，
 * getXxxRepo() 会自动返回此处的实现，替代内存 mock。
 *
 * 使用前需先在 Supabase SQL 编辑器运行 docs/supabase-schema.sql 建表。
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  AdminAuthRepo,
  AdminRecord,
  ArticleRecord,
  ArticleRepo,
  ArticleStatus,
  CategoryRecord,
  CategoryRepo,
  CreateArticleInput,
  CreateCategoryInput,
  CreateInquiryInput,
  CreateProductInput,
  CreateTicketInput,
  InquiryRecord,
  InquiryRepo,
  InquiryStatus,
  PageContentRepo,
  ProductRecord,
  ProductRepo,
  SiteSettings,
  SiteSettingsRepo,
  TicketRecord,
  TicketRepo,
  TicketStatus,
  TicketType,
  UpdateArticleInput,
  UpdateCategoryInput,
  UpdateInquiryInput,
  UpdateProductInput,
  UpdateTicketInput,
} from "./repository";
import { DEFAULT_SITE_SETTINGS } from "./repository";

// ─── 客户端单例 ────────────────────────────────────────────────

let _supabase: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _supabase;
}

// ─── 辅助函数 ─────────────────────────────────────────────────

function nowIso() {
  return new Date().toISOString();
}

// ─── InquiryRepo ─────────────────────────────────────────────

function rowToInquiry(r: Record<string, unknown>): InquiryRecord {
  return {
    id: r.id as string,
    name: r.name as string,
    email: (r.email ?? null) as string | null,
    phone: (r.phone ?? null) as string | null,
    message: r.message as string,
    locale: r.locale as string,
    source: (r.source ?? null) as string | null,
    pagePath: (r.page_path ?? null) as string | null,
    isRead: Boolean(r.is_read),
    status: (r.status ?? "PENDING") as InquiryStatus,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export const supabaseInquiryRepo: InquiryRepo = {
  async create(input: CreateInquiryInput) {
    const db = getClient();
    const now = nowIso();
    const id = `inq_${crypto.randomUUID()}`;
    const { data, error } = await db
      .from("inquiries")
      .insert({
        id,
        name: input.name,
        email: input.email,
        phone: input.phone,
        message: input.message,
        locale: input.locale,
        source: input.source ?? null,
        page_path: input.pagePath ?? null,
        is_read: false,
        status: "PENDING",
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToInquiry(data as Record<string, unknown>);
  },

  async list() {
    const db = getClient();
    const { data, error } = await db
      .from("inquiries")
      .select()
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as Record<string, unknown>[]).map(rowToInquiry);
  },

  async markRead(id: string) {
    const db = getClient();
    const now = nowIso();
    const { data, error } = await db
      .from("inquiries")
      .update({ is_read: true, updated_at: now })
      .eq("id", id)
      .select()
      .single();
    if (error || !data) return null;
    return rowToInquiry(data as Record<string, unknown>);
  },

  async update(id: string, input: UpdateInquiryInput) {
    const db = getClient();
    const now = nowIso();
    const patch: Record<string, unknown> = { updated_at: now };
    if (input.status !== undefined) patch.status = input.status;
    if (input.isRead !== undefined) patch.is_read = input.isRead;
    const { data, error } = await db
      .from("inquiries")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error || !data) return null;
    return rowToInquiry(data as Record<string, unknown>);
  },

  async remove(id: string) {
    const db = getClient();
    const { error } = await db.from("inquiries").delete().eq("id", id);
    return !error;
  },
};

// ─── AdminAuthRepo ────────────────────────────────────────────

export const supabaseAdminAuthRepo: AdminAuthRepo = {
  async findByEmail(email: string) {
    const db = getClient();
    const { data, error } = await db
      .from("admins")
      .select()
      .eq("email", email)
      .single();
    if (error || !data) return null;
    const r = data as Record<string, unknown>;
    return {
      id: r.id as string,
      email: r.email as string,
      password: r.password as string,
      createdAt: r.created_at as string,
    } as AdminRecord;
  },
};

// ─── ProductRepo ─────────────────────────────────────────────

function rowToProduct(r: Record<string, unknown>): ProductRecord {
  return {
    id: r.id as string,
    name: r.name as string,
    slug: r.slug as string,
    category: r.category as string,
    summary: r.summary as string,
    description: r.description as string,
    specs: (r.specs ?? []) as { key: string; value: string }[],
    coverImageUrl: (r.cover_image_url ?? null) as string | null,
    galleryImageUrls: (r.gallery_image_urls ?? []) as string[],
    videoUrl: (r.video_url ?? null) as string | null,
    status: r.status as "DRAFT" | "PUBLISHED",
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export const supabaseProductRepo: ProductRepo = {
  async list() {
    const db = getClient();
    const { data, error } = await db
      .from("products")
      .select()
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as Record<string, unknown>[]).map(rowToProduct);
  },

  async findById(id: string) {
    const db = getClient();
    const { data, error } = await db
      .from("products")
      .select()
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return rowToProduct(data as Record<string, unknown>);
  },

  async findBySlug(slug: string) {
    const db = getClient();
    const { data, error } = await db
      .from("products")
      .select()
      .eq("slug", slug.trim().toLowerCase())
      .single();
    if (error || !data) return null;
    return rowToProduct(data as Record<string, unknown>);
  },

  async create(input: CreateProductInput) {
    const db = getClient();
    const now = nowIso();
    const id = `prod_${crypto.randomUUID()}`;
    const { data, error } = await db
      .from("products")
      .insert({
        id,
        name: input.name,
        slug: input.slug,
        category: input.category,
        summary: input.summary,
        description: input.description,
        specs: input.specs ?? [],
        cover_image_url: input.coverImageUrl ?? null,
        gallery_image_urls: input.galleryImageUrls ?? [],
        video_url: input.videoUrl ?? null,
        status: input.status ?? "DRAFT",
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToProduct(data as Record<string, unknown>);
  },

  async update(id: string, input: UpdateProductInput) {
    const db = getClient();
    const now = nowIso();
    const patch: Record<string, unknown> = { updated_at: now };
    if (input.name !== undefined) patch.name = input.name;
    if (input.slug !== undefined) patch.slug = input.slug;
    if (input.category !== undefined) patch.category = input.category;
    if (input.summary !== undefined) patch.summary = input.summary;
    if (input.description !== undefined) patch.description = input.description;
    if (input.specs !== undefined) patch.specs = input.specs;
    if (input.galleryImageUrls !== undefined) patch.gallery_image_urls = input.galleryImageUrls;
    if ("coverImageUrl" in input) patch.cover_image_url = input.coverImageUrl ?? null;
    if ("videoUrl" in input) patch.video_url = input.videoUrl ?? null;
    if (input.status !== undefined) patch.status = input.status;
    const { data, error } = await db
      .from("products")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error || !data) return null;
    return rowToProduct(data as Record<string, unknown>);
  },

  async remove(id: string) {
    const db = getClient();
    const { error } = await db.from("products").delete().eq("id", id);
    return !error;
  },
};

// ─── ArticleRepo ─────────────────────────────────────────────

function rowToArticle(r: Record<string, unknown>): ArticleRecord {
  return {
    id: r.id as string,
    title: r.title as string,
    titleZh: (r.title_zh ?? null) as string | null,
    slug: r.slug as string,
    category: r.category as string,
    summary: r.summary as string,
    summaryZh: (r.summary_zh ?? null) as string | null,
    content: r.content as string,
    contentZh: (r.content_zh ?? null) as string | null,
    coverImageUrl: (r.cover_image_url ?? null) as string | null,
    readTime: (r.read_time ?? null) as string | null,
    status: r.status as ArticleStatus,
    publishedAt: (r.published_at ?? null) as string | null,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export const supabaseArticleRepo: ArticleRepo = {
  async list(statusFilter?: ArticleStatus) {
    const db = getClient();
    let query = db.from("articles").select().order("published_at", { ascending: false });
    if (statusFilter) query = query.eq("status", statusFilter);
    const { data, error } = await query;
    if (error) throw error;
    return (data as Record<string, unknown>[]).map(rowToArticle);
  },

  async findById(id: string) {
    const db = getClient();
    const { data, error } = await db
      .from("articles")
      .select()
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return rowToArticle(data as Record<string, unknown>);
  },

  async findBySlug(slug: string) {
    const db = getClient();
    const { data, error } = await db
      .from("articles")
      .select()
      .eq("slug", slug.trim().toLowerCase())
      .single();
    if (error || !data) return null;
    return rowToArticle(data as Record<string, unknown>);
  },

  async create(input: CreateArticleInput) {
    const db = getClient();
    const now = nowIso();
    const id = `art_${crypto.randomUUID()}`;
    const isPublished = input.status === "PUBLISHED";
    const { data, error } = await db
      .from("articles")
      .insert({
        id,
        title: input.title,
        title_zh: input.titleZh ?? null,
        slug: input.slug,
        category: input.category,
        summary: input.summary,
        summary_zh: input.summaryZh ?? null,
        content: input.content,
        content_zh: input.contentZh ?? null,
        cover_image_url: input.coverImageUrl ?? null,
        read_time: input.readTime ?? null,
        status: input.status ?? "DRAFT",
        published_at: isPublished ? now : null,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToArticle(data as Record<string, unknown>);
  },

  async update(id: string, input: UpdateArticleInput) {
    const db = getClient();
    const now = nowIso();
    const patch: Record<string, unknown> = { updated_at: now };
    if (input.title !== undefined) patch.title = input.title;
    if (input.titleZh !== undefined) patch.title_zh = input.titleZh;
    if (input.slug !== undefined) patch.slug = input.slug;
    if (input.category !== undefined) patch.category = input.category;
    if (input.summary !== undefined) patch.summary = input.summary;
    if (input.summaryZh !== undefined) patch.summary_zh = input.summaryZh;
    if (input.content !== undefined) patch.content = input.content;
    if (input.contentZh !== undefined) patch.content_zh = input.contentZh;
    if ("coverImageUrl" in input) patch.cover_image_url = input.coverImageUrl ?? null;
    if (input.readTime !== undefined) patch.read_time = input.readTime;
    if (input.status !== undefined) {
      patch.status = input.status;
      if (input.status === "PUBLISHED") {
        patch.published_at = now;
      }
    }
    const { data, error } = await db
      .from("articles")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error || !data) return null;
    return rowToArticle(data as Record<string, unknown>);
  },

  async remove(id: string) {
    const db = getClient();
    const { error } = await db.from("articles").delete().eq("id", id);
    return !error;
  },
};

// ─── PageContentRepo ─────────────────────────────────────────────────────────

export const supabasePageContentRepo: PageContentRepo = {
  async get(pageId: string, locale: string) {
    const db = getClient();
    const { data, error } = await db
      .from("page_contents")
      .select("*")
      .eq("page_id", pageId)
      .eq("locale", locale)
      .single();
    if (error || !data) return null;
    const r = data as Record<string, unknown>;
    return {
      pageId: r.page_id as string,
      locale: r.locale as string,
      data: (r.data ?? {}) as Record<string, string>,
      updatedAt: r.updated_at as string,
    };
  },

  async upsert(pageId: string, locale: string, fields: Record<string, string>) {
    const db = getClient();
    const now = new Date().toISOString();
    const { data, error } = await db
      .from("page_contents")
      .upsert(
        { page_id: pageId, locale, data: fields, updated_at: now },
        { onConflict: "page_id,locale" }
      )
      .select()
      .single();
    if (error || !data) throw new Error(error?.message ?? "upsert failed");
    const r = data as Record<string, unknown>;
    return {
      pageId: r.page_id as string,
      locale: r.locale as string,
      data: (r.data ?? {}) as Record<string, string>,
      updatedAt: r.updated_at as string,
    };
  },
};

// ─── SiteSettingsRepo ─────────────────────────────────────────────

function rowToSiteSettings(r: Record<string, unknown>): SiteSettings {
  return {
    siteName: (r.site_name as string) || DEFAULT_SITE_SETTINGS.siteName,
    siteNameEn: (r.site_name_en as string) || DEFAULT_SITE_SETTINGS.siteNameEn,
    logoText: (r.logo_text as string) || DEFAULT_SITE_SETTINGS.logoText,
    logoTextEn: (r.logo_text_en as string) || DEFAULT_SITE_SETTINGS.logoTextEn,
    logoImageUrl: (r.logo_image_url as string | null) ?? null,
    contactName: (r.contact_name as string) || DEFAULT_SITE_SETTINGS.contactName,
    contactPhone: (r.contact_phone as string) || DEFAULT_SITE_SETTINGS.contactPhone,
    contactEmail: (r.contact_email as string) || DEFAULT_SITE_SETTINGS.contactEmail,
    contactWhatsApp: (r.contact_whatsapp as string) || DEFAULT_SITE_SETTINGS.contactWhatsApp,
    contactAddress: (r.contact_address as string) || DEFAULT_SITE_SETTINGS.contactAddress,
    contactAddressEn: (r.contact_address_en as string) || DEFAULT_SITE_SETTINGS.contactAddressEn,
    socialX: (r.social_x as string) || "",
    socialInstagram: (r.social_instagram as string) || "",
    socialFacebook: (r.social_facebook as string) || "",
    socialYoutube: (r.social_youtube as string) || "",
    socialTiktok: (r.social_tiktok as string) || "",
    socialLinkedin: (r.social_linkedin as string) || "",
    copyrightText: (r.copyright_text as string) || DEFAULT_SITE_SETTINGS.copyrightText,
    copyrightTextEn: (r.copyright_text_en as string) || DEFAULT_SITE_SETTINGS.copyrightTextEn,
    copyrightUrl: (r.copyright_url as string) || DEFAULT_SITE_SETTINGS.copyrightUrl,
    updatedAt: (r.updated_at as string) || new Date().toISOString(),
  };
}

export const supabaseSiteSettingsRepo: SiteSettingsRepo = {
  async get() {
    const db = getClient();
    const { data, error } = await db
      .from("site_settings")
      .select("*")
      .eq("id", "default")
      .single();
    
    if (error || !data) {
      // 如果不存在，返回默认配置
      return { ...DEFAULT_SITE_SETTINGS };
    }
    return rowToSiteSettings(data as Record<string, unknown>);
  },

  async update(input) {
    const db = getClient();
    const now = new Date().toISOString();
    
    const patch: Record<string, unknown> = { updated_at: now };
    if (input.siteName !== undefined) patch.site_name = input.siteName;
    if (input.siteNameEn !== undefined) patch.site_name_en = input.siteNameEn;
    if (input.logoText !== undefined) patch.logo_text = input.logoText;
    if (input.logoTextEn !== undefined) patch.logo_text_en = input.logoTextEn;
    if (input.logoImageUrl !== undefined) patch.logo_image_url = input.logoImageUrl;
    if (input.contactName !== undefined) patch.contact_name = input.contactName;
    if (input.contactPhone !== undefined) patch.contact_phone = input.contactPhone;
    if (input.contactEmail !== undefined) patch.contact_email = input.contactEmail;
    if (input.contactWhatsApp !== undefined) patch.contact_whatsapp = input.contactWhatsApp;
    if (input.contactAddress !== undefined) patch.contact_address = input.contactAddress;
    if (input.contactAddressEn !== undefined) patch.contact_address_en = input.contactAddressEn;
    if (input.socialX !== undefined) patch.social_x = input.socialX;
    if (input.socialInstagram !== undefined) patch.social_instagram = input.socialInstagram;
    if (input.socialFacebook !== undefined) patch.social_facebook = input.socialFacebook;
    if (input.socialYoutube !== undefined) patch.social_youtube = input.socialYoutube;
    if (input.socialTiktok !== undefined) patch.social_tiktok = input.socialTiktok;
    if (input.socialLinkedin !== undefined) patch.social_linkedin = input.socialLinkedin;
    if (input.copyrightText !== undefined) patch.copyright_text = input.copyrightText;
    if (input.copyrightTextEn !== undefined) patch.copyright_text_en = input.copyrightTextEn;
    if (input.copyrightUrl !== undefined) patch.copyright_url = input.copyrightUrl;

    const { data, error } = await db
      .from("site_settings")
      .upsert(
        { id: "default", ...patch },
        { onConflict: "id" }
      )
      .select()
      .single();
    
    if (error) throw error;
    return rowToSiteSettings(data as Record<string, unknown>);
  },
};

// ─── CategoryRepo ─────────────────────────────────────────────

function rowToCategory(r: Record<string, unknown>): CategoryRecord {
  return {
    id: r.id as string,
    slug: r.slug as string,
    nameZh: (r.name_zh ?? "") as string,
    nameEn: (r.name_en ?? "") as string,
    imageUrl: (r.image_url ?? null) as string | null,
    sortOrder: (r.sort_order ?? 0) as number,
    enabled: Boolean(r.enabled),
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export const supabaseCategoryRepo: CategoryRepo = {
  async list() {
    const db = getClient();
    const { data, error } = await db
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data as Record<string, unknown>[]).map(rowToCategory);
  },

  async findById(id: string) {
    const db = getClient();
    const { data, error } = await db
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return rowToCategory(data as Record<string, unknown>);
  },

  async create(input: CreateCategoryInput) {
    const db = getClient();
    const now = nowIso();
    const { data, error } = await db
      .from("categories")
      .insert({
        id: `cat_${crypto.randomUUID()}`,
        slug: input.slug,
        name_zh: input.nameZh,
        name_en: input.nameEn,
        image_url: input.imageUrl ?? null,
        sort_order: input.sortOrder ?? 99,
        enabled: input.enabled ?? true,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToCategory(data as Record<string, unknown>);
  },

  async update(id: string, input: UpdateCategoryInput) {
    const db = getClient();
    const patch: Record<string, unknown> = { updated_at: nowIso() };
    if (input.slug !== undefined) patch.slug = input.slug;
    if (input.nameZh !== undefined) patch.name_zh = input.nameZh;
    if (input.nameEn !== undefined) patch.name_en = input.nameEn;
    if ("imageUrl" in input) patch.image_url = input.imageUrl ?? null;
    if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;
    if (input.enabled !== undefined) patch.enabled = input.enabled;
    const { data, error } = await db
      .from("categories")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error || !data) return null;
    return rowToCategory(data as Record<string, unknown>);
  },

  async remove(id: string) {
    const db = getClient();
    const { error } = await db.from("categories").delete().eq("id", id);
    return !error;
  },
};

// ─── TicketRepo ───────────────────────────────────────────────

function rowToTicket(r: Record<string, unknown>): TicketRecord {
  return {
    id: r.id as string,
    title: r.title as string,
    description: r.description as string,
    type: r.type as TicketType,
    status: r.status as TicketStatus,
    reply: (r.reply ?? null) as string | null,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export const supabaseTicketRepo: TicketRepo = {
  async list() {
    const db = getClient();
    const { data, error } = await db
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as Record<string, unknown>[]).map(rowToTicket);
  },

  async findById(id: string) {
    const db = getClient();
    const { data, error } = await db
      .from("tickets")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return rowToTicket(data as Record<string, unknown>);
  },

  async create(input: CreateTicketInput) {
    const db = getClient();
    const now = nowIso();
    const { data, error } = await db
      .from("tickets")
      .insert({
        title: input.title,
        description: input.description,
        type: input.type,
        status: "PENDING",
        reply: null,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToTicket(data as Record<string, unknown>);
  },

  async update(id: string, input: UpdateTicketInput) {
    const db = getClient();
    const patch: Record<string, unknown> = { updated_at: nowIso() };
    if (input.status !== undefined) patch.status = input.status;
    if (input.reply !== undefined) patch.reply = input.reply;

    const { data, error } = await db
      .from("tickets")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error || !data) return null;
    return rowToTicket(data as Record<string, unknown>);
  },

  async remove(id: string) {
    const db = getClient();
    const { error } = await db.from("tickets").delete().eq("id", id);
    return !error;
  },
};
