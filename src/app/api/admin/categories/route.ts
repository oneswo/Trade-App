import { hasAdminSession } from "@/lib/auth/session";
import { getProductRepo } from "@/lib/data/repository";

export interface CategoryStat {
  name: string;
  total: number;
  published: number;
  draft: number;
}

/**
 * GET /api/admin/categories
 * 返回从产品中派生的分类列表（含统计数据）。
 * 上线接 Supabase 后自动使用真实数据。
 */
export async function GET(request: Request) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const repo = getProductRepo();
  const products = await repo.list();

  const map = new Map<string, CategoryStat>();
  for (const p of products) {
    const cat = p.category.trim();
    if (!cat) continue;
    const existing = map.get(cat) ?? { name: cat, total: 0, published: 0, draft: 0 };
    existing.total += 1;
    if (p.status === "PUBLISHED") existing.published += 1;
    else existing.draft += 1;
    map.set(cat, existing);
  }

  const data = Array.from(map.values()).sort((a, b) =>
    b.total - a.total
  );

  return Response.json({ ok: true, data });
}
