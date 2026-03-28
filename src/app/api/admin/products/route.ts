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

const createProductSchema = z.object({
  name: z.string().trim().min(2).max(140),
  slug: z.string().trim().min(1).max(140),
  category: z.string().trim().min(1).max(80),
  summary: z.string().trim().max(300).optional().default(""),
  description: z.string().trim().max(10000).optional().default(""),
  specs: z.array(specSchema).max(20).optional().default([]),
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
    const slug = normalizeSlug(payload.slug);

    if (slug.length < 2) {
      return Response.json(
        { ok: false, error: "invalid_slug" },
        { status: 400 }
      );
    }

    const repo = getProductRepo();
    const existing = await repo.findBySlug(slug);

    if (existing) {
      return Response.json(
        { ok: false, error: "slug_exists" },
        { status: 409 }
      );
    }

    const galleryImageUrls = normalizeMediaList(payload.galleryImageUrls);
    const created = await repo.create({
      name: payload.name,
      slug,
      category: payload.category,
      summary: payload.summary,
      description: payload.description,
      specs: payload.specs,
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
