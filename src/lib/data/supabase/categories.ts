import type {
  CategoryRecord,
  CategoryRepo,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types";
import { getClient, nowIso } from "./client";

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
    if (error) {
      console.error("Supabase category list error:", error);
      throw error;
    }
    return (data as Record<string, unknown>[]).map(rowToCategory);
  },

  async findById(id: string) {
    const db = getClient();
    const { data, error } = await db
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Supabase category findById error:", error);
      if (!data) return null;
    }
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
    if (error) {
      console.error("Supabase category create error:", error);
      throw error;
    }
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
