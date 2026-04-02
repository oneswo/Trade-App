import { z } from "zod";
import { hasAdminSession } from "@/lib/auth/session";
import { createPresignedUploadUrl, type MediaKind } from "@/lib/storage/media-storage";

export const runtime = "nodejs";

const IMAGE_MAX_SIZE = 8 * 1024 * 1024;
const VIDEO_MAX_SIZE = 80 * 1024 * 1024;

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

const bodySchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  fileSize: z.number().int().positive(),
  kind: z.enum(["image", "video"]),
});

function validateRequest(kind: MediaKind, fileType: string, fileSize: number) {
  if (kind === "image") {
    if (fileSize > IMAGE_MAX_SIZE) return "image_too_large";
    if (!IMAGE_TYPES.has(fileType)) return "invalid_image_type";
  } else {
    if (fileSize > VIDEO_MAX_SIZE) return "video_too_large";
    if (!VIDEO_TYPES.has(fileType)) return "invalid_video_type";
  }
  return null;
}

export async function POST(request: Request) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ ok: false, error: "invalid_params" }, { status: 400 });
    }

    const { fileName, fileType, fileSize, kind } = parsed.data;

    const validationError = validateRequest(kind, fileType, fileSize);
    if (validationError) {
      return Response.json({ ok: false, error: validationError }, { status: 400 });
    }

    const result = await createPresignedUploadUrl(fileName, fileType, kind);

    return Response.json({ ok: true, data: result });
  } catch (err) {
    console.error("[upload-url] Failed to create presigned URL:", err);
    return Response.json(
      { ok: false, error: "unexpected_error" },
      { status: 500 },
    );
  }
}
