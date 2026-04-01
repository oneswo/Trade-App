import type { PageContentRepo } from "../types";
import { getClient } from "./client";

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
    const record = data as Record<string, unknown>;
    return {
      pageId: record.page_id as string,
      locale: record.locale as string,
      data: (record.data ?? {}) as Record<string, string>,
      updatedAt: record.updated_at as string,
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
    const record = data as Record<string, unknown>;
    return {
      pageId: record.page_id as string,
      locale: record.locale as string,
      data: (record.data ?? {}) as Record<string, string>,
      updatedAt: record.updated_at as string,
    };
  },
};
