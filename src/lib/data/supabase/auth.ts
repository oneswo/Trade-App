import type { AdminAuthRepo, AdminRecord } from "../types";
import { getClient } from "./client";

export const supabaseAdminAuthRepo: AdminAuthRepo = {
  async findByIdentifier(identifier: string) {
    const db = getClient();
    const normalized = identifier.trim().toLowerCase();
    const { data, error } = await db
      .from("admins")
      .select()
      .eq("email", normalized)
      .single();
    if (error || !data) return null;
    const record = data as Record<string, unknown>;
    return {
      id: record.id as string,
      email: record.email as string,
      password: record.password as string,
      createdAt: record.created_at as string,
    } as AdminRecord;
  },
};
