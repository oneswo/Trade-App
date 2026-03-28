import { getArticleRepo } from "@/lib/data/repository";

export async function GET() {
  const repo = getArticleRepo();
  const articles = await repo.list("PUBLISHED");
  return Response.json({ ok: true, data: articles });
}
