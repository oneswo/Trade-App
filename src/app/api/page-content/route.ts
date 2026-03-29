import { getPageContentRepo } from "@/lib/data/repository";
import { hasAdminSession } from "@/lib/auth/session";

const VALID_PAGES = ["home", "products", "services", "about", "insights", "contact"];
const VALID_LOCALES = ["zh", "en"];

// GET /api/page-content?pageId=home&locale=zh
export async function GET(req: Request) {
  const url = new URL(req.url);
  const pageId = url.searchParams.get("pageId") ?? "";
  const locale = url.searchParams.get("locale") ?? "";

  if (!VALID_PAGES.includes(pageId) || !VALID_LOCALES.includes(locale)) {
    return Response.json({ ok: false, error: "Invalid pageId or locale" }, { status: 400 });
  }

  const repo = getPageContentRepo();
  const record = await repo.get(pageId, locale);

  return Response.json({ ok: true, data: record?.data ?? null });
}

// POST /api/page-content  body: { pageId, locale, data }
export async function POST(req: Request) {
  if (!hasAdminSession(req)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { pageId, locale, data } = body ?? {};

  if (!VALID_PAGES.includes(pageId) || !VALID_LOCALES.includes(locale)) {
    return Response.json({ ok: false, error: "Invalid pageId or locale" }, { status: 400 });
  }
  if (!data || typeof data !== "object") {
    return Response.json({ ok: false, error: "data must be an object" }, { status: 400 });
  }

  const repo = getPageContentRepo();
  const record = await repo.upsert(pageId, locale, data as Record<string, string>);

  return Response.json({ ok: true, data: record.data });
}
