import { z } from "zod";
import { hasAdminSession } from "@/lib/auth/session";
import { getProductRepo } from "@/lib/data/repository";

interface RouteContext {
  params: Promise<{ id: string }>;
}

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

const updateProductSchema = z.object({
  name: z.string().trim().min(2).max(140).optional(),
  slug: z.string().trim().min(1).max(140).optional(),
  category: z.string().trim().min(1).max(80).optional(),
  summary: z.string().trim().max(300).optional(),
  description: z.string().trim().max(10000).optional(),
  specs: z.array(specSchema).max(20).optional(),
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

    const updated = await repo.update(id, updates);

    if (!updated) {
      return Response.json({ ok: false, error: "not_found" }, { status: 404 });
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
  const removed = await repo.remove(id);

  if (!removed) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  return Response.json({ ok: true });
}
