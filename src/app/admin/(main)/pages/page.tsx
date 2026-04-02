"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Save,
  Globe,
  Home,
  Package,
  Wrench,
  Info,
  BookOpen,
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { SUPPORTED_LOCALES, LOCALE_LABELS } from "@/lib/i18n/locales";
import { clearPageContentCache } from "@/hooks/usePageContent";
import { cleanupTrackedMediaUrls } from "@/lib/admin/media-cleanup";
import { Ctx } from "./_context";
import { HomeFields } from "./_fields/home";
import { ProductsFields } from "./_fields/products";
import { ServicesFields } from "./_fields/services";
import { AboutFields } from "./_fields/about";
import { InsightsFields } from "./_fields/insights";
import { ContactFields } from "./_fields/contact";
import { ProductDetailFields } from "./_fields/product-detail";

// ─── 页面列表 ─────────────────────────────────────────────────────────────────

const LOCALES = SUPPORTED_LOCALES.map((id) => ({
  id,
  label: LOCALE_LABELS[id],
}));

const PAGES_LIST = [
  { id: "home", name: "网站首页", slug: "/", icon: Home },
  { id: "products", name: "产品列表", slug: "/products", icon: Package },
  { id: "product-detail", name: "产品详情", slug: "/products/[slug]", icon: Package },
  { id: "services", name: "服务支持", slug: "/services", icon: Wrench },
  { id: "about", name: "关于我们", slug: "/about", icon: Info },
  { id: "insights", name: "行业智库", slug: "/insights", icon: BookOpen },
  { id: "contact", name: "联系我们", slug: "/contact", icon: Phone },
];

// ─── 主页面 ───────────────────────────────────────────────────────────────────

type SaveState = "idle" | "saving" | "success" | "error";

