import { createHash } from "crypto";
import type { ValidPageId } from "@/lib/page-content";

export const PAGE_CONTENT_TRANSLATION_META_KEY = "__translation_meta__";

export interface PageContentTranslationFieldMeta {
  managed: boolean;
  sourceField: string;
  sourceHash: string;
  updatedAt: string;
}

export interface PageContentTranslationMeta {
  version: 1;
  fields: Record<string, PageContentTranslationFieldMeta>;
}

export interface TranslationFieldPair {
  sourceField: string;
  targetField: string;
}

interface TranslationRule {
  source: string;
  target: string;
}

const SAME = (field: string): TranslationRule => ({ source: field, target: field });

const PAGE_TRANSLATION_RULES: Record<ValidPageId, TranslationRule[]> = {
  home: [
    SAME("hero.title1"),
    SAME("hero.titleGold"),
    { source: "hero.stat*.label", target: "hero.stat*.label" },
    SAME("categories.title"),
    SAME("categories.desc"),
    SAME("categories.emptyText"),
    SAME("hot.title"),
    SAME("hot.desc"),
    SAME("hot.btnText"),
    SAME("hot.inStockLabel"),
    SAME("hot.emptyText"),
    SAME("s5.title"),
    SAME("s5.desc"),
    { source: "s5.card.*.title", target: "s5.card.*.title" },
    { source: "s5.card.*.desc", target: "s5.card.*.desc" },
    SAME("s5.btnText"),
    SAME("news.title"),
    SAME("news.desc"),
    { source: "delivery.*.titleZh", target: "delivery.*.titleEn" },
  ],
  products: [
    SAME("filter.sidebarTitle"),
    SAME("filter.brandTitle"),
    SAME("filter.categoryTitle"),
    SAME("filter.yearTitle"),
    SAME("filter.loadingText"),
    SAME("filter.emptyText"),
    SAME("card.statusLabel"),
    SAME("card.viewDetailsBtn"),
  ],
  "product-detail": [
    SAME("breadcrumb.home"),
    SAME("breadcrumb.products"),
    SAME("gallery.noVideo"),
    SAME("gallery.stockLabel"),
    SAME("badge.sgs"),
    SAME("badge.loadTest"),
    SAME("badge.roRo"),
    SAME("coreSpecs.title"),
    SAME("cta.title"),
    SAME("cta.subtitle"),
    SAME("techWall.title"),
    SAME("techWall.subtitle"),
    SAME("techWall.disclaimer"),
  ],
  services: [
    SAME("matrix.title"),
    { source: "matrix.card.*.title", target: "matrix.card.*.title" },
    { source: "matrix.card.*.desc", target: "matrix.card.*.desc" },
    SAME("matrix.cta.title1"),
    SAME("matrix.cta.title2"),
    SAME("matrix.cta.desc"),
    SAME("matrix.cta.btn"),
    SAME("trust.title"),
    { source: "trust.*.title", target: "trust.*.title" },
    { source: "trust.*.desc", target: "trust.*.desc" },
    SAME("process.title"),
    { source: "process.*.title", target: "process.*.title" },
    { source: "process.*.desc", target: "process.*.desc" },
  ],
  about: [
    SAME("blockA.title"),
    SAME("blockA.p1"),
    SAME("blockA.p2"),
    SAME("blockA.check1"),
    SAME("blockA.check2"),
    SAME("blockB.title"),
    SAME("blockB.p1"),
    SAME("blockB.p2"),
    SAME("blockB.card1.title"),
    SAME("blockB.card1.desc"),
    SAME("blockB.card2.title"),
    SAME("blockB.card2.desc"),
    { source: "stats.*.label", target: "stats.*.label" },
    SAME("certs.title"),
    SAME("certs.desc"),
    { source: "cert.*.name", target: "cert.*.name" },
    { source: "cert.*.code", target: "cert.*.code" },
  ],
  contact: [
    SAME("info.hqTitle"),
    SAME("info.hqDesc"),
    SAME("info.addrTitle"),
    SAME("info.addrNote"),
    { source: "info.addrZh", target: "info.addrEn" },
    SAME("info.emailTitle"),
    SAME("info.phoneTitle"),
    SAME("info.supportNote"),
    SAME("info.hoursTitle"),
    SAME("info.hours"),
    SAME("team.sectionTitle"),
    SAME("team.sectionDesc"),
    { source: "team.*.name", target: "team.*.name" },
    { source: "team.*.title", target: "team.*.title" },
  ],
};

function createEmptyMeta(): PageContentTranslationMeta {
  return { version: 1, fields: {} };
}

