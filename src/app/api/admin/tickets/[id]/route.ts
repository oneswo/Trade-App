import { z } from "zod";
import { hasAdminSession } from "@/lib/auth/session";
import { getTicketRepo } from "@/lib/data/repository";

const STATUS_ENUM = z.enum(["PENDING", "PROCESSING", "RESOLVED"]);

const updateTicketSchema = z.object({
  status: STATUS_ENUM.optional(),
  reply: z.string().nullable().optional(),
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteContext) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const raw = await request.json();
    const parsed = updateTicketSchema.safeParse(raw);

    if (!parsed.success) {
      return Response.json(
        { ok: false, error: "validation_failed" },
        { status: 400 }
      );
    }

    const { id } = await params;
    const repo = getTicketRepo();
    const updated = await repo.update(id, parsed.data);

    if (!updated) {
      return Response.json({ ok: false, error: "not_found" }, { status: 404 });
    }

    return Response.json({ ok: true, data: updated });
  } catch {
    return Response.json(
      { ok: false, error: "unexpected_error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const repo = getTicketRepo();
  const removed = await repo.remove(id);

  if (!removed) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  return Response.json({ ok: true });
}
