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
  socialX: string;
  socialInstagram: string;
  socialFacebook: string;
  socialYoutube: string;
  socialTiktok: string;
  socialLinkedin: string;
  copyrightText: string;
  copyrightTextEn: string;
  copyrightUrl: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "KXTJ 重工机械",
  siteNameEn: "KXTJ Heavy Machinery",
  logoText: "中国机械",
  logoTextEn: "CHINA MACHINERY",
  logoImageUrl: null,
  contactName: "Jack Yin",
  contactPhone: "+86 17321077956",
  contactEmail: "15156888267@163.com",
  contactWhatsApp: "+86 15375319246",
  contactAddress: "中国上海市奉贤区金海路6055号",
  contactAddressEn: "No. 6055, Jinhai Rd, Fengxian District, Shanghai, China",
  socialX: "",
  socialInstagram: "",
  socialFacebook: "",
  socialYoutube: "",
  socialTiktok: "",
  socialLinkedin: "",
  copyrightText: "中国机械",
  copyrightTextEn: "CHINA MACHINERY",
  copyrightUrl: "WWW.ONESWO.COM",
};

// 全局缓存（30 秒 TTL，避免管理员保存后前台长期看不到变化）
let cachedSettings: SiteSettings | null = null;
let cacheTimestamp = 0;
let fetchPromise: Promise<SiteSettings> | null = null;
const CACHE_TTL = 30_000;

async function fetchSiteSettings(): Promise<SiteSettings> {
  const now = Date.now();
  if (cachedSettings && now - cacheTimestamp < CACHE_TTL) return cachedSettings;

  if (fetchPromise) return fetchPromise;
  
  fetchPromise = fetch("/api/site-settings")
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

export function useSiteSettings() {
  // 使用 lazy initializer 直接从缓存初始化，避免在 effect 内同步 setState
  const [settings, setSettings] = useState<SiteSettings>(() => {
    if (cachedSettings && Date.now() - cacheTimestamp < CACHE_TTL) return cachedSettings;
    return DEFAULT_SETTINGS;
  });
  const [loading, setLoading] = useState(
    () => !(cachedSettings && Date.now() - cacheTimestamp < CACHE_TTL)
  );

  useEffect(() => {
    if (cachedSettings && Date.now() - cacheTimestamp < CACHE_TTL) {
      return; // 已从缓存初始化，无需重新请求
    }
    fetchSiteSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  return { settings, loading };
}

export function clearSettingsCache() {
  cachedSettings = null;
  cacheTimestamp = 0;
  fetchPromise = null;
}

export { DEFAULT_SETTINGS };
