"use client";
import { useState, useEffect, useCallback } from "react";
import { useLocale } from "next-intl";

// 模块级内存缓存：页面切换期间共享，硬刷新后失效
const memCache = new Map<string, Record<string, string>>();
const INVALIDATION_KEY = "pc:invalidate";

function isSameRecord(
  left: Record<string, string> | null,
  right: Record<string, string> | null
) {
  if (left === right) return true;
  if (!left || !right) return false;

  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) return false;

  for (const key of leftKeys) {
    if (left[key] !== right[key]) return false;
  }
  return true;
}

function lsKey(cacheKey: string) {
  return `pc:${cacheKey}`;
}

function invalidatePayload(pageId: string, locale: string) {
  return JSON.stringify({ pageId, locale, ts: Date.now() });
}

function readLs(cacheKey: string): Record<string, string> | null {
  try {
    const raw = localStorage.getItem(lsKey(cacheKey));
    return raw ? (JSON.parse(raw) as Record<string, string>) : null;
  } catch { return null; }
}

function writeLs(cacheKey: string, data: Record<string, string>) {
  try { localStorage.setItem(lsKey(cacheKey), JSON.stringify(data)); } catch { /* quota exceeded */ }
}

export function clearPageContentCache(pageId: string, locale: string) {
  const cacheKey = `${pageId}:${locale}`;
  memCache.delete(cacheKey);
  try {
    localStorage.removeItem(lsKey(cacheKey));
    localStorage.setItem(INVALIDATION_KEY, invalidatePayload(pageId, locale));
  } catch {
    // ignore storage failures
  }
}

/**
 * 从后台 API 加载指定页面的内容字段。
 * 优先级：内存缓存 > localStorage > API（异步）
 * 硬刷新时跳过 localStorage 中间态，只在 API 返回后一次性更新，
 * 避免 fallback → localStorage → API 的三次闪烁。
 */
export function usePageContent(
  pageId: string,
  initialData?: Record<string, string> | null
) {
  const locale = useLocale();
  const cacheKey = `${pageId}:${locale}`;

  // 初始值只用内存缓存（避免 SSR/hydration 不一致）
  const [data, setData] = useState<Record<string, string> | null>(
    () => memCache.get(cacheKey) ?? initialData ?? null
  );
  const [isLoaded, setIsLoaded] = useState(
    () => memCache.has(cacheKey) || !!initialData
  );

  useEffect(() => {
    if (initialData) {
      memCache.set(cacheKey, initialData);
      writeLs(cacheKey, initialData);
    }

    const lsData = readLs(cacheKey);

    // 硬刷新后 memCache 丢失且无 initialData 时，立即用 localStorage 填充，
    // 避免 fallback 默认值闪烁（localStorage 读取是同步的，在 API 返回前生效）
    if (!initialData && !memCache.has(cacheKey) && lsData) {
      memCache.set(cacheKey, lsData);
      setData((prev) => (isSameRecord(prev, lsData) ? prev : lsData));
    }

    const controller = new AbortController();

    // 无论是否命中缓存，都异步拉取最新内容，避免后台更新后前台长期停留在旧值
    fetch(`/api/page-content?pageId=${pageId}&locale=${locale}`, { signal: controller.signal })
      .then(r => r.json())
      .then(res => {
        const d = (res.ok && res.data) ? res.data : {};
        memCache.set(cacheKey, d);
        writeLs(cacheKey, d);
        setData((prev) => (isSameRecord(prev, d) ? prev : d));
      })
      .catch((err) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        // API 失败时回退到 localStorage 缓存
        if (lsData) {
          memCache.set(cacheKey, lsData);
          setData((prev) => (isSameRecord(prev, lsData) ? prev : lsData));
        }
      })
      .finally(() => setIsLoaded(true));

    return () => controller.abort();
  }, [pageId, locale, cacheKey, initialData]);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== INVALIDATION_KEY || !event.newValue) return;
      try {
        const payload = JSON.parse(event.newValue) as {
          pageId?: string;
          locale?: string;
        };
        if (payload.pageId !== pageId || payload.locale !== locale) return;
        memCache.delete(cacheKey);
        fetch(`/api/page-content?pageId=${pageId}&locale=${locale}`)
          .then((r) => r.json())
          .then((res) => {
            const next = res.ok && res.data ? res.data : {};
            memCache.set(cacheKey, next);
            writeLs(cacheKey, next);
            setData((prev) => (isSameRecord(prev, next) ? prev : next));
            setIsLoaded(true);
          })
          .catch(() => {});
      } catch {
        // ignore malformed invalidation payload
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [cacheKey, locale, pageId]);

  const get = useCallback(
    (name: string, fallback: string): string => data?.[name] ?? fallback,
    [data]
  );

  return { get, isLoaded };
}
