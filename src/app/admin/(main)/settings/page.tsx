"use client";

import { useState, useEffect } from "react";
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
  Type,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Check,
  Copyright,
  Lightbulb,
} from "lucide-react";

interface SiteSettings {
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

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // 加载配置
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((result) => {
        if (result.ok && result.data) {
          setSettings(result.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // 保存配置
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
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  // 更新字段
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

  return (
    <div className="space-y-8 max-w-5xl pb-12">
      {/* ── 区块 1：品牌标识 ── */}
      <section className="rounded-xl border border-black/[0.06] bg-white p-8 shadow-sm">
        <h2 className="text-[13px] font-bold tracking-[0.1em] text-[#111111] uppercase mb-8 flex items-center gap-2">
          <Type size={16} className="text-[#111111]/40" />
          品牌标识 (Brand Identity)
        </h2>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-wider text-[#111111]/40 uppercase">
              站点名称（中文 - 浏览器标题）
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => updateField("siteName", e.target.value)}
              placeholder="KXTJ 重工机械"
              className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-wider text-[#111111]/40 uppercase">
              站点名称（英文 - Browser Title）
            </label>
            <input
              type="text"
              value={settings.siteNameEn}
              onChange={(e) => updateField("siteNameEn", e.target.value)}
              placeholder="KXTJ Heavy Machinery"
              className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-wider text-[#111111]/40 uppercase">
              导航栏 Logo 文字（中文）
            </label>
            <input
              type="text"
              value={settings.logoText}
              onChange={(e) => updateField("logoText", e.target.value)}
              placeholder="中国机械"
              className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-wider text-[#111111]/40 uppercase">
              导航栏 Logo 文字（英文）
            </label>
            <input
              type="text"
              value={settings.logoTextEn}
              onChange={(e) => updateField("logoTextEn", e.target.value)}
              placeholder="CHINA MACHINERY"
              className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white"
            />
          </div>

          <div className="col-span-2 space-y-3">
            <label className="text-[11px] font-semibold tracking-wider text-[#111111]/40 uppercase">
              Logo 图片（可选，留空使用文字 Logo）
            </label>
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-40 cursor-pointer items-center justify-center rounded-xl border border-dashed border-black/15 bg-[#FAFAFA] transition-colors hover:border-black/30">
                <div className="flex flex-col items-center gap-1">
                  <ImageIcon size={20} className="text-[#111111]/30" />
                  <span className="text-[10px] text-[#111111]/40">上传 Logo</span>
                </div>
              </div>
              <input
                type="text"
                value={settings.logoImageUrl || ""}
                onChange={(e) => updateField("logoImageUrl", e.target.value || null)}
                placeholder="或输入图片 URL..."
                className="flex-1 rounded-lg border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 区块 2：功能开关 ── */}
      <section className="rounded-xl border border-black/[0.06] bg-white p-8 shadow-sm">
        <h2 className="text-[13px] font-bold tracking-[0.1em] text-[#111111] uppercase mb-8 flex items-center gap-2">
          <Lightbulb size={16} className="text-[#111111]/40" />
          功能开关 (Feature Toggles)
        </h2>

        <div className="flex items-center justify-between rounded-lg border border-black/10 bg-[#FAFAFA] px-5 py-4">
          <div className="flex items-center gap-3">
            <Lightbulb size={18} className="text-[#111111]/50" />
            <div>
              <p className="text-sm font-medium text-[#111111]">智库 (Insights)</p>
              <p className="text-xs text-[#111111]/40">是否在导航栏显示智库入口</p>
            </div>
          </div>
          <button
            onClick={() => updateField("enableInsights", !settings.enableInsights)}
            className="flex items-center gap-2"
          >
            {settings.enableInsights ? (
              <ToggleRight size={32} className="text-[#22C55E]" />
            ) : (
              <ToggleLeft size={32} className="text-[#111111]/30" />
            )}
            <span className={`text-sm font-medium ${settings.enableInsights ? "text-[#22C55E]" : "text-[#111111]/40"}`}>
              {settings.enableInsights ? "已开启" : "已关闭"}
            </span>
          </button>
        </div>
      </section>

      {/* ── 区块 3：联系方式 ── */}
      <section className="rounded-xl border border-black/[0.06] bg-white p-8 shadow-sm">
        <h2 className="text-[13px] font-bold tracking-[0.1em] text-[#111111] uppercase mb-8 flex items-center gap-2">
          <Phone size={16} className="text-[#111111]/40" />
          联系方式 (Contact Info)
        </h2>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-wider text-[#111111]/40 uppercase flex items-center gap-1.5">
              <User size={12} /> 联系人姓名
            </label>
            <input
              type="text"
              value={settings.contactName}
              onChange={(e) => updateField("contactName", e.target.value)}
              placeholder="Jack Yin"
              className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-wider text-[#111111]/40 uppercase flex items-center gap-1.5">
              <Phone size={12} /> 联系电话
            </label>
            <input
              type="text"
              value={settings.contactPhone}
              onChange={(e) => updateField("contactPhone", e.target.value)}
              placeholder="+86 17321077956"
              className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-wider text-[#111111]/40 uppercase flex items-center gap-1.5">
              <Mail size={12} /> 邮箱地址
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => updateField("contactEmail", e.target.value)}
              placeholder="sales@company.com"
              className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-wider text-[#111111]/40 uppercase flex items-center gap-1.5">
              <MessageCircle size={12} /> WhatsApp
            </label>
            <input
              type="text"
              value={settings.contactWhatsApp}
              onChange={(e) => updateField("contactWhatsApp", e.target.value)}
              placeholder="+86 15375319246"
              className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-wider text-[#111111]/40 uppercase flex items-center gap-1.5">
              <MapPin size={12} /> 公司地址（中文）
            </label>
            <textarea
              rows={2}
              value={settings.contactAddress}
              onChange={(e) => updateField("contactAddress", e.target.value)}
              placeholder="中国上海市奉贤区金海路6055号"
              className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-wider text-[#111111]/40 uppercase flex items-center gap-1.5">
              <MapPin size={12} /> 公司地址（英文）
            </label>
            <textarea
              rows={2}
              value={settings.contactAddressEn}
              onChange={(e) => updateField("contactAddressEn", e.target.value)}
              placeholder="No. 6055, Jinhai Rd, Fengxian District, Shanghai, China"
              className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white resize-none"
            />
          </div>
        </div>
      </section>

      {/* ── 区块 4：社交媒体 ── */}
      <section className="rounded-xl border border-black/[0.06] bg-white p-8 shadow-sm">
        <h2 className="text-[13px] font-bold tracking-[0.1em] text-[#111111] uppercase mb-8 flex items-center gap-2">
          <Globe2 size={16} className="text-[#111111]/40" />
          社交媒体 (Social Links)
        </h2>

        <div className="space-y-4">
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
              className="grid grid-cols-[120px_1fr] items-center gap-4 rounded-lg border border-black/10 bg-[#FAFAFA] px-4 py-3 transition-colors focus-within:border-black/30 focus-within:bg-white"
            >
              <span className="text-[11px] font-bold tracking-wider text-[#111111]/50 uppercase">
                {social.label}
              </span>
              <div className="flex items-center gap-2">
                <Link2 size={14} className="text-[#111111]/20" />
                <input
                  type="text"
                  value={settings[social.key]}
                  onChange={(e) => updateField(social.key, e.target.value)}
                  placeholder={social.placeholder}
                  className="w-full bg-transparent text-sm text-[#111111] placeholder:text-black/20 outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 区块 5：版权信息 ── */}
      <section className="rounded-xl border border-black/[0.06] bg-white p-8 shadow-sm">
        <h2 className="text-[13px] font-bold tracking-[0.1em] text-[#111111] uppercase mb-8 flex items-center gap-2">
          <Copyright size={16} className="text-[#111111]/40" />
          版权信息 (Copyright)
        </h2>

        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-wider text-[#111111]/40 uppercase">
              公司名称（中文）
            </label>
            <input
              type="text"
              value={settings.copyrightText}
              onChange={(e) => updateField("copyrightText", e.target.value)}
              placeholder="中国机械"
              className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-wider text-[#111111]/40 uppercase">
              公司名称（英文）
            </label>
            <input
              type="text"
              value={settings.copyrightTextEn}
              onChange={(e) => updateField("copyrightTextEn", e.target.value)}
              placeholder="CHINA MACHINERY"
              className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-wider text-[#111111]/40 uppercase">
              网站地址
            </label>
            <input
              type="text"
              value={settings.copyrightUrl}
              onChange={(e) => updateField("copyrightUrl", e.target.value)}
              placeholder="WWW.ONESWO.COM"
              className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] outline-none transition-colors focus:border-black/30 focus:bg-white"
            />
          </div>
        </div>

        {/* 预览 */}
        <div className="mt-6 rounded-lg bg-[#111111] px-6 py-4 text-center">
          <p className="text-[11px] font-bold tracking-widest text-gray-500 uppercase">
            版权所有 © {new Date().getFullYear()} {settings.copyrightText} |{" "}
            <span className="text-gray-400">{settings.copyrightUrl}</span>
          </p>
        </div>
      </section>

      {/* 保存按钮 */}
      <div className="sticky bottom-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2.5 rounded-xl bg-[#111111] px-10 py-4 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-all duration-200 hover:bg-black/80 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
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
