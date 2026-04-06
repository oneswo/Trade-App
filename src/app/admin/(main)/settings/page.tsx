"use client";

import { useState, useEffect, useRef } from "react";
import {
  Save,
  Image as ImageIcon,
  Phone,
  Globe2,
  Mail,
  MapPin,
  User,
  MessageCircle,
  Loader2,
  Check,
  Copyright,
  Bot,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  XCircle,
  Sparkles,
} from "lucide-react";
import { clearSettingsCache } from "@/hooks/useSiteSettings";
import { cleanupTrackedMediaUrls } from "@/lib/admin/media-cleanup";

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
  copyrightText: string;
  copyrightTextEn: string;
  copyrightUrl: string;
  translationProvider: 'openai' | 'qwen' | 'deepl' | '';
  translationApiKey: string;
  translationApiBaseUrl: string;
  translationModel: string;
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
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("zh");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const sessionUploadedUrlsRef = useRef<Set<string>>(new Set());
  
  // AI 翻译相关状态
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showSwitchConfirm, setShowSwitchConfirm] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<string | null>(null);

  const ERROR_MESSAGES: Record<string, string> = {
    image_too_large: "图片超过 8MB 限制，请压缩后重试",
    invalid_image_type: "仅支持 JPG / PNG / WEBP / GIF 格式",
    empty_file: "文件为空，请重新选择",
    unauthorized: "登录已过期，请刷新页面重新登录",
    unexpected_error: "服务器异常，请稍后重试",
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    setLogoUploadError(null);
    try {
      const { directUpload } = await import("@/lib/upload");
      const result = await directUpload(file, "image");
      sessionUploadedUrlsRef.current.add(result.url);
      updateField("logoImageUrl", result.url);
      setLogoUploadError(null);
    } catch (err) {
      if (err instanceof (await import("@/lib/upload")).UploadError) {
        const msg = ERROR_MESSAGES[err.code] ?? `上传失败 (${err.code})`;
        setLogoUploadError(msg);
      } else {
        console.error(err);
        setLogoUploadError("网络异常，请检查网络后重试");
      }
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((result) => {
        if (result.ok && result.data) {
          // 确保翻译配置字段有默认值
          const settingsData = {
            translationProvider: '',
            translationApiKey: '',
            translationApiBaseUrl: '',
            translationModel: '',
            ...result.data,
          };
          setSettings(settingsData);
        }
      })
      .catch((err) => console.error("Failed to load settings:", err))
      .finally(() => setLoading(false));
  }, []);

  const cleanupPendingSessionUploads = (keepalive?: boolean) => {
    if (sessionUploadedUrlsRef.current.size === 0) return;
    const trackedUrls = [...sessionUploadedUrlsRef.current];
    sessionUploadedUrlsRef.current.clear();
    void cleanupTrackedMediaUrls(trackedUrls, [], keepalive ? { keepalive: true } : undefined);
  };

  useEffect(() => {
    return () => {
      cleanupPendingSessionUploads(true);
    };
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const result = await res.json();
      if (result.ok) {
        const trackedUrls = [...sessionUploadedUrlsRef.current];
        sessionUploadedUrlsRef.current.clear();
        await cleanupTrackedMediaUrls(
          trackedUrls,
          settings.logoImageUrl ? [settings.logoImageUrl] : []
        );
        clearSettingsCache();
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        setSaveError(result.error ?? "保存失败，请稍后重试");
      }
    } catch {
      setSaveError("保存失败，请检查网络或服务器状态");
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  // AI 翻译相关函数
  const handleCopyApiKey = () => {
    if (!settings?.translationApiKey) return;
    navigator.clipboard.writeText(settings.translationApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleProviderSelect = (providerKey: string) => {
    if (!settings) return;
    if (settings.translationProvider && settings.translationProvider !== providerKey) {
      // 已经有其他服务商配置,显示确认弹窗
      setPendingProvider(providerKey);
      setShowSwitchConfirm(true);
    } else {
      // 直接切换
      updateField('translationProvider', providerKey as any);
      setTestResult(null);
    }
  };

  const confirmSwitchProvider = () => {
    if (pendingProvider) {
      updateField('translationApiKey', '');
      updateField('translationApiBaseUrl', '');
      updateField('translationModel', '');
      updateField('translationProvider', pendingProvider as any);
      setTestResult(null);
      setShowSwitchConfirm(false);
      setPendingProvider(null);
    }
  };

  const cancelSwitchProvider = () => {
    setShowSwitchConfirm(false);
    setPendingProvider(null);
  };

  const handleTestConnection = async () => {
    if (!settings?.translationApiKey || !settings.translationProvider) {
      setTestResult({ success: false, message: '请先选择翻译服务并填写 API Key' });
      return;
    }
    
    setTestingConnection(true);
    setTestResult(null);
    
    try {
      const res = await fetch('/api/admin/translate-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: settings.translationProvider,
          apiKey: settings.translationApiKey,
          baseUrl: settings.translationApiBaseUrl || undefined,
          model: settings.translationModel || undefined,
        }),
      });
      
      const data = await res.json();
      
      if (data.ok) {
        setTestResult({ success: true, message: data.message || '连接成功！API Key 有效' });
      } else {
        setTestResult({ success: false, message: data.error || '连接失败，请检查配置' });
      }
    } catch (err) {
      setTestResult({ 
        success: false, 
        message: err instanceof Error ? err.message : '网络错误，请检查网络连接' 
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const TRANSLATION_PROVIDERS = [
    { key: 'qwen' as const, label: '阿里云千问', hint: '国内访问快，性价比高，兼容 OpenAI', placeholder: 'sk-...', apiDocUrl: 'https://dashscope.console.aliyun.com/' },
    { key: 'openai' as const, label: 'OpenAI', hint: 'GPT-4o-mini 翻译质量高，价格便宜', placeholder: 'sk-...', apiDocUrl: 'https://platform.openai.com/api-keys' },
    { key: 'deepl' as const, label: 'DeepL', hint: '专业翻译引擎，质量极高', placeholder: '...', apiDocUrl: 'https://www.deepl.com/pro-api' },
  ];

  const MODEL_OPTIONS: Record<string, { value: string; label: string; desc: string }[]> = {
    qwen: [
      { value: 'qwen-turbo', label: 'Qwen Turbo', desc: '速度快，成本低' },
      { value: 'qwen-plus', label: 'Qwen Plus', desc: '效果更好，均衡之选' },
      { value: 'qwen-max', label: 'Qwen Max', desc: '最强效果，成本较高' },
      { value: 'qwen-long', label: 'Qwen Long', desc: '超长文本，32k 上下文' },
      { value: 'qwen-turbo-latest', label: 'Qwen Turbo (Latest)', desc: '最新版本 Turbo' },
      { value: 'qwen-plus-latest', label: 'Qwen Plus (Latest)', desc: '最新版本 Plus' },
    ],
    openai: [
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini', desc: '便宜快速，翻译够用' },
      { value: 'gpt-4o', label: 'GPT-4o', desc: '更强效果，成本较高' },
      { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini', desc: '最新迷你模型' },
      { value: 'gpt-4.1-nano', label: 'GPT-4.1 Nano', desc: '极致低价' },
    ],
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
    <div className="space-y-6 pb-20">

      {/* 标准顶部 header */}
      <header className="flex h-20 items-center justify-between rounded-xl border border-black/[0.06] bg-white px-8 shadow-sm">
        <div className="flex items-center gap-4 min-w-0">
          <h1 className="text-base font-bold text-[#111111] flex items-center gap-2 shrink-0">
            <Globe2 size={18} className="text-[#111111]/40" />
            全局设置
          </h1>
          <div className="hidden lg:flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3.5 py-2 rounded-lg">
            <span className="text-[#D4AF37] text-[13px]">💡</span>
            <span className="text-[12px] font-bold tracking-wide text-[#b48600] whitespace-nowrap">
              带 <span className="text-[#D4AF37] mx-[2px]">🌐</span> 的项需切语言分别填写；不带的为全局通用项，只需填一次
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {saveError && (
            <p className="hidden xl:block max-w-[360px] text-[12px] font-semibold text-red-500 text-right">
              {saveError}
            </p>
          )}
          <div className="flex items-center gap-1 bg-[#FAFAFA] border border-black/[0.06] p-1.5 rounded-lg">
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
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#111111] px-6 py-2.5 text-[13px] font-bold text-white shadow-sm hover:bg-black/80 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <><Loader2 size={15} className="animate-spin" />保存中...</>
            ) : saved ? (
              <><Check size={15} />已保存</>
            ) : (
              <><Save size={15} />保存设置</>
            )}
          </button>
        </div>
      </header>

      {saveError && (
        <div className="xl:hidden rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
          {saveError}
        </div>
      )}

      <div className="space-y-6">

        {/* ══════════════════════════════════════════
            1. 品牌资产 (Brand Assets)
        ══════════════════════════════════════════ */}
        <section className="rounded-xl border border-black/[0.06] bg-white p-8 shadow-sm">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
            <div className="flex h-full flex-col rounded-2xl border border-black/[0.06] bg-[#FCFCFC] p-5">
              <div>
                <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase">
                  Logo 图片（全局通用）
                </label>
                <FieldHint>→ 导航栏左上角标识。建议上传透明底横版 Logo，留空则显示默认文字</FieldHint>
              </div>

              <input
                type="file"
                ref={logoInputRef}
                className="hidden"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleLogoUpload}
              />

              <div className="mt-2 flex-1 space-y-3">
                <div
                  onClick={() => !uploadingLogo && logoInputRef.current?.click()}
                  className={`relative flex min-h-[148px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed transition-colors ${
                    uploadingLogo
                      ? "border-black/10 bg-black/5 cursor-wait"
                      : logoUploadError
                      ? "border-red-300 bg-red-50"
                      : "border-black/15 bg-white hover:border-black/35"
                  }`}
                >
                  {uploadingLogo ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-[#111111]/40" />
                      <span className="text-[12px] font-semibold text-[#111111]/45">上传中...</span>
                    </div>
                  ) : settings.logoImageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element -- admin preview */
                    <img
                      src={settings.logoImageUrl}
                      alt="Logo 预览"
                      className="h-full w-full object-contain p-4"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center px-6">
                      <ImageIcon size={20} className="text-[#111111]/25" />
                      <span className="text-[12px] font-semibold text-[#111111]/45">
                        点击上传 Logo
                      </span>
                      <span className="text-[11px] text-[#111111]/30">
                        支持 JPG / PNG / WEBP / GIF
                      </span>
                    </div>
                  )}
                </div>

                {logoUploadError && (
                  <p className="text-[11px] font-bold text-red-500">{logoUploadError}</p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => !uploadingLogo && logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="flex-1 rounded-lg border border-black/10 bg-white px-4 py-2.5 text-[12px] font-bold text-[#111111] transition-colors hover:bg-[#FAFAFA] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {settings.logoImageUrl ? "更换图片" : "上传图片"}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField("logoImageUrl", null)}
                    disabled={!settings.logoImageUrl || uploadingLogo}
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-[12px] font-bold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    移除
                  </button>
                </div>
              </div>
            </div>

            <div className="flex h-full flex-col rounded-2xl border border-black/[0.06] bg-[#FCFCFC] p-5">
              <div>
                <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase flex items-center gap-1">
                  站点名称（浏览器标题）
                  <span className="text-[#D4AF37] ml-1" title="随语言设置变化">🌐</span>
                </label>
                <FieldHint>→ 浏览器标签页上显示的名称</FieldHint>
              </div>
              <div className="mt-2 flex-1">
                <input
                  type="text"
                  value={settings[langFields.siteName] as string}
                  onChange={(e) => updateField(langFields.siteName, e.target.value)}
                  placeholder={activeTab === "zh" ? "KXTJ 重工机械" : "KXTJ Heavy Machinery"}
                  className="h-[48px] w-full rounded-lg border border-black/10 bg-white px-4 text-[15px] text-[#111111] outline-none transition-colors focus:border-black/30"
                />
              </div>
            </div>

            <div className="flex h-full flex-col rounded-2xl border border-black/[0.06] bg-[#FCFCFC] p-5">
              <div>
                <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase flex items-center gap-1">
                  品牌文字（导航 / 页脚）
                  <span className="text-[#D4AF37] ml-1" title="随语言设置变化">🌐</span>
                </label>
                <FieldHint>→ 导航栏和页脚使用的品牌名称</FieldHint>
              </div>
              <div className="mt-2 flex-1">
                <input
                  type="text"
                  value={settings[langFields.logoText] as string}
                  onChange={(e) => updateField(langFields.logoText, e.target.value)}
                  placeholder={activeTab === "zh" ? "中国机械" : "CHINA MACHINERY"}
                  className="h-[48px] w-full rounded-lg border border-black/10 bg-white px-4 text-[15px] text-[#111111] outline-none transition-colors focus:border-black/30"
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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-black/[0.06] bg-[#FCFCFC] p-5">
              <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase flex items-center gap-1.5">
                <User size={13} /> 联系人姓名（全局通用）
              </label>
              <FieldHint>→ 用于页脚、悬浮联系入口等全站统一联系信息</FieldHint>
              <input
                type="text"
                value={settings.contactName}
                onChange={(e) => updateField("contactName", e.target.value)}
                placeholder="Jack Yin"
                className="w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-[15px] text-[#111111] outline-none transition-colors focus:border-black/30"
              />
            </div>

            <div className="rounded-2xl border border-black/[0.06] bg-[#FCFCFC] p-5">
              <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase flex items-center gap-1.5">
                <Phone size={13} /> 联系电话（全局通用）
              </label>
              <FieldHint>→ 建议填写带国家区号的号码，例如 `+86 ...`</FieldHint>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => updateField("contactPhone", e.target.value)}
                placeholder="+86 17321077956"
                className="w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-[15px] text-[#111111] outline-none transition-colors focus:border-black/30"
              />
            </div>

            <div className="rounded-2xl border border-black/[0.06] bg-[#FCFCFC] p-5">
              <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase flex items-center gap-1.5">
                <Mail size={13} /> 邮箱地址（全局通用）
              </label>
              <FieldHint>→ 用于页脚和联系入口的主邮箱</FieldHint>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => updateField("contactEmail", e.target.value)}
                placeholder="sales@company.com"
                className="w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-[15px] text-[#111111] outline-none transition-colors focus:border-black/30"
              />
            </div>

            <div className="rounded-2xl border border-black/[0.06] bg-[#FCFCFC] p-5">
              <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase flex items-center gap-1.5">
                <MessageCircle size={13} /> WhatsApp（全局通用）
              </label>
              <FieldHint>→ 建议与电话格式统一，方便直接跳转联系</FieldHint>
              <input
                type="text"
                value={settings.contactWhatsApp}
                onChange={(e) => updateField("contactWhatsApp", e.target.value)}
                placeholder="+86 15375319246"
                className="w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-[15px] text-[#111111] outline-none transition-colors focus:border-black/30"
              />
            </div>

            <div className="xl:col-span-2 rounded-2xl border border-black/[0.06] bg-[#FCFCFC] p-5">
              <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase flex items-center gap-1.5">
                <MapPin size={13} /> 公司地址
                <span className="text-[#D4AF37] ml-1" title="随语言设置变化">🌐</span>
              </label>
              <FieldHint>→ 前台页脚显示的地址，会随当前语言切换对应版本</FieldHint>
              <textarea
                rows={2}
                value={settings[langFields.contactAddress] as string}
                onChange={(e) => updateField(langFields.contactAddress, e.target.value)}
                placeholder={activeTab === "zh" ? "中国上海市奉贤区金海路6055号" : "No. 6055, Jinhai Rd, Fengxian District, Shanghai, China"}
                className="w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-[15px] text-[#111111] outline-none transition-colors focus:border-black/30 resize-none"
              />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            3. 版权设置 (Footer Content)
        ══════════════════════════════════════════ */}
        <section className="rounded-xl border border-black/[0.06] bg-white p-8 shadow-sm">
          <h2 className="text-base font-bold tracking-[0.08em] text-[#111111] uppercase mb-6 flex items-center gap-2">
            <Copyright size={17} className="text-[#111111]/40" />
            版权设置 (Footer Content)
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.1fr] gap-6">
            <div className="space-y-6">
              <div className="rounded-2xl border border-black/[0.06] bg-[#FCFCFC] p-5">
                <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase flex items-center gap-1">
                  版权公司名
                  <span className="text-[#D4AF37] ml-1" title="随语言设置变化">🌐</span>
                </label>
                <FieldHint>→ 页脚版权行里显示的公司名称</FieldHint>
                <input
                  type="text"
                  value={settings[langFields.copyrightText] as string}
                  onChange={(e) => updateField(langFields.copyrightText, e.target.value)}
                  placeholder={activeTab === "zh" ? "中国机械" : "CHINA MACHINERY"}
                  className="w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-[15px] text-[#111111] outline-none transition-colors focus:border-black/30"
                />
              </div>

              <div className="rounded-2xl border border-black/[0.06] bg-[#FCFCFC] p-5">
                <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase">
                  官方网址（全局通用）
                </label>
                <FieldHint>→ 页脚版权行中的官网链接或展示网址</FieldHint>
                <input
                  type="text"
                  value={settings.copyrightUrl}
                  onChange={(e) => updateField("copyrightUrl", e.target.value)}
                  placeholder="WWW.ONESWO.COM"
                  className="w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-[15px] text-[#111111] outline-none transition-colors focus:border-black/30"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-black/[0.06] bg-[#FCFCFC] p-5">
              <label className="text-[11px] font-bold tracking-[0.1em] text-[#111111]/30 uppercase mb-3 block">
                前台页脚预览
              </label>
              <div className="flex h-full min-h-[164px] items-center rounded-2xl bg-[#111111] px-5 py-6 shadow-inner">
                <p className="text-[12px] font-bold tracking-widest text-[#FFFFFF]/60 uppercase leading-relaxed break-all">
                  {activeTab === "zh" ? "版权所有" : "Copyright"} © {new Date().getFullYear()}{" "}
                  {settings[langFields.copyrightText] as string} |{" "}
                  <span className="text-white hover:underline cursor-pointer">{settings.copyrightUrl}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            4. AI 翻译设置 (Translation API)
        ══════════════════════════════════════════ */}
        <section className="rounded-xl border border-black/[0.06] bg-white p-8 shadow-sm">
          <h2 className="text-base font-bold tracking-[0.08em] text-[#111111] uppercase mb-6 flex items-center gap-2">
            <Bot size={17} className="text-[#111111]/40" />
            AI 翻译设置 (Translation API)
          </h2>
          
          <div className="space-y-6">
            {/* 翻译服务提供商选择 */}
            <div className="rounded-2xl border border-black/[0.06] bg-[#FCFCFC] p-5">
              <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#D4AF37]" /> 翻译服务提供商
              </label>
              <FieldHint>→ 选择后填写对应的 API Key 即可在页面内容管理中使用 AI 翻译功能</FieldHint>
              
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TRANSLATION_PROVIDERS.map((provider) => {
                  const isSelected = settings.translationProvider === provider.key;
                  return (
                    <button
                      key={provider.key}
                      type="button"
                      onClick={() => handleProviderSelect(provider.key)}
                      className={`relative flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-[#D4AF37] bg-[#FFFBF0] shadow-sm'
                          : 'border-black/[0.08] bg-white hover:border-black/20 hover:bg-black/[0.02]'
                      }`}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-[#D4AF37]' : 'border-black/20'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
                        </div>
                        <span className={`text-[15px] font-bold ${
                          isSelected ? 'text-[#111111]' : 'text-[#111111]/70'
                        }`}>
                          {provider.label}
                        </span>
                      </div>
                      <p className="mt-2 text-[12px] text-[#111111]/50 leading-relaxed">
                        {provider.hint}
                      </p>
                      <a
                        href={provider.apiDocUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-[11px] text-[#D4AF37] hover:underline font-medium"
                      >
                        获取 API Key →
                      </a>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* API Key 输入 */}
            {settings.translationProvider && (
              <div className="rounded-2xl border border-black/[0.06] bg-[#FCFCFC] p-5">
                <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase">
                  API Key
                </label>
                <FieldHint>
                  → {TRANSLATION_PROVIDERS.find(p => p.key === settings.translationProvider)?.label} API Key，请妥善保管
                </FieldHint>
                
                <div className="mt-4 relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.translationApiKey}
                    onChange={(e) => {
                      updateField('translationApiKey', e.target.value);
                      setTestResult(null);
                    }}
                    placeholder={TRANSLATION_PROVIDERS.find(p => p.key === settings.translationProvider)?.placeholder}
                    className="w-full rounded-lg border border-black/10 bg-white px-4 pr-28 py-3 text-[15px] text-[#111111] outline-none transition-colors focus:border-black/30 font-mono"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-2 text-[#111111]/40 hover:text-[#111111] transition-colors rounded-lg hover:bg-black/[0.04]"
                      title={showApiKey ? '隐藏' : '显示'}
                    >
                      {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyApiKey}
                      disabled={!settings.translationApiKey}
                      className="p-2 text-[#111111]/40 hover:text-[#111111] transition-colors rounded-lg hover:bg-black/[0.04] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="复制"
                    >
                      {copiedKey ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 模型选择 (仅 OpenAI 和 千问) */}
            {(settings.translationProvider === 'openai' || settings.translationProvider === 'qwen') && (() => {
              const presets = MODEL_OPTIONS[settings.translationProvider] || [];
              const currentModel = settings.translationModel || presets[0]?.value || '';
              const isCustom = currentModel !== '' && !presets.some(m => m.value === currentModel);
              return (
              <div className="rounded-2xl border border-black/[0.06] bg-[#FCFCFC] p-5">
                <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase">
                  翻译模型
                </label>
                <FieldHint>
                  → 点选常用模型，或手动输入任意模型名称；免费额度用完可随时切换
                </FieldHint>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {presets.map((m) => {
                    const isActive = currentModel === m.value;
                    return (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => updateField('translationModel', m.value)}
                        className={`flex flex-col items-start p-3 rounded-xl border-2 transition-all text-left ${
                          isActive
                            ? 'border-[#D4AF37] bg-[#FFFBF0] shadow-sm'
                            : 'border-black/[0.08] bg-white hover:border-black/20 hover:bg-black/[0.02]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                            isActive ? 'border-[#D4AF37]' : 'border-black/20'
                          }`}>
                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
                          </div>
                          <span className={`text-[14px] font-bold ${
                            isActive ? 'text-[#111111]' : 'text-[#111111]/70'
                          }`}>
                            {m.label}
                          </span>
                        </div>
                        <p className="mt-1 ml-5.5 text-[11px] text-[#111111]/50 leading-relaxed">
                          {m.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
                {/* 自定义模型输入 */}
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={isCustom ? currentModel : ''}
                    onChange={(e) => updateField('translationModel', e.target.value)}
                    placeholder="或手动输入模型名称，如 qwen3-235b-a22b"
                    className={`flex-1 rounded-lg border bg-white px-4 py-2.5 text-[14px] text-[#111111] outline-none transition-colors font-mono ${
                      isCustom ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/30' : 'border-black/10 focus:border-black/30'
                    }`}
                  />
                  {isCustom && (
                    <span className="shrink-0 rounded-full bg-[#D4AF37]/15 px-2.5 py-1 text-[11px] font-bold text-[#B8860B]">
                      自定义
                    </span>
                  )}
                </div>
              </div>
              );
            })()}

            {/* API 自定义地址 (仅 OpenAI 和 千问) */}
            {(settings.translationProvider === 'openai' || settings.translationProvider === 'qwen') && (
              <div className="rounded-2xl border border-black/[0.06] bg-[#FCFCFC] p-5">
                <label className="text-[14.5px] font-bold tracking-wider text-[#111111]/80 uppercase">
                  API 自定义地址（可选）
                </label>
                <FieldHint>
                  → {settings.translationProvider === 'qwen' 
                    ? '千问默认地址: https://dashscope.aliyuncs.com/compatible-mode/v1' 
                    : '使用代理时填写，留空使用默认地址 https://api.openai.com/v1'}
                </FieldHint>
                <input
                  type="text"
                  value={settings.translationApiBaseUrl}
                  onChange={(e) => updateField('translationApiBaseUrl', e.target.value)}
                  placeholder={settings.translationProvider === 'qwen' 
                    ? 'https://dashscope.aliyuncs.com/compatible-mode/v1'
                    : 'https://api.openai.com/v1'}
                  className="mt-4 w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-[15px] text-[#111111] outline-none transition-colors focus:border-black/30 font-mono"
                />
              </div>
            )}

            {/* 测试连接 */}
            {settings.translationProvider && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testingConnection || !settings.translationApiKey}
                  className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-5 py-2.5 text-[13px] font-bold text-[#111111] transition-all hover:bg-[#FAFAFA] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {testingConnection ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> 测试中...
                    </>
                  ) : (
                    <>🔌 测试连接</>
                  )}
                </button>
                
                {testResult && (
                  <div className={`flex items-center gap-2 text-[13px] font-semibold ${
                    testResult.success ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {testResult.success ? (
                      <><CheckCircle size={16} /> {testResult.message}</>
                    ) : (
                      <><XCircle size={16} /> {testResult.message}</>
                    )}
                  </div>
                )}
                
                {!settings.translationApiKey && (
                  <p className="text-[12px] text-[#111111]/40">
                    请先填写 API Key
                  </p>
                )}
              </div>
            )}

            {/* 未配置时的提示 */}
            {!settings.translationProvider && (
              <div className="rounded-xl border border-[#D4AF37]/30 bg-[#FFFBF0] p-4 space-y-1.5">
                <p className="text-[13px] font-semibold text-[#B8860B]">💡 如何使用 AI 翻译？</p>
                <p className="text-[12px] text-[#B8860B]/70 leading-relaxed">
                  1. 选择上方的翻译服务提供商<br />
                  2. 填写对应的 API Key<br />
                  3. 保存设置后即可在「页面内容」管理中使用 AI 翻译功能<br />
                  4. 填写中文内容后，切换到英文 tab 即可看到翻译按钮
                </p>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* 切换服务商确认弹窗 */}
      {showSwitchConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#111111]">
                    切换翻译服务商
                  </h3>
                  <p className="mt-2 text-[14px] text-[#111111]/60 leading-relaxed">
                    切换后将清空当前已填写的 <strong className="text-[#111111]">API Key</strong> 和 <strong className="text-[#111111]">API 地址</strong>，是否需要继续？
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 border-t border-black/[0.06] bg-[#FAFAFA] px-6 py-4 rounded-b-2xl">
              <button
                type="button"
                onClick={cancelSwitchProvider}
                className="flex-1 rounded-lg border border-black/10 bg-white px-4 py-2.5 text-[14px] font-bold text-[#111111] transition-all hover:bg-[#F5F5F5]"
              >
                取消
              </button>
              <button
                type="button"
                onClick={confirmSwitchProvider}
                className="flex-1 rounded-lg bg-[#111111] px-4 py-2.5 text-[14px] font-bold text-white transition-all hover:bg-black/80"
              >
                确认切换
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
