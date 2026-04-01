import type {
  ArticleRecord,
  ArticleRepo,
  ArticleStatus,
  CreateArticleInput,
  UpdateArticleInput,
} from "../types";
import { getClient, nowIso } from "./client";

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
    let query = db
      .from("articles")
      .select()
      .order("published_at", { ascending: false });
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
      if (input.status === "PUBLISHED") patch.published_at = now;
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
