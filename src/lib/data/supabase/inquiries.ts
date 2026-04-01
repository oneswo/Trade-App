import type {
  CreateInquiryInput,
  InquiryRecord,
  InquiryRepo,
  InquiryStatus,
  UpdateInquiryInput,
} from "../types";
import { getClient, nowIso } from "./client";

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
    const { data, error } = await db
      .from("inquiries")
      .update({ is_read: true, updated_at: nowIso() })
      .eq("id", id)
      .select()
      .single();
    if (error || !data) return null;
    return rowToInquiry(data as Record<string, unknown>);
  },

  async update(id: string, input: UpdateInquiryInput) {
    const db = getClient();
    const patch: Record<string, unknown> = { updated_at: nowIso() };
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
