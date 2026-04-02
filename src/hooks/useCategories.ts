import { useState, useEffect } from "react";
import type { CategoryRecord } from "@/lib/data/repository";

export type { CategoryRecord };

let cachedCategories: CategoryRecord[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000;

export function clearCategoriesCache() {
  cachedCategories = null;
  cacheTimestamp = 0;
}

export function useCategories(initialCategories?: CategoryRecord[] | null) {
  // 使用 lazy initializer 直接从缓存初始化，避免在 effect 内同步 setState
  const [categories, setCategories] = useState<CategoryRecord[]>(() => {
    if (initialCategories) {
      return initialCategories;
    }
    if (cachedCategories && Date.now() - cacheTimestamp < CACHE_TTL) {
      return cachedCategories;
    }
    return [];
  });
  const [loading, setLoading] = useState(
    () => initialCategories == null && !(cachedCategories && Date.now() - cacheTimestamp < CACHE_TTL)
  );

  useEffect(() => {
    if (initialCategories) {
      cachedCategories = initialCategories;
      cacheTimestamp = Date.now();
      return;
    }
    if (cachedCategories && Date.now() - cacheTimestamp < CACHE_TTL) {
      return; // 已从缓存初始化，无需重新请求
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetch("/api/categories")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) {
          cachedCategories = json.data;
          cacheTimestamp = Date.now();
          setCategories(json.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [initialCategories]);

  return { categories, loading };
}
