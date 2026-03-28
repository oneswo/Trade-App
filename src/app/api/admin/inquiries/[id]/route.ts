import { z } from "zod";
import { hasAdminSession } from "@/lib/auth/session";
import { getInquiryRepo } from "@/lib/data/repository";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const patchSchema = z.object({
  status: z.enum(["PENDING", "CONTACTED", "CLOSED"]).optional(),
  isRead: z.boolean().optional(),
});

export async function PATCH(request: Request, context: RouteContext) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const repo = getInquiryRepo();
  const updated = await repo.update(id, parsed.data);

  if (!updated) {
    return Response.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  return Response.json({ ok: true, data: updated });
}
