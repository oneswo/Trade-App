import { z } from "zod";
import { hasAdminSession } from "@/lib/auth/session";
import { getMediaStorage, type MediaKind } from "@/lib/storage/media-storage";

export const runtime = "nodejs";

const kindSchema = z.enum(["image", "video"]);

const IMAGE_MAX_SIZE = 8 * 1024 * 1024;
const VIDEO_MAX_SIZE = 80 * 1024 * 1024;

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

function validateFile(file: File, kind: MediaKind) {
  if (file.size <= 0) {
    return { ok: false as const, error: "empty_file" };
  }

  if (kind === "image") {
    if (file.size > IMAGE_MAX_SIZE) {
      return { ok: false as const, error: "image_too_large" };
    }
    if (!IMAGE_TYPES.has(file.type)) {
      return { ok: false as const, error: "invalid_image_type" };
    }
    return { ok: true as const };
  }

  if (file.size > VIDEO_MAX_SIZE) {
    return { ok: false as const, error: "video_too_large" };
  }

  if (!VIDEO_TYPES.has(file.type)) {
    return { ok: false as const, error: "invalid_video_type" };
  }

  return { ok: true as const };
}

export async function POST(request: Request) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const kindValue = formData.get("kind");
    const kindParsed = kindSchema.safeParse(kindValue);

    if (!kindParsed.success) {
      return Response.json({ ok: false, error: "invalid_kind" }, { status: 400 });
    }

    const fileValue = formData.get("file");

    if (!(fileValue instanceof File)) {
      return Response.json(
        { ok: false, error: "file_required" },
        { status: 400 }
      );
    }

    const validation = validateFile(fileValue, kindParsed.data);
    if (!validation.ok) {
      return Response.json(
        { ok: false, error: validation.error },
        { status: 400 }
      );
    }

    const storage = getMediaStorage();
    const uploaded = await storage.upload(fileValue, kindParsed.data);

    return Response.json({ ok: true, data: uploaded });
  } catch {
    return Response.json(
      { ok: false, error: "unexpected_error" },
      { status: 500 }
    );
  }
}
