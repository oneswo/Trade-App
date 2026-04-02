import type {
  CreateProductInput,
  ProductRecord,
  ProductRepo,
  UpdateProductInput,
} from "../types";
import { getClient, nowIso } from "./client";

function rowToProduct(r: Record<string, unknown>): ProductRecord {
  return {
    id: r.id as string,
    name: r.name as string,
    nameZh: (r.name_zh ?? undefined) as string | undefined,
    nameEn: (r.name_en ?? undefined) as string | undefined,
    slug: r.slug as string,
    category: r.category as string,
    summary: r.summary as string,
    summaryZh: (r.summary_zh ?? undefined) as string | undefined,
    summaryEn: (r.summary_en ?? undefined) as string | undefined,
    description: r.description as string,
    specs: (r.specs ?? []) as { key: string; value: string }[],
    coreMetrics: (r.core_metrics ?? undefined) as ProductRecord["coreMetrics"],
    stockAmount: (r.stock_amount ?? undefined) as number | undefined,
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
        name_zh: input.nameZh ?? null,
        name_en: input.nameEn ?? null,
        slug: input.slug,
        category: input.category,
        summary: input.summary,
        summary_zh: input.summaryZh ?? null,
        summary_en: input.summaryEn ?? null,
        description: input.description,
        specs: input.specs ?? [],
        core_metrics: input.coreMetrics ?? null,
        stock_amount: input.stockAmount ?? null,
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
    const patch: Record<string, unknown> = { updated_at: nowIso() };
    if (input.name !== undefined) patch.name = input.name;
    if (input.nameZh !== undefined) patch.name_zh = input.nameZh;
    if (input.nameEn !== undefined) patch.name_en = input.nameEn;
    if (input.slug !== undefined) patch.slug = input.slug;
    if (input.category !== undefined) patch.category = input.category;
    if (input.summary !== undefined) patch.summary = input.summary;
    if (input.summaryZh !== undefined) patch.summary_zh = input.summaryZh;
    if (input.summaryEn !== undefined) patch.summary_en = input.summaryEn;
    if (input.description !== undefined) patch.description = input.description;
    if (input.specs !== undefined) patch.specs = input.specs;
    if (input.coreMetrics !== undefined) patch.core_metrics = input.coreMetrics;
    if (input.stockAmount !== undefined) patch.stock_amount = input.stockAmount;
    if (input.galleryImageUrls !== undefined) {
      patch.gallery_image_urls = input.galleryImageUrls;
    }
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
