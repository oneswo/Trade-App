import { getProductRepo } from "@/lib/data/repository";

export const runtime = "nodejs";

// 从已发布产品中提取最多 6 个唯一品牌（原始未本地化）
export async function GET() {
  try {
    const repo = getProductRepo();
    const products = await repo.list();

    const seen = new Set<string>();
    const brands: string[] = [];

    for (const p of products) {
      if (p.status !== "PUBLISHED") continue;
      const brand = p.coreMetrics?.brand?.trim();
      if (brand && !seen.has(brand)) {
        seen.add(brand);
        brands.push(brand);
        if (brands.length >= 6) break;
      }
    }

    return Response.json({ ok: true, data: brands });
  } catch {
    return Response.json({ ok: false, data: [] });
  }
}
