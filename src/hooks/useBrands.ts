import { useState, useEffect } from "react";

let cachedBrands: string[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000;

export function useBrands() {
  const [brands, setBrands] = useState<string[]>(() => {
    if (cachedBrands && Date.now() - cacheTimestamp < CACHE_TTL) {
      return cachedBrands;
    }
    return [];
  });

  useEffect(() => {
    if (cachedBrands && Date.now() - cacheTimestamp < CACHE_TTL) return;
    fetch("/api/brands")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok && Array.isArray(json.data)) {
          cachedBrands = json.data;
          cacheTimestamp = Date.now();
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setBrands(json.data);
        }
      })
      .catch(() => {});
  }, []);

  return { brands };
}
