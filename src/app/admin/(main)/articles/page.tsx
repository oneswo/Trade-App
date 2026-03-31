"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Edit2, Plus, Search, Trash2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AdminModal from "@/components/admin/AdminModal";
import type { ArticleRecord } from "@/lib/data/repository";
import { readClientCache, writeClientCache } from "@/lib/cache/client-cache";
import { fetchJson, isAbortLikeError } from "@/lib/http/client";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PUBLISHED: { label: "已发布", className: "bg-green-50 text-green-700 border-green-200" },
  DRAFT: { label: "草稿", className: "bg-gray-100 text-gray-500 border-gray-200" },
};
const ARTICLES_CACHE_KEY = "admin:articles:list";
const ARTICLES_CACHE_TTL_MS = 30 * 1000;

export default function ArticlesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<ArticleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const fetchControllerRef = useRef<AbortController | null>(null);
  const didInitFromUrlRef = useRef(false);

  const fetchArticles = async () => {
    fetchControllerRef.current?.abort();
    const controller = new AbortController();
    fetchControllerRef.current = controller;
    setLoading(true);
    const cached = readClientCache<ArticleRecord[]>(ARTICLES_CACHE_KEY, ARTICLES_CACHE_TTL_MS);
    if (cached) {
      setArticles(cached);
      setLoading(false);
    }
    try {
      const json = await fetchJson<{ ok: boolean; data: ArticleRecord[] }>("/api/admin/articles", {
        signal: controller.signal,
      });
      if (json.ok) setArticles(json.data);
      if (json.ok) writeClientCache(ARTICLES_CACHE_KEY, json.data);
    } catch (error) {
      if (isAbortLikeError(error)) return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchArticles();
    return () => fetchControllerRef.current?.abort();
  }, []);

  useEffect(() => {
    if (didInitFromUrlRef.current) return;
    const q = searchParams.get("q") ?? "";
    setSearchQuery(q);
    setDebouncedSearchQuery(q);
    didInitFromUrlRef.current = true;
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!didInitFromUrlRef.current) return;
    const params = new URLSearchParams(searchParams.toString());
    const q = debouncedSearchQuery.trim();
    if (q) params.set("q", q);
    else params.delete("q");
    const next = params.toString();
    const current = searchParams.toString();
    if (next !== current) {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }
  }, [debouncedSearchQuery, pathname, router, searchParams]);

  const filtered = useMemo(() => {
    const kw = debouncedSearchQuery.trim().toLowerCase();
    if (!kw) return articles;
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(kw) ||
        (a.titleZh ?? "").toLowerCase().includes(kw) ||
        a.slug.toLowerCase().includes(kw) ||
        a.category.toLowerCase().includes(kw)
    );
  }, [articles, debouncedSearchQuery]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/articles/${deleteId}`, { method: "DELETE" });
      if (!response.ok) return;
      setArticles((prev) => prev.filter((item) => item.id !== deleteId));
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleToggleStatus = async (article: ArticleRecord) => {
    const newStatus = article.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const response = await fetch(`/api/admin/articles/${article.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) return;
    setArticles((prev) =>
      prev.map((item) =>
        item.id === article.id
          ? {
              ...item,
              status: newStatus,
              publishedAt: newStatus === "PUBLISHED" ? item.publishedAt ?? new Date().toISOString() : item.publishedAt,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between gap-4 rounded-xl border border-black/[0.06] bg-white p-2 shadow-sm">
        <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 w-[280px] focus-within:bg-black/[0.02]">
          <Search size={16} className="text-[#111111]/30 shrink-0" />
          <input
            type="text"
            placeholder="搜索标题 / slug / 分类..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-[#111111] placeholder:text-[#111111]/30 outline-none"
          />
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 rounded-xl bg-[#111111] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-black/80 transition-colors"
        >
          <Plus size={15} />
          新建文章
        </Link>
      </div>

      {/* 列表 */}
      <div className="rounded-2xl border border-black/[0.06] bg-white shadow-sm overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_0.8fr_0.8fr_0.8fr] items-center gap-4 border-b border-black/[0.05] bg-black/[0.02] px-6 py-3 text-[10px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
          <div>文章标题</div>
          <div>分类</div>
          <div>阅读时间</div>
          <div>状态</div>
          <div className="text-right">操作</div>
        </div>

        <div className="divide-y divide-black/[0.04]">
          {loading ? (
            <div className="px-6 py-10 text-sm text-[#111111]/45">加载中...</div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-10 text-sm text-[#111111]/45">暂无文章</div>
          ) : (
            filtered.map((article) => {
              const statusConfig = STATUS_LABELS[article.status] ?? STATUS_LABELS.DRAFT;
              return (
                <div
                  key={article.id}
                  className="grid grid-cols-[2fr_1fr_0.8fr_0.8fr_0.8fr] items-center gap-4 px-6 py-4 hover:bg-black/[0.015] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#111111] truncate">{article.title}</p>
                    {article.titleZh && (
                      <p className="text-[11px] text-[#111111]/40 truncate mt-0.5">{article.titleZh}</p>
                    )}
                    <p className="text-[10px] text-[#111111]/30 mt-0.5 font-mono">{article.slug}</p>
                  </div>
                  <div className="text-[12px] text-[#111111]/60">{article.category}</div>
                  <div className="text-[12px] text-[#111111]/50">{article.readTime ?? "—"}</div>
                  <div>
                    <button
                      onClick={() => void handleToggleStatus(article)}
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase hover:opacity-80 transition-opacity ${statusConfig.className}`}
                      title="点击切换状态"
                    >
                      {statusConfig.label}
                    </button>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/[0.03] text-[#111111]/50 hover:bg-[#111111] hover:text-white transition-colors"
                      title="编辑"
                    >
                      <Edit2 size={13} />
                    </Link>
                    <button
                      onClick={() => setDeleteId(article.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/[0.03] text-[#111111]/50 hover:bg-red-500 hover:text-white transition-colors"
                      title="删除"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 删除确认弹窗 */}
      <AdminModal
        isOpen={!!deleteId}
        title="删除文章"
        description="此操作不可撤销，确认删除该文章吗？"
        confirmLabel={deleting ? "删除中..." : "确认删除"}
        isDestructive
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
