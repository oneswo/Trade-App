import { z } from "zod";
import { hasAdminSession } from "@/lib/auth/session";
import { getArticleRepo } from "@/lib/data/repository";

const createSchema = z.object({
  title: z.string().trim().min(1).max(300),
  titleZh: z.string().trim().max(300).nullable().optional(),
  slug: z.string().trim().min(1).max(200).regex(/^[a-z0-9-]+$/),
  category: z.string().trim().min(1).max(80),
  summary: z.string().trim().min(1).max(600),
  summaryZh: z.string().trim().max(600).nullable().optional(),
  content: z.string().trim().min(1),
  contentZh: z.string().trim().nullable().optional(),
  coverImageUrl: z.string().trim().max(500).nullable().optional(),
  readTime: z.string().trim().max(40).nullable().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

export async function GET(request: Request) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const repo = getArticleRepo();
  const articles = await repo.list();
  return Response.json({ ok: true, data: articles });
}

export async function POST(request: Request) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const repo = getArticleRepo();

  const existing = await repo.findBySlug(parsed.data.slug);
  if (existing) {
    return Response.json(
      { ok: false, error: "Slug already exists" },
      { status: 409 }
    );
  }

  const article = await repo.create(parsed.data);
  return Response.json({ ok: true, data: article }, { status: 201 });
}
