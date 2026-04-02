import { z } from "zod";
import { hasAdminSession } from "@/lib/auth/session";
import { deleteR2Objects } from "@/lib/storage/media-storage";

export const runtime = "nodejs";

const bodySchema = z.object({
  urls: z.array(z.string().url()).min(1).max(20),
});

/**
 * 删除 R2 中的媒体文件
 * POST /api/admin/media/delete
 * Body: { urls: string[] }
 */
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

    const { urls } = parsed.data;

    // 过滤掉本地文件（以 / 开头但不是 http），只删除 R2 文件
    const r2Urls = urls.filter((url) => url.startsWith("http"));

    if (r2Urls.length > 0) {
      await deleteR2Objects(r2Urls);
    }

    return Response.json({ ok: true, deleted: r2Urls.length });
  } catch (err) {
    console.error("[media/delete] Failed to delete media:", err);
    return Response.json(
      { ok: false, error: "unexpected_error" },
      { status: 500 },
    );
  }
}
