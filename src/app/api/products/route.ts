import { getProductRepo } from "@/lib/data/repository";

export async function GET() {
  const repo = getProductRepo();
  const products = await repo.list();

  const published = products.filter((item) => item.status === "PUBLISHED");

  return Response.json({
    ok: true,
    data: published.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      category: item.category,
      summary: item.summary,
      coverImageUrl: item.coverImageUrl,
      videoUrl: item.videoUrl,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
  });
}
