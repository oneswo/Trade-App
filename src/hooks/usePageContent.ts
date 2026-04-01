"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useLocale } from "next-intl";

// 模块级内存缓存：页面切换期间共享，硬刷新后失效
const memCache = new Map<string, Record<string, string>>();

function lsKey(cacheKey: string) {
  return `pc:${cacheKey}`;
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

/**
 * 从后台 API 加载指定页面的内容字段。
 * 优先级：内存缓存 > localStorage > API（异步）
 * 硬刷新时跳过 localStorage 中间态，只在 API 返回后一次性更新，
 * 避免 fallback → localStorage → API 的三次闪烁。
 */
export function usePageContent(pageId: string) {
  const locale = useLocale();
  const cacheKey = `${pageId}:${locale}`;

  // 初始值只用内存缓存（避免 SSR/hydration 不一致）
  const [data, setData] = useState<Record<string, string> | null>(
    () => memCache.get(cacheKey) ?? null
  );
  const [isLoaded, setIsLoaded] = useState(() => memCache.has(cacheKey));
  const fetchedRef = useRef(memCache.has(cacheKey));

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    // 读 localStorage 作为备用，但不立即 setState（避免中间态闪烁）
    const lsData = readLs(cacheKey);

    const controller = new AbortController();

    // 异步拉取最新内容，一次性更新
    fetch(`/api/page-content?pageId=${pageId}&locale=${locale}`, { signal: controller.signal })
      .then(r => r.json())
      .then(res => {
        const d = (res.ok && res.data) ? res.data : {};
        memCache.set(cacheKey, d);
        writeLs(cacheKey, d);
        setData(d);
      })
      .catch((err) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        // API 失败时回退到 localStorage 缓存
        if (lsData) {
          memCache.set(cacheKey, lsData);
          setData(lsData);
        }
      })
      .finally(() => setIsLoaded(true));

    return () => controller.abort();
  }, [pageId, locale, cacheKey]);

  const get = useCallback(
    (name: string, fallback: string): string => data?.[name] ?? fallback,
    [data]
  );

  return { get, isLoaded };
}
