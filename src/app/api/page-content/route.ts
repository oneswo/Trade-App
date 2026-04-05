import { revalidatePath } from "next/cache";
import { hasAdminSession } from "@/lib/auth/session";
import {
  isSupportedLocale,
  SUPPORTED_LOCALES,
} from "@/lib/i18n/locales";
import { getPageContentRepo } from "@/lib/data/repository";
import {
  markTranslationFieldsAsManual,
  readPageContentTranslationMeta,
  releaseTranslationFields,
  resolveTranslationTargets,
  stripInternalPageContentFields,
  writePageContentTranslationMeta,
} from "@/lib/admin/page-content-translation";
import { queuePageContentTranslationJob } from "@/lib/admin/page-content-translation-jobs";
import {
  collectPageContentMediaUrls,
  getFrontendPaths,
  getPageContentData,
  pickSharedMediaFields,
  sanitizePageContentData,
  syncSharedMediaFieldsToAllLocales,
  VALID_PAGE_IDS,
  type ValidPageId,
} from "@/lib/page-content";
import { deleteR2Objects, diffR2Urls } from "@/lib/storage/media-storage";

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
  const {
    pageId,
    locale,
    data,
    autoTranslateEnglish = false,
    translationSaveMode = "manual",
  } = body ?? {};

  if (!VALID_PAGE_IDS.includes(pageId as ValidPageId) || !isSupportedLocale(locale)) {
    return Response.json({ ok: false, error: "Invalid pageId or locale" }, { status: 400 });
  }
  if (!data || typeof data !== "object") {
    return Response.json({ ok: false, error: "data must be an object" }, { status: 400 });
  }

  const repo = getPageContentRepo();
  const localeKey = locale as (typeof SUPPORTED_LOCALES)[number];
  const cleanPayload = sanitizePageContentData(
    pageId as ValidPageId,
    stripInternalPageContentFields(data as Record<string, string>)
  );
  const oldCurrentRecord = await repo.get(pageId as ValidPageId, localeKey);
  let payload = cleanPayload;

  if (localeKey === "en") {
    const oldEnData = stripInternalPageContentFields(oldCurrentRecord?.data);
    const changedFields = Object.keys(cleanPayload).filter(
      (key) => (oldEnData[key] ?? "") !== (cleanPayload[key] ?? "")
    );
    const changedTranslationTargets = resolveTranslationTargets(
      pageId as ValidPageId,
      changedFields
    );
    const oldMeta = readPageContentTranslationMeta(oldCurrentRecord?.data);
    let nextMeta = oldMeta;

    if (translationSaveMode !== "auto") {
      const manualTargets = changedTranslationTargets.filter(
        ({ targetField }) => (cleanPayload[targetField] ?? "").trim() !== ""
      );
      const releasedTargets = changedTranslationTargets
        .filter(({ targetField }) => (cleanPayload[targetField] ?? "").trim() === "")
        .map(({ targetField }) => targetField);

      nextMeta = markTranslationFieldsAsManual(
        nextMeta,
        manualTargets,
        new Date().toISOString()
      );
      nextMeta = releaseTranslationFields(nextMeta, releasedTargets);
    }

    payload = writePageContentTranslationMeta(cleanPayload, nextMeta);
  }

  const sharedMediaFields = pickSharedMediaFields(cleanPayload);
  const oldRecords = await Promise.all(
    SUPPORTED_LOCALES.map((targetLocale) => repo.get(pageId as ValidPageId, targetLocale))
  );
  const oldUrls = oldRecords.flatMap((record) => collectPageContentMediaUrls(record?.data));

  const record = await repo.upsert(pageId, localeKey, payload);

  if (Object.keys(sharedMediaFields).length > 0) {
    await syncSharedMediaFieldsToAllLocales(
      pageId as ValidPageId,
      localeKey,
      sharedMediaFields
    );
  }

  const nextRecords = await Promise.all(
    SUPPORTED_LOCALES.map((targetLocale) => repo.get(pageId as ValidPageId, targetLocale))
  );
  const nextUrls = nextRecords.flatMap((nextRecord) =>
    collectPageContentMediaUrls(nextRecord?.data)
  );
  const staleUrls = diffR2Urls(oldUrls, nextUrls);
  if (staleUrls.length > 0) {
    await deleteR2Objects(staleUrls);
  }

  revalidatePath("/api/page-content");
  for (const path of getFrontendPaths(pageId as ValidPageId)) {
    revalidatePath(path);
  }

  let translationJob: Awaited<ReturnType<typeof queuePageContentTranslationJob>> | null = null;
  if (localeKey === "zh" && autoTranslateEnglish) {
    const oldZhData = stripInternalPageContentFields(oldCurrentRecord?.data);
    const changedSourceFields = Array.from(
      new Set([...Object.keys(oldZhData), ...Object.keys(cleanPayload)]).values()
    ).filter((key) => (oldZhData[key] ?? "") !== (cleanPayload[key] ?? ""));

    translationJob = await queuePageContentTranslationJob({
      pageId: pageId as ValidPageId,
      zhData: cleanPayload,
      changedSourceFields,
    });
  }

  return Response.json({
    ok: true,
    data: stripInternalPageContentFields(record.data),
    translationJob,
  });
}
