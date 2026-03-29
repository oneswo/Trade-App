import { getProductRepo } from "@/lib/data/repository";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const repo = getProductRepo();
  const product = await repo.findBySlug(slug);

  if (!product || product.status !== "PUBLISHED") {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  // 返回完整字段
  return Response.json({ ok: true, data: product });
}
