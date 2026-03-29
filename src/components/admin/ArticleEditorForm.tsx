"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Loader2, Save, Upload } from "lucide-react";
import type { ArticleRecord, ArticleStatus } from "@/lib/data/repository";

type Mode = "create" | "edit";
type EditLanguage = "EN" | "ZH";

interface ApiOk<T> {
  ok: boolean;
  data?: T;
  error?: unknown;
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ArticleEditorForm({
  mode,
  articleId,
}: {
  mode: Mode;
  articleId?: string;
}) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [title, setTitle] = useState("");
  const [titleZh, setTitleZh] = useState("");
  const [slug, setSlug] = useState("");
  const [, setSlugTouched] = useState(false);
  const [category, setCategory] = useState("GUIDES");
  const [summary, setSummary] = useState("");
  const [summaryZh, setSummaryZh] = useState("");
  const [content, setContent] = useState("");
  const [contentZh, setContentZh] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [readTime, setReadTime] = useState("");
  const [status, setStatus] = useState<ArticleStatus>("DRAFT");

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [message, setMessage] = useState("");
  
  const [editLang, setEditLang] = useState<EditLanguage>("ZH");

  useEffect(() => {
    if (!isEdit || !articleId) return;
    let active = true;
    setLoading(true);
    void (async () => {
      try {
        const res = await fetch(`/api/admin/articles/${articleId}`, { cache: "no-store" });
        const json = (await res.json()) as ApiOk<ArticleRecord>;
        if (!active || !res.ok || !json.ok || !json.data) {
          if (active) setMessage("加载文章失败。");
          return;
        }
        const a = json.data;
        setTitle(a.title);
        setTitleZh(a.titleZh ?? "");
        setSlug(a.slug);
        setSlugTouched(true);
        setCategory(a.category);
        setSummary(a.summary);
        setSummaryZh(a.summaryZh ?? "");
        setContent(a.content);
        setContentZh(a.contentZh ?? "");
        setCoverImageUrl(a.coverImageUrl ?? "");
        setReadTime(a.readTime ?? "");
        setStatus(a.status);
      } catch {
        if (active) setMessage("网络异常。");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isEdit, articleId]);


  const uploadCover = async (file: File) => {
    setUploadingCover(true);
    setMessage("");
    try {
      const body = new FormData();
      body.append("kind", "image");
      body.append("file", file);
      if (coverImageUrl) body.append("oldUrl", coverImageUrl);
      const res = await fetch("/api/admin/uploads", { method: "POST", body });
      const json = (await res.json()) as { ok?: boolean; data?: { url: string } };
      if (!res.ok || !json.ok || !json.data?.url) {
        setMessage("封面上传失败。");
        return;
      }
      setCoverImageUrl(json.data.url);
      setMessage("封面上传成功。");
    } catch {
      setMessage("封面上传失败。");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const effectiveTitle = title.trim() || titleZh.trim();
    const effectiveSummary = summary.trim() || summaryZh.trim();
    const effectiveContent = content.trim() || contentZh.trim();

    const baseForSlug = slug || effectiveTitle;
    let finalSlug = normalizeSlug(baseForSlug);
    if (!finalSlug) {
      finalSlug = `article-${Date.now().toString(36)}`;
    }

    if (!effectiveTitle || !effectiveSummary || !effectiveContent) {
      setMessage("请填写必填项内容（标题、摘要与正文）。");
      return;
    }

    setSaving(true);
    try {
      if (isEdit && articleId) {
        const res = await fetch(`/api/admin/articles/${articleId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: effectiveTitle,
            titleZh: titleZh.trim() || null,
            slug: finalSlug,
            category: category.trim(),
            summary: effectiveSummary,
            summaryZh: summaryZh.trim() || null,
            content: effectiveContent,
            contentZh: contentZh.trim() || null,
            coverImageUrl: coverImageUrl.trim() || null,
            readTime: readTime.trim() || null,
            status,
          }),
        });
        const json = (await res.json()) as ApiOk<ArticleRecord>;
        if (!res.ok || !json.ok) {
          setMessage("保存失败，请检查表单或 slug 是否重复。");
          return;
        }
        setMessage("已保存。");
        router.push("/admin/articles");
        router.refresh();
        return;
      }

      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: effectiveTitle,
          titleZh: titleZh.trim() || null,
          slug: finalSlug,
          category: category.trim(),
          summary: effectiveSummary,
          summaryZh: summaryZh.trim() || null,
          content: effectiveContent,
          contentZh: contentZh.trim() || null,
          coverImageUrl: coverImageUrl.trim() || null,
          readTime: readTime.trim() || null,
          status,
        }),
      });
      const json = (await res.json()) as ApiOk<ArticleRecord>;
      if (!res.ok || !json.ok || !json.data) {
        setMessage(res.status === 409 ? "Slug 已存在，请换一个。" : "创建失败。");
        return;
      }
      router.push("/admin/articles");
      router.refresh();
    } catch {
      setMessage("请求失败。");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-black/[0.06] bg-white p-8 text-sm text-[#111111]/60">
        正在加载文章数据...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl pb-16">
      {/* Top Area: Settings & Media Cover */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-stretch">
        {/* Left: General Settings */}
        <section className="rounded-xl border border-black/[0.06] bg-white p-6 shadow-sm flex flex-col gap-5">
          <h2 className="text-sm font-semibold tracking-wider text-[#111111] uppercase">
            常规设置
          </h2>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                当前编辑语言选项卡
              </label>
              <div className="flex rounded-lg border border-black/10 bg-[#FAFAFA] p-1">
                <button
                  type="button"
                  onClick={() => setEditLang("ZH")}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-all ${
                    editLang === "ZH" ? "bg-emerald-600 shadow-sm text-white" : "text-[#111111]/50 hover:text-[#111111]"
                  }`}
                >
                  {editLang === "ZH" && <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />}
                  中文版 (Chinese)
                </button>
                <button
                  type="button"
                  onClick={() => setEditLang("EN")}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-all ${
                    editLang === "EN" ? "bg-[#333333] shadow-sm text-white" : "text-[#111111]/50 hover:text-[#111111]"
                  }`}
                >
                  {editLang === "EN" && <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />}
                  英文版 (English)
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                分类 *
              </label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-3 py-2.5 text-sm text-[#111111] outline-none focus:border-black/30 focus:bg-white"
                placeholder={editLang === "EN" ? "例如：GUIDES / MAINTENANCE" : "例如：行业新闻 / 最新资讯"}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                  阅读时间
                </label>
                <input
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-3 py-2.5 text-sm text-[#111111] outline-none focus:border-black/30 focus:bg-white"
                  placeholder="如: 8 min"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                  发布状态
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                  className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-3 py-2.5 text-sm text-[#111111] outline-none focus:border-black/30 focus:bg-white"
                >
                  <option value="DRAFT">草稿 (DRAFT)</option>
                  <option value="PUBLISHED">已发布 (PUBLISHED)</option>
                </select>
              </div>
            </div>
        </section>


        {/* Right: Media Cover */}
        <section className="rounded-xl border border-black/[0.06] bg-white p-6 shadow-sm flex flex-col">
          <h2 className="text-sm font-semibold tracking-wider text-[#111111] uppercase mb-5">
            媒体封面
          </h2>

          <div className="flex flex-col flex-1 gap-2">
            <label className="flex cursor-pointer shrink-0 items-center justify-center gap-2 rounded-lg border border-dashed border-black/20 bg-[#FAFAFA] px-3 py-3 text-xs font-medium text-[#111111]/65 hover:bg-black/[0.02]">
              <Upload size={14} />
              {uploadingCover ? "上传中..." : "上传封面（jpg/png/webp）"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadCover(f);
                  e.target.value = "";
                }}
                disabled={uploadingCover}
              />
            </label>
            {coverImageUrl ? (
              <div className="overflow-hidden rounded-lg border border-black/10 bg-black/[0.02] flex flex-col flex-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverImageUrl} alt="cover" className="w-full object-cover flex-1 min-h-[120px]" />
                <button
                  type="button"
                  onClick={() => setCoverImageUrl("")}
                  className="w-full shrink-0 border-t border-black/[0.06] px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                >
                  移除封面
                </button>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-black/10 bg-[#FAFAFA] text-[#111111]/25 min-h-[120px]">
                <ImageIcon size={24} />
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Bottom Area: Article Content */}
      <section className="rounded-xl border border-black/[0.06] bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col gap-1 items-start">
          <h2 className="text-sm font-semibold tracking-wider text-[#111111] uppercase">
            {editLang === "EN" ? "英文正文编辑" : "中文正文编辑"}
          </h2>
          <p className="text-xs text-[#111111]/50">
            当您切换左上角的编辑语言时，此处的表单会对应切换。如果只填写英文，前台将自动以英文兜底。
          </p>
        </div>

        {editLang === "EN" && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                英文标题 *
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：How to choose the right excavator?"
                className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-3 py-2.5 text-sm text-[#111111] outline-none focus:border-black/30 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                英文摘要 *
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                placeholder="Brief introduction or excerpt for the article list..."
                className="w-full resize-none rounded-lg border border-black/10 bg-[#FAFAFA] px-3 py-2.5 text-sm text-[#111111] outline-none focus:border-black/30 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                  英文正文 *
                </label>
                <span className="text-[11px] text-[#111111]/40 uppercase">HTML SUPPORTED</span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
                placeholder="<p>Article content goes here...</p>"
                className="w-full resize-y rounded-lg border border-black/10 bg-[#FAFAFA] px-3 py-2.5 font-mono text-[13px] text-[#111111] outline-none focus:border-black/30 focus:bg-white"
              />
            </div>
          </div>
        )}

        {editLang === "ZH" && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                中文标题
              </label>
              <input
                value={titleZh}
                onChange={(e) => setTitleZh(e.target.value)}
                placeholder="例如：如何选择合适的挖掘机？"
                className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-3 py-2.5 text-sm text-[#111111] outline-none focus:border-black/30 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                中文摘要
              </label>
              <textarea
                value={summaryZh}
                onChange={(e) => setSummaryZh(e.target.value)}
                rows={3}
                placeholder="用于文章列表的简明扼要介绍..."
                className="w-full resize-none rounded-lg border border-black/10 bg-[#FAFAFA] px-3 py-2.5 text-sm text-[#111111] outline-none focus:border-black/30 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                  中文正文
                </label>
                <span className="text-[11px] text-[#111111]/40 uppercase">HTML SUPPORTED</span>
              </div>
              <textarea
                value={contentZh}
                onChange={(e) => setContentZh(e.target.value)}
                rows={16}
                placeholder="<p>中文正文内容...</p>"
                className="w-full resize-y rounded-lg border border-black/10 bg-[#FAFAFA] px-3 py-2.5 font-mono text-[13px] text-[#111111] outline-none focus:border-black/30 focus:bg-white"
              />
            </div>
          </div>
        )}

        <div className="border-t border-black/[0.06] pt-6 mt-4">
          <div className="flex items-center justify-between">
            {message ? (
              <p
                className={`text-xs ${
                  message.includes("成功") || message === "已保存。"
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >
                {message}
              </p>
            ) : (
              <div />
            )}
            <button
              type="submit"
              disabled={saving || uploadingCover}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#111111] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? "保存中..." : "保存当前文章内容"}
            </button>
          </div>
        </div>
      </section>
    </form>
  );
}
