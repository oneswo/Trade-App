import { z } from "zod";
import { hasAdminSession } from "@/lib/auth/session";
import { getProductRepo } from "@/lib/data/repository";
import { deleteR2Objects } from "@/lib/storage/media-storage";
import { PRODUCT_MEDIA_SLOT_COUNT } from "@/lib/products/media";
import {
  buildLegacyProductMediaSlots,
  normalizeProductMediaSlots,
} from "@/lib/products/media";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const STATUS_ENUM = z.enum(["DRAFT", "PUBLISHED"]);

const specSchema = z.object({
  key: z.string().trim().min(1).max(80),
  value: z.string().trim().min(1).max(200),
  keyZh: z.string().trim().max(80).optional(),
  keyEn: z.string().trim().max(80).optional(),
  valueZh: z.string().trim().max(200).optional(),
  valueEn: z.string().trim().max(200).optional(),
});

const coreMetricValuesSchema = z.object({
  year: z.string().optional(),
  hours: z.string().optional(),
  tonnage: z.string().optional(),
  location: z.string().optional(),
  model: z.string().optional(),
  brand: z.string().optional(),
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
  i18n: z.object({
    zh: coreMetricValuesSchema.optional(),
    en: coreMetricValuesSchema.optional(),
    descriptionZh: z.string().max(10000).optional(),
    descriptionEn: z.string().max(10000).optional(),
  }).optional(),
  mediaSlots: z
    .array(
      z.object({
        url: z.string().trim().max(500).default(""),
        type: z.enum(["image", "video", ""]).default(""),
      })
    )
    .max(PRODUCT_MEDIA_SLOT_COUNT)
    .optional(),
});

const updateProductSchema = z.object({
  name: z.string().trim().min(2).max(140).optional(),
  nameZh: z.string().trim().max(140).optional(),
  nameEn: z.string().trim().max(140).optional(),
  slug: z.string().trim().min(1).max(140).optional(),
  category: z.string().trim().min(1).max(80).optional(),
  summary: z.string().trim().max(300).optional(),
  summaryZh: z.string().trim().max(300).optional(),
  summaryEn: z.string().trim().max(300).optional(),
  description: z.string().trim().max(10000).optional(),
  specs: z.array(specSchema).max(50).optional(),
  coreMetrics: coreMetricsSchema.optional(),
  stockAmount: z.number().nonnegative().optional(),
  coverImageUrl: mediaUrlSchema.nullable().optional(),
  galleryImageUrls: z.array(mediaUrlSchema).max(20).optional(),
  videoUrl: mediaUrlSchema.nullable().optional(),
  status: STATUS_ENUM.optional(),
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

function collectMediaRefs(input: {
  coreMetrics?: {
    mediaSlots?: Array<{ url?: string; type?: "image" | "video" | "" }>;
  };
  coverImageUrl: string | null;
  videoUrl: string | null;
  galleryImageUrls: string[];
}) {
  const refs = new Set<string>();
  const slots =
    input.coreMetrics?.mediaSlots && input.coreMetrics.mediaSlots.length > 0
      ? normalizeProductMediaSlots(input.coreMetrics.mediaSlots)
      : buildLegacyProductMediaSlots({
          coverImageUrl: input.coverImageUrl,
          videoUrl: input.videoUrl,
          galleryImageUrls: input.galleryImageUrls,
        });

  for (const slot of slots) {
    if (slot.url) {
      refs.add(slot.url);
    }
  }
  return refs;
}

export async function GET(request: Request, context: RouteContext) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const repo = getProductRepo();
  const product = await repo.findById(id);

  if (!product) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  return Response.json({ ok: true, data: product });
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const raw = await request.json();
    const parsed = updateProductSchema.safeParse(raw);

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

    const updates = parsed.data;
    if (Object.keys(updates).length === 0) {
      return Response.json({ ok: false, error: "empty_update" }, { status: 400 });
    }

    const repo = getProductRepo();
    const current = await repo.findById(id);

    if (!current) {
      return Response.json({ ok: false, error: "not_found" }, { status: 404 });
    }

    if (typeof updates.slug === "string") {
      const normalized = normalizeSlug(updates.slug);
      if (normalized.length < 2) {
        return Response.json(
          { ok: false, error: "invalid_slug" },
          { status: 400 }
        );
      }

      const existing = await repo.findBySlug(normalized);
      if (existing && existing.id !== id) {
        return Response.json(
          { ok: false, error: "slug_exists" },
          { status: 409 }
        );
      }

      updates.slug = normalized;
    }

    if (Array.isArray(updates.galleryImageUrls)) {
      updates.galleryImageUrls = normalizeMediaList(updates.galleryImageUrls);
    }

    const oldRefs = collectMediaRefs({
      coreMetrics: current.coreMetrics,
      coverImageUrl: current.coverImageUrl,
      videoUrl: current.videoUrl,
      galleryImageUrls: current.galleryImageUrls,
    });

    const updated = await repo.update(id, updates);

    if (!updated) {
      return Response.json({ ok: false, error: "not_found" }, { status: 404 });
    }

    const nextRefs = collectMediaRefs({
      coreMetrics: updated.coreMetrics,
      coverImageUrl: updated.coverImageUrl,
      videoUrl: updated.videoUrl,
      galleryImageUrls: updated.galleryImageUrls,
    });
    const staleRefs = [...oldRefs].filter((url) => !nextRefs.has(url));
    if (staleRefs.length > 0) {
      await deleteR2Objects(staleRefs);
    }

    return Response.json({ ok: true, data: updated });
  } catch {
    return Response.json(
      { ok: false, error: "unexpected_error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const repo = getProductRepo();
  const product = await repo.findById(id);

  if (!product) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const removed = await repo.remove(id);
  if (!removed) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  // 同步清理 R2 文件（若已配置 R2）
  await deleteR2Objects([
    ...collectMediaRefs({
      coreMetrics: product.coreMetrics,
      coverImageUrl: product.coverImageUrl,
      videoUrl: product.videoUrl,
      galleryImageUrls: product.galleryImageUrls,
    }),
  ]);

  return Response.json({ ok: true });
}
