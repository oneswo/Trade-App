import { getSiteSettingsRepo } from "@/lib/data/repository";

// 公开 API - 交给客户端 hook 自己做短 TTL，避免后台保存后前台仍命中旧配置

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
