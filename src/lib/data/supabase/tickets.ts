import type {
  CreateTicketInput,
  TicketRecord,
  TicketRepo,
  TicketStatus,
  TicketType,
  UpdateTicketInput,
} from "../types";
import { getClient, nowIso } from "./client";

function rowToTicket(r: Record<string, unknown>): TicketRecord {
  return {
    id: r.id as string,
    title: r.title as string,
    description: r.description as string,
    type: r.type as TicketType,
    status: r.status as TicketStatus,
    reply: (r.reply ?? null) as string | null,
    screenshots: Array.isArray(r.screenshots) ? (r.screenshots as string[]) : [],
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
    const id = `tkt_${crypto.randomUUID()}`;
    const now = nowIso();
    const { data, error } = await db
      .from("tickets")
      .insert({
        id,
        title: input.title,
        description: input.description,
        type: input.type,
        status: "PENDING",
        reply: null,
        screenshots: input.screenshots ?? [],
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
    if (error) return false;
    return true;
  },
};
