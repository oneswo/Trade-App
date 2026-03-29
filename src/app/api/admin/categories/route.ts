import { z } from "zod";
import { hasAdminSession } from "@/lib/auth/session";
import { getCategoryRepo } from "@/lib/data/repository";

const createSchema = z.object({
  slug: z.string().min(1),
  nameZh: z.string().min(1),
  nameEn: z.string().min(1),
  imageUrl: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  enabled: z.boolean().optional(),
});

const updateSchema = createSchema.partial().extend({
  id: z.string().min(1),
});

function auth(request: Request) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(request: Request) {
  const deny = auth(request);
  if (deny) return deny;
  try {
    const repo = getCategoryRepo();
    const data = await repo.list();
    return Response.json({ ok: true, data });
  } catch {
    return Response.json({ ok: false, error: "unexpected_error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const deny = auth(request);
  if (deny) return deny;
  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ ok: false, error: "invalid_input", detail: parsed.error.flatten() }, { status: 400 });
    }
    const repo = getCategoryRepo();
    const data = await repo.create(parsed.data);
    return Response.json({ ok: true, data }, { status: 201 });
  } catch {
    return Response.json({ ok: false, error: "unexpected_error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const deny = auth(request);
  if (deny) return deny;
  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ ok: false, error: "invalid_input", detail: parsed.error.flatten() }, { status: 400 });
    }
    const { id, ...input } = parsed.data;
    const repo = getCategoryRepo();
    const data = await repo.update(id, input);
    if (!data) return Response.json({ ok: false, error: "not_found" }, { status: 404 });
    return Response.json({ ok: true, data });
  } catch {
    return Response.json({ ok: false, error: "unexpected_error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const deny = auth(request);
  if (deny) return deny;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return Response.json({ ok: false, error: "id_required" }, { status: 400 });
    const repo = getCategoryRepo();
    const ok = await repo.remove(id);
    if (!ok) return Response.json({ ok: false, error: "not_found" }, { status: 404 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "unexpected_error" }, { status: 500 });
  }
}
