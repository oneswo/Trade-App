"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Save,
  Globe,
  Home,
  Package,
  Wrench,
  Info,
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
  { id: "contact", name: "联系我们", slug: "/contact", icon: Phone },
];

// ─── 主页面 ───────────────────────────────────────────────────────────────────

type SaveState = "idle" | "saving" | "success" | "error";

export default function PagesManagementPage() {
  const [activePageId, setActivePageId] = useState("home");
  const [activeLang, setActiveLang] = useState("zh");
  const [isHydrated, setIsHydrated] = useState(false);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [zhFields, setZhFields] = useState<Record<string, string>>({}); // 中文字段数据
  /** 初始 true：避免 hydration 后首帧 fields 为空时用 defaultValue 闪一屏，再被接口结果替换 */
  const [isLoading, setIsLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const sessionUploadedUrlsRef = useRef<Set<string>>(new Set());
  const didInitLoadRef = useRef(false);
  const pageContentLoadIdRef = useRef(0);

  // 客户端 hydration 后读取 localStorage
  useEffect(() => {
    const savedPageId = localStorage.getItem('cms:activePageId');
    const savedLang = localStorage.getItem('cms:activeLang');
    if (savedPageId) setActivePageId(savedPageId);
    if (savedLang) setActiveLang(savedLang);
    setIsHydrated(true);
  }, []);

  // 切换页面或语言时，从 API 加载已保存内容
  useEffect(() => {
    if (!isHydrated) return; // 等待 hydration 完成

    // 保存当前选择到 localStorage
    localStorage.setItem('cms:activePageId', activePageId);
    localStorage.setItem('cms:activeLang', activeLang);

    if (didInitLoadRef.current && sessionUploadedUrlsRef.current.size > 0) {
      const trackedUrls = [...sessionUploadedUrlsRef.current];
      sessionUploadedUrlsRef.current.clear();
      void cleanupTrackedMediaUrls(trackedUrls, []);
    }
    didInitLoadRef.current = true;

    // 立刻清空表单数据，避免在请求返回前仍显示上一页面/语言的字段（会误用旧值盖住当前 tab 的 defaultValue）
    const loadId = ++pageContentLoadIdRef.current;
    setFields({});
    setIsLoading(true);

    const controller = new AbortController();
    let zhController: AbortController | null = null;

    // 加载当前语言的数据
    fetch(`/api/page-content?pageId=${activePageId}&locale=${activeLang}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((res) => {
        if (loadId !== pageContentLoadIdRef.current) return;
        setFields(res.ok && res.data ? res.data : {});
      })
      .catch((err) => {
        if (loadId !== pageContentLoadIdRef.current) return;
        if (err instanceof Error && err.name === "AbortError") return;
        setFields({});
      })
      .finally(() => {
        if (loadId === pageContentLoadIdRef.current) setIsLoading(false);
      });

    // 英文 tab 始终加载当前页面的中文数据，避免切页后误用上一页的中文字段
    if (activeLang === 'en') {
      setZhFields({});
      zhController = new AbortController();
      fetch(`/api/page-content?pageId=${activePageId}&locale=zh`, {
        signal: zhController.signal,
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.ok && res.data) {
            setZhFields(res.data);
          }
        })
        .catch((err) => {
          if (err instanceof Error && err.name !== "AbortError") {
            console.error('Failed to load zh fields:', err);
          }
        });
    }

    return () => {
      controller.abort();
      zhController?.abort();
    };
  }, [activePageId, activeLang, isHydrated]);

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
        clearPageContentCache(activePageId, activeLang, fields);
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
      case "contact":
        return <ContactFields zh={zh} />;
      default:
        return null;
    }
  };

  // Hydration 完成前显示加载状态
  if (!isHydrated) {
    return (
      <div className="h-[calc(100vh-100px)] flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-[#111111]/30" />
      </div>
    );
  }

  return (
    <Ctx.Provider value={{ get, set, trackUploadedUrl, isZh: zh, allFields: activeLang === 'zh' ? fields : zhFields }}>
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
              <div className="px-8 py-8 max-w-3xl">
                {isLoading ? (
                  <div
                    className="space-y-6 animate-pulse"
                    aria-busy="true"
                    aria-label="加载页面内容"
                  >
                    <div className="h-6 w-56 rounded-md bg-black/[0.06]" />
                    <div className="h-10 w-full rounded-lg bg-black/[0.06]" />
                    <div className="h-10 w-full rounded-lg bg-black/[0.06]" />
                    <div className="h-28 w-full rounded-lg bg-black/[0.06]" />
                    <p className="text-[12px] text-[#111111]/40 pt-2">
                      正在加载当前语言内容…
                    </p>
                  </div>
                ) : (
                  renderFields()
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Ctx.Provider>
  );
}
