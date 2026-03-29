import { z } from "zod";
import { hasAdminSession } from "@/lib/auth/session";
import { getProductRepo, type ProductRecord } from "@/lib/data/repository";

const STATUS_ENUM = z.enum(["DRAFT", "PUBLISHED"]);

const specSchema = z.object({
  key: z.string().trim().min(1).max(80),
  value: z.string().trim().min(1).max(200),
});

const mediaUrlSchema = z
  .string()
  .trim()
  .min(1)
  .max(500)
  .refine(
    (value) =>
      value.startsWith("/") ||
      value.startsWith("https://") ||
      value.startsWith("http://"),
    "invalid_media_url"
  );

const coreMetricsSchema = z.object({
  year: z.string().optional(),
  hours: z.string().optional(),
  tonnage: z.string().optional(),
  location: z.string().optional(),
  model: z.string().optional(),
  brand: z.string().optional(),
});

const createProductSchema = z.object({
  name: z.string().trim().min(2).max(140),
  nameZh: z.string().trim().max(140).optional(),
  nameEn: z.string().trim().max(140).optional(),
  slug: z.string().trim().max(140).optional().default(""), // Allow backend auto-generation
  category: z.string().trim().min(1).max(80),
  summary: z.string().trim().max(300).optional().default(""),
  summaryZh: z.string().trim().max(300).optional(),
  summaryEn: z.string().trim().max(300).optional(),
  description: z.string().trim().max(10000).optional().default(""),
  specs: z.array(specSchema).max(50).optional().default([]),
  coreMetrics: coreMetricsSchema.optional(),
  stockAmount: z.number().nonnegative().optional(),
  enableTrustCards: z.boolean().optional().default(true),
  coverImageUrl: mediaUrlSchema.nullable().optional(),
  galleryImageUrls: z.array(mediaUrlSchema).max(20).optional().default([]),
  videoUrl: mediaUrlSchema.nullable().optional(),
  status: STATUS_ENUM.optional().default("DRAFT"),
});

function normalizeSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeMediaList(urls: string[]) {
  const seen = new Set<string>();
  const list: string[] = [];

  for (const raw of urls) {
    const value = raw.trim();
    if (!value || seen.has(value)) continue;
    seen.add(value);
    list.push(value);
  }

  return list;
}

function toAdminProductListItem(product: ProductRecord) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    status: product.status,
    coverImageUrl: product.coverImageUrl,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export async function GET(request: Request) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const repo = getProductRepo();
  const products = await repo.list();

  return Response.json({
    ok: true,
    data: products.map(toAdminProductListItem),
  });
}

export async function POST(request: Request) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const raw = await request.json();
    const parsed = createProductSchema.safeParse(raw);

    if (!parsed.success) {
      return Response.json(
        {
          ok: false,
          error: "validation_failed",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const payload = parsed.data;
    // If slug is empty, auto-generate one based on name or timestamp
    let slug = normalizeSlug(payload.slug);
    if (!slug || slug.length < 2) {
      slug = normalizeSlug(payload.nameEn || payload.name) || `prod-${Date.now()}`;
    }

    const repo = getProductRepo();
    const existing = await repo.findBySlug(slug);

    if (existing) {
      // Append a random suffix to make it unique if auto-generated or duplicate
      slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
    }

    const galleryImageUrls = normalizeMediaList(payload.galleryImageUrls);
    const created = await repo.create({
      name: payload.name,
      nameZh: payload.nameZh,
      nameEn: payload.nameEn,
      slug,
      category: payload.category,
      summary: payload.summary,
      summaryZh: payload.summaryZh,
      summaryEn: payload.summaryEn,
      description: payload.description,
      specs: payload.specs,
      coreMetrics: payload.coreMetrics,
      stockAmount: payload.stockAmount,
      enableTrustCards: payload.enableTrustCards,
      coverImageUrl: payload.coverImageUrl ?? null,
      galleryImageUrls,
      videoUrl: payload.videoUrl ?? null,
      status: payload.status,
    });

    return Response.json({
      ok: true,
      data: created,
    });
  } catch {
    return Response.json(
      { ok: false, error: "unexpected_error" },
      { status: 500 }
    );
  }
}
