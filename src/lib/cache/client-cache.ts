type CacheEntry<T> = {
  data: T;
  ts: number;
};

const cacheStore = new Map<string, CacheEntry<unknown>>();

export function readClientCache<T>(key: string, ttlMs: number): T | null {
  const item = cacheStore.get(key) as CacheEntry<T> | undefined;
  if (!item) return null;
  if (Date.now() - item.ts > ttlMs) return null;
  return item.data;
}

export function writeClientCache<T>(key: string, data: T) {
  cacheStore.set(key, { data, ts: Date.now() });
}

export function clearClientCache(key: string) {
  cacheStore.delete(key);
}
