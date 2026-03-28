import { z } from "zod";
import { hasAdminSession } from "@/lib/auth/session";
import { getArticleRepo } from "@/lib/data/repository";
import { deleteR2Objects } from "@/lib/storage/media-storage";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const patchSchema = z.object({
  title: z.string().trim().min(1).max(300).optional(),
  titleZh: z.string().trim().max(300).nullable().optional(),
  slug: z.string().trim().min(1).max(200).regex(/^[a-z0-9-]+$/).optional(),
  category: z.string().trim().min(1).max(80).optional(),
  summary: z.string().trim().min(1).max(600).optional(),
  summaryZh: z.string().trim().max(600).nullable().optional(),
  content: z.string().trim().min(1).optional(),
  contentZh: z.string().trim().nullable().optional(),
  coverImageUrl: z.string().trim().max(500).nullable().optional(),
  readTime: z.string().trim().max(40).nullable().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

export async function GET(request: Request, context: RouteContext) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const repo = getArticleRepo();
  const article = await repo.findById(id);

  if (!article) {
    return Response.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  return Response.json({ ok: true, data: article });
}

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

  const repo = getArticleRepo();
  const updated = await repo.update(id, parsed.data);

  if (!updated) {
    return Response.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  return Response.json({ ok: true, data: updated });
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const repo = getArticleRepo();
  const article = await repo.findById(id);

  if (!article) {
    return Response.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  const deleted = await repo.remove(id);
  if (!deleted) {
    return Response.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  // 同步清理 R2 封面图（若已配置 R2）
  await deleteR2Objects([article.coverImageUrl]);

  return Response.json({ ok: true });
}
