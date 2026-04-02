"use client";

import { useEffect, useState } from "react";

export interface SiteSettings {
  siteName: string;
  siteNameEn: string;
  logoText: string;
  logoTextEn: string;
  logoImageUrl: string | null;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactWhatsApp: string;
  contactAddress: string;
  contactAddressEn: string;
  copyrightText: string;
  copyrightTextEn: string;
  copyrightUrl: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "海沃克斯",
  siteNameEn: "Heavox — Heavy Power, Global Trust",
  logoText: "海沃克斯",
  logoTextEn: "Heavox",
  logoImageUrl: null,
  contactName: "Andy",
  contactPhone: "+86 13866668888",
  contactEmail: "Andy@163.com",
  contactWhatsApp: "+86 13866668888",
  contactAddress: "中国上海市黄浦江边",
  contactAddressEn: "Huangpu River, Shanghai, China",
  copyrightText: "海沃克斯",
  copyrightTextEn: "CHINA MACHINERY",
  copyrightUrl: "www.heavox.com",
};

// 全局缓存（30 秒 TTL，避免管理员保存后前台长期看不到变化）
let cachedSettings: SiteSettings | null = null;
let cacheTimestamp = 0;
let fetchPromise: Promise<SiteSettings> | null = null;
const CACHE_TTL = 30_000;
const SETTINGS_CHANNEL = "site-settings";
const SETTINGS_UPDATED_EVENT = "site-settings-updated";

function resetSettingsCache() {
  cachedSettings = null;
  cacheTimestamp = 0;
  fetchPromise = null;
}

async function fetchSiteSettings(bustCache = false): Promise<SiteSettings> {
  const now = Date.now();
  if (!bustCache && cachedSettings && now - cacheTimestamp < CACHE_TTL) return cachedSettings;

  if (fetchPromise) return fetchPromise;

  // bustCache 时加时间戳绕过浏览器缓存和 Next.js ISR 缓存
  const url = bustCache
    ? `/api/site-settings?_t=${Date.now()}`
    : "/api/site-settings";

  fetchPromise = fetch(url, bustCache ? { cache: "no-store" } : undefined)
    .then((res) => res.json())
    .then((result) => {
      if (result.ok && result.data) {
        cachedSettings = result.data;
        cacheTimestamp = Date.now();
        return result.data;
      }
      return DEFAULT_SETTINGS;
    })
    .catch(() => DEFAULT_SETTINGS)
    .finally(() => {
      fetchPromise = null;
    });

  return fetchPromise;
}

export function useSiteSettings(initialData?: SiteSettings | null) {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    if (initialData) return initialData;
    if (cachedSettings && Date.now() - cacheTimestamp < CACHE_TTL) return cachedSettings;
    return initialData ?? DEFAULT_SETTINGS;
  });
  const [loading, setLoading] = useState(
    () => !(cachedSettings && Date.now() - cacheTimestamp < CACHE_TTL) && !initialData
  );

  useEffect(() => {
    if (!initialData) return;
    cachedSettings = initialData;
    cacheTimestamp = Date.now();
  }, [initialData]);

  useEffect(() => {
    if (cachedSettings && Date.now() - cacheTimestamp < CACHE_TTL) {
      return;
    }
    fetchSiteSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  // 监听跨 Tab 广播，admin 保存后立即更新已挂载的组件
  useEffect(() => {
    const refreshSettings = () => {
      resetSettingsCache();
      setLoading(true);
      fetchSiteSettings(true).then((data) => {
        setSettings(data);
        setLoading(false);
      });
    };

    let channel: BroadcastChannel | undefined;
    const handleSamePageUpdate = () => refreshSettings();

    if (typeof window !== "undefined") {
      window.addEventListener(SETTINGS_UPDATED_EVENT, handleSamePageUpdate);
    }

    try {
      channel = new BroadcastChannel(SETTINGS_CHANNEL);
      channel.onmessage = () => refreshSettings();
    } catch {
      // 不支持 BroadcastChannel 的环境（如 SSR）静默降级
    }

    return () => {
      channel?.close();
      if (typeof window !== "undefined") {
        window.removeEventListener(SETTINGS_UPDATED_EVENT, handleSamePageUpdate);
      }
    };
  }, []);

  return { settings, loading };
}

export function clearSettingsCache() {
  resetSettingsCache();
  // 通知所有同源 Tab（含当前 Tab）缓存已失效，触发即时重取
  try {
    const ch = new BroadcastChannel(SETTINGS_CHANNEL);
    ch.postMessage({ type: 'updated' });
    ch.close();
  } catch {
    // SSR 或不支持时静默降级
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SETTINGS_UPDATED_EVENT));
  }
}

export { DEFAULT_SETTINGS };