export default function PagesManagementPage() {
  const [activePageId, setActivePageId] = useState("home");
  const [activeLang, setActiveLang] = useState("zh");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const sessionUploadedUrlsRef = useRef<Set<string>>(new Set());
  const didInitLoadRef = useRef(false);

  // 切换页面或语言时，从 API 加载已保存内容
  useEffect(() => {
    if (didInitLoadRef.current && sessionUploadedUrlsRef.current.size > 0) {
      const trackedUrls = [...sessionUploadedUrlsRef.current];
      sessionUploadedUrlsRef.current.clear();
      void cleanupTrackedMediaUrls(trackedUrls, []);
    }
    didInitLoadRef.current = true;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- 切换页/语言时先进入加载态
    setIsLoading(true);
    fetch(`/api/page-content?pageId=${activePageId}&locale=${activeLang}`)
      .then((r) => r.json())
      .then((res) => {
        setFields(res.ok && res.data ? res.data : {});
      })
      .catch(() => setFields({}))
      .finally(() => setIsLoading(false));
  }, [activePageId, activeLang]);

  const get = useCallback(
    (name: string, fallback: string) => fields[name] ?? fallback,
    [fields]
  );
  const set = useCallback((name: string, val: string) => {
    setFields((prev) => ({ ...prev, [name]: val }));
  }, []);
  const trackUploadedUrl = useCallback((url: string) => {
    sessionUploadedUrlsRef.current.add(url);
  }, []);
  const cleanupPendingSessionUploads = useCallback((keepalive?: boolean) => {
    if (sessionUploadedUrlsRef.current.size === 0) return;
    const trackedUrls = [...sessionUploadedUrlsRef.current];
    sessionUploadedUrlsRef.current.clear();
    void cleanupTrackedMediaUrls(trackedUrls, [], keepalive ? { keepalive: true } : undefined);
  }, []);

  useEffect(() => {
    return () => {
      cleanupPendingSessionUploads(true);
    };
  }, [cleanupPendingSessionUploads]);

  const handleSave = async () => {
    setSaveState("saving");
    try {
      const res = await fetch("/api/page-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: activePageId,
          locale: activeLang,
          data: fields,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        const trackedUrls = [...sessionUploadedUrlsRef.current];
        sessionUploadedUrlsRef.current.clear();
        await cleanupTrackedMediaUrls(trackedUrls, Object.values(fields));
        clearPageContentCache(activePageId, activeLang);
        setSaveState("success");
      } else {
        setSaveState("error");
      }
    } catch {
      setSaveState("error");
    }
    setTimeout(() => setSaveState("idle"), 3000);
  };

  const activePage = PAGES_LIST.find((p) => p.id === activePageId)!;
  const zh = activeLang === "zh";

  const renderFields = () => {
    switch (activePageId) {
      case "home":
        return <HomeFields zh={zh} />;
      case "products":
        return <ProductsFields zh={zh} />;
      case "product-detail":
        return <ProductDetailFields zh={zh} />;
      case "services":
        return <ServicesFields zh={zh} />;
      case "about":
        return <AboutFields zh={zh} />;
      case "insights":
        return <InsightsFields zh={zh} />;
      case "contact":
        return <ContactFields zh={zh} />;
      default:
        return null;
    }
  };

  return (
    <Ctx.Provider value={{ get, set, trackUploadedUrl }}>
      <div className="h-[calc(100vh-100px)] flex flex-col">
        <div className="flex-1 min-h-0 grid grid-cols-[220px_1fr] gap-6">
          <section className="flex flex-col rounded-xl border border-black/[0.06] bg-white shadow-sm overflow-hidden">
            <div className="border-b border-black/[0.05] px-4 py-3.5 bg-black/[0.02]">
              <h2 className="text-[12px] font-semibold text-[#111111]/60 uppercase tracking-widest">
                固定页面
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {PAGES_LIST.map((page) => {
                const Icon = page.icon;
                const isActive = activePageId === page.id;
                return (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => setActivePageId(page.id)}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-3 text-[13px] font-medium transition-all ${
                      isActive
                        ? "bg-[#111111] text-white shadow-sm"
                        : "text-[#111111]/50 hover:bg-black/[0.03] hover:text-[#111111]"
                    }`}
                  >
                    <Icon
                      size={15}
                      className={isActive ? "text-white/60" : "text-[#111111]/25"}
                      strokeWidth={2}
                    />
                    <span>{page.name}</span>
                    {isActive && (
                      <span className="ml-auto text-[10px] text-white/40 font-normal">
                        {page.slug}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="flex flex-col rounded-xl border border-black/[0.06] bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-black/[0.05] bg-[#FAFAFA] px-6 py-4 shrink-0">
              <div>
                <h2 className="text-[15px] font-bold text-[#111111]">{activePage.name}</h2>
                <p className="mt-0.5 text-[11px] text-[#111111]/35">路由：{activePage.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                {saveState === "success" && (
                  <span className="flex items-center gap-1.5 text-[12px] text-emerald-600 font-medium">
                    <CheckCircle size={14} /> 保存成功
                  </span>
                )}
                {saveState === "error" && (
                  <span className="flex items-center gap-1.5 text-[12px] text-red-500 font-medium">
                    <AlertCircle size={14} /> 保存失败
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saveState === "saving" || isLoading}
                  className="flex items-center gap-2 rounded-lg bg-[#111111] px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-black/80 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveState === "saving" ? (
                    <>
                      <Loader2 size={13} className="animate-spin" /> 保存中…
                    </>
                  ) : (
                    <>
                      <Save size={13} /> 保存当前语言
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center border-b border-black/[0.05] px-6 shrink-0">
              {LOCALES.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setActiveLang(loc.id)}
                  className={`relative flex items-center gap-2 px-4 py-3.5 text-[13px] font-medium transition-colors ${
                    activeLang === loc.id
                      ? "text-[#111111]"
                      : "text-[#111111]/35 hover:text-[#111111]/60"
                  }`}
                >
                  <Globe
                    size={13}
                    className={activeLang === loc.id ? "text-orange-500" : ""}
                  />
                  {loc.label}
                  {activeLang === loc.id && (
                    <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#111111]" />
                  )}
                </button>
              ))}
              {isLoading && (
                <Loader2 size={13} className="ml-4 animate-spin text-[#111111]/30" />
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="px-8 py-8 max-w-3xl">{renderFields()}</div>
            </div>
          </section>
        </div>
      </div>
    </Ctx.Provider>
  );
}
