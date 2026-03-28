"use client";
import { useState, useEffect, useCallback } from "react";
import { useLocale } from "next-intl";

/**
 * 从后台 API 加载指定页面的内容字段。
 * 返回 get(fieldName, fallback)：有已保存值则用已保存值，否则用 fallback。
 */
export function usePageContent(pageId: string) {
  const locale = useLocale();
  const [data, setData] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    fetch(`/api/page-content?pageId=${pageId}&locale=${locale}`)
      .then(r => r.json())
      .then(res => { if (res.ok && res.data) setData(res.data); })
      .catch(() => {});
  }, [pageId, locale]);

  const get = useCallback(
    (name: string, fallback: string): string => data?.[name] ?? fallback,
    [data]
  );

  return { get };
}
