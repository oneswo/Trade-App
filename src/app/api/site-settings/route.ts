import { getSiteSettingsRepo } from "@/lib/data/repository";

// 公开 API - 前台获取站点配置（缓存 60 秒）
export const revalidate = 60;

export async function GET() {
  try {
    const repo = getSiteSettingsRepo();
    const settings = await repo.get();
    return Response.json({ ok: true, data: settings });
  } catch (error) {
    console.error("Failed to get site settings:", error);
    return Response.json({ ok: false, error: "Failed to get settings" }, { status: 500 });
  }
}
