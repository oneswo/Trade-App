import { revalidatePath } from "next/cache";
import { hasAdminSession } from "@/lib/auth/session";
import {
  DEFAULT_LOCALE,
  isSupportedLocale,
  SUPPORTED_LOCALES,
} from "@/lib/i18n/locales";
import { getPageContentRepo } from "@/lib/data/repository";
import {
  getPageContentData,
  pickSharedMediaFields,
  syncSharedMediaFieldsToAllLocales,
  VALID_PAGE_IDS,
  type ValidPageId,
} from "@/lib/page-content";

const PAGE_PATH_SUFFIX: Record<ValidPageId, string> = {
  home: "",
  products: "/products",
  "product-detail": "/products",
  services: "/services",
  about: "/about",
  insights: "/insights",
  contact: "/contact",
};

function getFrontendPaths(pageId: ValidPageId) {
  const suffix = PAGE_PATH_SUFFIX[pageId];
  return SUPPORTED_LOCALES.map((locale) => {
    if (locale === DEFAULT_LOCALE) {
      return suffix || "/";
    }
    return suffix ? `/${locale}${suffix}` : `/${locale}`;
  });
}

// GET /api/page-content?pageId=home&locale=zh
export async function GET(req: Request) {
  const url = new URL(req.url);
  const pageId = url.searchParams.get("pageId") ?? "";
  const locale = url.searchParams.get("locale") ?? "";

  if (!VALID_PAGE_IDS.includes(pageId as ValidPageId) || !isSupportedLocale(locale)) {
    return Response.json({ ok: false, error: "Invalid pageId or locale" }, { status: 400 });
  }

  const data = await getPageContentData(pageId as ValidPageId, locale);
  return Response.json({ ok: true, data: Object.keys(data).length > 0 ? data : null });
}

// POST /api/page-content  body: { pageId, locale, data }
export async function POST(req: Request) {
  if (!hasAdminSession(req)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { pageId, locale, data } = body ?? {};

  if (!VALID_PAGE_IDS.includes(pageId as ValidPageId) || !isSupportedLocale(locale)) {
    return Response.json({ ok: false, error: "Invalid pageId or locale" }, { status: 400 });
  }
  if (!data || typeof data !== "object") {
    return Response.json({ ok: false, error: "data must be an object" }, { status: 400 });
  }

  const repo = getPageContentRepo();
  const payload = data as Record<string, string>;
  const sharedMediaFields = pickSharedMediaFields(payload);

  const record = await repo.upsert(pageId, locale, payload);

  if (Object.keys(sharedMediaFields).length > 0) {
    await syncSharedMediaFieldsToAllLocales(
      pageId as ValidPageId,
      locale,
      sharedMediaFields
    );
  }

  revalidatePath("/api/page-content");
  for (const path of getFrontendPaths(pageId as ValidPageId)) {
    revalidatePath(path);
  }

  return Response.json({ ok: true, data: record.data });
}