function wildcardMatch(pattern: string, value: string) {
  let regexSource = "";
  for (const char of pattern) {
    if (char === "*") {
      regexSource += "(.*?)";
      continue;
    }
    if (/[$()*+.?[\\\]^{|}]/.test(char)) {
      regexSource += `\\${char}`;
      continue;
    }
    regexSource += char;
  }

  const match = value.match(new RegExp(`^${regexSource}$`));
  return match ? match.slice(1) : null;
}

function fillWildcardPattern(pattern: string, captures: string[]) {
  let index = 0;
  return pattern.replace(/\*/g, () => captures[index++] ?? "");
}

export function stripInternalPageContentFields(data: Record<string, string> | null | undefined) {
  if (!data) return {};
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => key !== PAGE_CONTENT_TRANSLATION_META_KEY)
  );
}

export function readPageContentTranslationMeta(
  data: Record<string, string> | null | undefined
): PageContentTranslationMeta {
  const raw = data?.[PAGE_CONTENT_TRANSLATION_META_KEY];
  if (!raw) return createEmptyMeta();

  try {
    const parsed = JSON.parse(raw) as Partial<PageContentTranslationMeta>;
    const fields = parsed.fields ?? {};
    return {
      version: 1,
      fields: Object.fromEntries(
        Object.entries(fields).filter(([, value]) => {
          return (
            !!value &&
            typeof value.sourceField === "string" &&
            typeof value.sourceHash === "string" &&
            typeof value.managed === "boolean" &&
            typeof value.updatedAt === "string"
          );
        })
      ),
    };
  } catch {
    return createEmptyMeta();
  }
}

export function writePageContentTranslationMeta(
  data: Record<string, string>,
  meta: PageContentTranslationMeta
) {
  const next = stripInternalPageContentFields(data);
  if (Object.keys(meta.fields).length === 0) {
    return next;
  }
  return {
    ...next,
    [PAGE_CONTENT_TRANSLATION_META_KEY]: JSON.stringify(meta),
  };
}

export function hashTranslationSource(value: string) {
  return createHash("sha1").update(value, "utf8").digest("hex");
}

export function resolveTranslationFieldPairs(
  pageId: ValidPageId,
  changedSourceFields: string[]
) {
  const pairs: TranslationFieldPair[] = [];
  const seen = new Set<string>();

  for (const sourceField of changedSourceFields) {
    for (const rule of PAGE_TRANSLATION_RULES[pageId] ?? []) {
      const captures = wildcardMatch(rule.source, sourceField);
      if (!captures) continue;

      const targetField = fillWildcardPattern(rule.target, captures);
      const key = `${sourceField}=>${targetField}`;
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push({ sourceField, targetField });
    }
  }

  return pairs;
}

export function resolveTranslationTargets(
  pageId: ValidPageId,
  changedTargetFields: string[]
) {
  const pairs: TranslationFieldPair[] = [];
  const seen = new Set<string>();

  for (const targetField of changedTargetFields) {
    for (const rule of PAGE_TRANSLATION_RULES[pageId] ?? []) {
      const captures = wildcardMatch(rule.target, targetField);
      if (!captures) continue;

      const sourceField = fillWildcardPattern(rule.source, captures);
      const key = `${sourceField}=>${targetField}`;
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push({ sourceField, targetField });
    }
  }

  return pairs;
}

export function markTranslationFieldsAsManual(
  meta: PageContentTranslationMeta,
  fields: TranslationFieldPair[],
  updatedAt: string
) {
  if (fields.length === 0) return meta;

  const nextMeta = createEmptyMeta();
  nextMeta.fields = { ...meta.fields };

  for (const field of fields) {
    const current = nextMeta.fields[field.targetField];
    nextMeta.fields[field.targetField] = {
      managed: false,
      sourceField: current?.sourceField ?? field.sourceField,
      sourceHash: current?.sourceHash ?? "",
      updatedAt,
    };
  }

  return nextMeta;
}

export function releaseTranslationFields(
  meta: PageContentTranslationMeta,
  targetFields: string[]
) {
  if (targetFields.length === 0) return meta;

  const nextMeta = createEmptyMeta();
  nextMeta.fields = { ...meta.fields };

  for (const targetField of targetFields) {
    delete nextMeta.fields[targetField];
  }

  return nextMeta;
}

export function markTranslationFieldAsManaged(
  meta: PageContentTranslationMeta,
  targetField: string,
  sourceField: string,
  sourceValue: string,
  updatedAt: string
) {
  const nextMeta = createEmptyMeta();
  nextMeta.fields = { ...meta.fields };
  nextMeta.fields[targetField] = {
    managed: true,
    sourceField,
    sourceHash: hashTranslationSource(sourceValue),
    updatedAt,
  };
  return nextMeta;
}

export function getManagedTranslationMeta(
  meta: PageContentTranslationMeta,
  targetField: string
) {
  return meta.fields[targetField] ?? null;
}
