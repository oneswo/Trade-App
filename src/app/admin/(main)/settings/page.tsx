"use client";

import { useState, useEffect, useRef } from "react";
import {
  Save,
  Image as ImageIcon,
  Phone,
  Globe2,
  Link2,
  Mail,
  MapPin,
  User,
  MessageCircle,
  Loader2,
  Check,
  Copyright,
} from "lucide-react";
import { clearSettingsCache } from "@/hooks/useSiteSettings";

interface SiteSettings {
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

function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13.5px] text-[#b48600] font-bold mt-2 mb-3 leading-relaxed bg-[#D4AF37]/10 px-3.5 py-2.5 rounded-lg border border-[#D4AF37]/20 inline-block shadow-sm">
      <span className="mr-1.5">💡</span>
      {children}
    </p>
  );
}

const LANG_TABS = [
  { key: "zh", label: "中文" },
  { key: "en", label: "English" },
];

const LANG_FIELDS: Record<string, {
  siteName: keyof SiteSettings;
  logoText: keyof SiteSettings;
  contactAddress: keyof SiteSettings;
  copyrightText: keyof SiteSettings;
}> = {
  zh: {
    siteName: "siteName",
    logoText: "logoText",
    contactAddress: "contactAddress",
    copyrightText: "copyrightText",
  },
  en: {
    siteName: "siteNameEn",
    logoText: "logoTextEn",
    contactAddress: "contactAddressEn",
    copyrightText: "copyrightTextEn",
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("zh");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", "image");
      const res = await fetch("/api/admin/uploads", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const result = await res.json();
      if (result.ok && result.data?.url) {
        updateField("logoImageUrl", result.data.url);
      }
    } catch (err) {
      console.error(err);
      alert("上传失败，请重试");
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((result) => {
        if (result.ok && result.data) setSettings(result.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const result = await res.json();
      if (result.ok) {
        clearSettingsCache();
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex h-96 items-center justify-center text-gray-500">
        加载配置失败
      </div>
    );
  }

  const langFields = LANG_FIELDS[activeTab];

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      
      {/* 顶部语言切换悬浮区 */}
      <div className="flex items-center justify-between bg-white px-8 py-6 rounded-xl border border-black/[0.06] shadow-sm mb-8 z-10 sticky top-0 backdrop-blur-md bg-white/95">
        <div className="flex items-center gap-4">
          <h1 className="text-base font-bold text-[#111111] flex items-center gap-2 shrink-0">
            <Globe2 size={18} className="text-[#111111]/40" />
            当前内容编辑语言
          </h1>
          <div className="hidden lg:flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-2.5 rounded-lg shadow-sm">
            <span className="text-[#D4AF37] text-[14px]">💡</span>
            <span className="text-[13.5px] font-bold tracking-wide text-[#b48600] whitespace-nowrap">
              → 带 <span className="text-[#D4AF37] mx-[2px] inline-block -translate-y-[1px]">🌐</span> 的项需切语言分别填写；不带 🌐 的为全局通用项，只需填一次
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-[#FAFAFA] border border-black/[0.06] p-1.5 rounded-lg shrink-0">
          {LANG_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-1.5 text-[13px] font-bold tracking-wider rounded-md transition-all ${
                activeTab === tab.key
                  ? "bg-[#111111] text-white shadow-sm"
                  : "text-[#111111]/50 hover:text-[#111111] hover:bg-black/[0.04]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">

        {/* ══════════════════════════════════════════
            1. 品牌资产 (Brand Assets)
        ══════════════════════════════════════════ */}
        <section className="rounded-xl border border-black/[0.06] bg-white p-8 shadow-sm">
          
          <div className="grid grid-cols-3 gap-6 items-stretch">
            <div className="flex flex-col">
              <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase">
                Logo 图片（全局通用）
              </label>
              <FieldHint>→ 导航栏左上角标识，留空变默认</FieldHint>
              <div className="mt-auto pt-2">
                <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                <div
                  onClick={() => !uploadingLogo && logoInputRef.current?.click()}
                  className={`flex h-[48px] w-full cursor-pointer items-center justify-center rounded-lg border border-dashed transition-colors ${
                    uploadingLogo 
                      ? "border-black/10 bg-black/5 cursor-wait" 
                      : "border-black/20 bg-[#FAFAFA] hover:border-black/40 hover:bg-white"
                  }`}
                >
                  {uploadingLogo ? (
                     <div className="flex items-center gap-1.5">
                       <Loader2 size={15} className="animate-spin text-[#111111]/40" />
                       <span className="text-[12px] font-semibold text-[#111111]/40">上传中...</span>
                     </div>
                  ) : settings.logoImageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element -- admin preview */
                    <img
                      src={settings.logoImageUrl}
                      alt="Logo 预览"
                      className="h-full w-full rounded-lg object-contain p-2"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <ImageIcon size={15} className="text-[#111111]/30" />
                      <span className="text-[12px] font-semibold text-[#111111]/40">点击上传框</span>
                    </div>
                  )}
                </div>
                {settings.logoImageUrl && !uploadingLogo && (
                  <button
                    onClick={() => updateField("logoImageUrl", null)}
                    className="mt-1.5 text-[11px] text-red-500 hover:text-red-700 transition-colors w-full text-center block"
                  >
                    移除
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase flex items-center gap-1">
                站点名 (Browser Title)
                <span className="text-[#D4AF37] ml-1" title="随语言设置变化">🌐</span>
              </label>
              <FieldHint>→ 浏览器选项卡窗体顶部的文本</FieldHint>
              <div className="mt-auto pt-2">
                <input
                  type="text"
                  value={settings[langFields.siteName] as string}
                  onChange={(e) => updateField(langFields.siteName, e.target.value)}
                  placeholder={activeTab === "zh" ? "KXTJ 重工机械" : "KXTJ Heavy Machinery"}
                  className="w-full h-[48px] rounded-lg border border-black/10 bg-[#FAFAFA] px-4 text-[15px] text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase flex items-center gap-1">
                Logo 文字 (Brand Name)
                <span className="text-[#D4AF37] ml-1" title="随语言设置变化">🌐</span>
              </label>
              <FieldHint>→ 导航栏及网站页脚的品牌文字</FieldHint>
              <div className="mt-auto pt-2">
                <input
                  type="text"
                  value={settings[langFields.logoText] as string}
                  onChange={(e) => updateField(langFields.logoText, e.target.value)}
                  placeholder={activeTab === "zh" ? "中国机械" : "CHINA MACHINERY"}
                  className="w-full h-[48px] rounded-lg border border-black/10 bg-[#FAFAFA] px-4 text-[15px] text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            2. 通讯联络 (Contact Info)
        ══════════════════════════════════════════ */}
        <section className="rounded-xl border border-black/[0.06] bg-white p-8 shadow-sm">
          <h2 className="text-base font-bold tracking-[0.08em] text-[#111111] uppercase mb-6 flex items-center gap-2">
            <Phone size={17} className="text-[#111111]/40" />
            通讯联络 (Contact Info)
          </h2>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="space-y-1.5">
              <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase flex items-center gap-1.5">
                <User size={13} /> 联系人姓名 (全局通用)
              </label>
              <input
                type="text"
                value={settings.contactName}
                onChange={(e) => updateField("contactName", e.target.value)}
                placeholder="Jack Yin"
                className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-4 py-3 text-[15px] text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase flex items-center gap-1.5">
                <Phone size={13} /> 联系电话 (全局通用)
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => updateField("contactPhone", e.target.value)}
                placeholder="+86 17321077956"
                className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-4 py-3 text-[15px] text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase flex items-center gap-1.5">
                <Mail size={13} /> 邮箱地址 (全局通用)
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => updateField("contactEmail", e.target.value)}
                placeholder="sales@company.com"
                className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-4 py-3 text-[15px] text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase flex items-center gap-1.5">
                <MessageCircle size={13} /> WhatsApp (全局通用)
              </label>
              <input
                type="text"
                value={settings.contactWhatsApp}
                onChange={(e) => updateField("contactWhatsApp", e.target.value)}
                placeholder="+86 15375319246"
                className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-4 py-3 text-[15px] text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white"
              />
            </div>
          </div>

          <div className="p-5 rounded-xl border border-black/[0.04] bg-[#FAFAFA]">
            <div className="space-y-1.5">
              <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase flex items-center gap-1.5">
                <MapPin size={13} /> 公司地址 
                <span className="text-[#D4AF37] ml-1" title="随语言设置变化">🌐</span>
              </label>
              <FieldHint>→ 前台：页脚「地址」一行，当前录入的语言版会自动显示在对应前台语种中</FieldHint>
              <textarea
                rows={2}
                value={settings[langFields.contactAddress] as string}
                onChange={(e) => updateField(langFields.contactAddress, e.target.value)}
                placeholder={activeTab === "zh" ? "中国上海市奉贤区金海路6055号" : "No. 6055, Jinhai Rd, Fengxian District, Shanghai, China"}
                className="w-full mt-2 rounded-lg border border-black/10 bg-white px-4 py-3 text-[15px] text-[#111111] outline-none transition-colors focus:border-black/30 resize-none"
              />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            3. 版权与社交媒体 (Footer Content)
        ══════════════════════════════════════════ */}
        <section className="rounded-xl border border-black/[0.06] bg-white p-8 shadow-sm">
          <h2 className="text-base font-bold tracking-[0.08em] text-[#111111] uppercase mb-6 flex items-center gap-2">
            <Copyright size={17} className="text-[#111111]/40" />
            版权与社交设置 (Footer Content)
          </h2>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase flex items-center gap-1">
                  版权公司名
                  <span className="text-[#D4AF37] ml-1" title="随语言设置变化">🌐</span>
                </label>
                <input
                  type="text"
                  value={settings[langFields.copyrightText] as string}
                  onChange={(e) => updateField(langFields.copyrightText, e.target.value)}
                  placeholder={activeTab === "zh" ? "中国机械" : "CHINA MACHINERY"}
                  className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-4 py-3 text-[15px] text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase">
                  官方网址 (全局通用)
                </label>
                <input
                  type="text"
                  value={settings.copyrightUrl}
                  onChange={(e) => updateField("copyrightUrl", e.target.value)}
                  placeholder="WWW.ONESWO.COM"
                  className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-4 py-3 text-[15px] text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white"
                />
              </div>

              {/* 沉浸式版权预览 */}
              <div className="pt-2">
                <label className="text-[11px] font-bold tracking-[0.1em] text-[#111111]/30 uppercase mb-2 block">前台页脚底部预览渲染</label>
                <div className="rounded-xl bg-[#111111] px-5 py-4 flex items-center shadow-inner">
                  <p className="text-[12px] font-bold tracking-widest text-[#FFFFFF]/60 uppercase">
                    {activeTab === "zh" ? "版权所有" : "Copyright"} © {new Date().getFullYear()}{" "}
                    {settings[langFields.copyrightText] as string} |{" "}
                    <span className="text-white hover:underline cursor-pointer">{settings.copyrightUrl}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-5 rounded-xl border border-black/[0.04] bg-[#FAFAFA]">
              <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase mb-1 block">
                社交媒体链接 (全局通用)
              </label>
              {[
                { key: "socialX" as const, label: "X (Twitter)", placeholder: "https://x.com/yourhandle" },
                { key: "socialInstagram" as const, label: "Instagram", placeholder: "https://instagram.com/yourhandle" },
                { key: "socialFacebook" as const, label: "Facebook", placeholder: "https://facebook.com/yourpage" },
                { key: "socialYoutube" as const, label: "YouTube", placeholder: "https://youtube.com/@yourchannel" },
                { key: "socialTiktok" as const, label: "TikTok", placeholder: "https://tiktok.com/@yourhandle" },
                { key: "socialLinkedin" as const, label: "LinkedIn", placeholder: "https://linkedin.com/company/yourcompany" },
              ].map((social) => (
                <div
                  key={social.key}
                  className="grid grid-cols-[100px_1fr] items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2.5 transition-colors focus-within:border-black/30"
                >
                  <span className="text-[12px] font-bold tracking-wider text-[#111111]/50 uppercase">
                    {social.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link2 size={13} className="text-[#111111]/20 shrink-0" />
                    <input
                      type="text"
                      value={settings[social.key]}
                      onChange={(e) => updateField(social.key, e.target.value)}
                      placeholder={social.placeholder}
                      className="w-full bg-transparent text-[13px] text-[#111111] placeholder:text-black/20 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

      {/* 保存按钮 */}
      <div className="sticky bottom-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2.5 rounded-xl bg-[#111111] px-10 py-4 text-base font-semibold text-white shadow-lg shadow-black/20 transition-all duration-200 hover:bg-black/80 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              保存中...
            </>
          ) : saved ? (
            <>
              <Check size={18} />
              已保存
            </>
          ) : (
            <>
              <Save size={18} />
              保存所有设置
            </>
          )}
        </button>
      </div>
    </div>
  );
}
