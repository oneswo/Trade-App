"use client";

import { useEffect, useState } from "react";

export interface SiteSettings {
  siteName: string;
  siteNameEn: string;
  logoText: string;
  logoTextEn: string;
  logoImageUrl: string | null;
  enableInsights: boolean;
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
  enableInsights: true,
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

// 全局缓存
let cachedSettings: SiteSettings | null = null;
let fetchPromise: Promise<SiteSettings> | null = null;

async function fetchSiteSettings(): Promise<SiteSettings> {
  if (cachedSettings) return cachedSettings;
  
  if (fetchPromise) return fetchPromise;
  
  fetchPromise = fetch("/api/site-settings")
    .then((res) => res.json())
    .then((result) => {
      if (result.ok && result.data) {
        cachedSettings = result.data;
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
  const [settings, setSettings] = useState<SiteSettings>(cachedSettings || DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    if (cachedSettings) {
      setSettings(cachedSettings);
      setLoading(false);
      return;
    }

    fetchSiteSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  return { settings, loading };
}

export { DEFAULT_SETTINGS };
