import { getArticleRepo } from "@/lib/data/repository";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const repo = getArticleRepo();
  const article = await repo.findBySlug(slug);

  if (!article || article.status !== "PUBLISHED") {
    return Response.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  return Response.json({ ok: true, data: article });
}
