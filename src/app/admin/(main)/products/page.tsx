"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Edit2,
  Filter,
  Image as ImageIcon,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";

type ProductStatus = "DRAFT" | "PUBLISHED";

interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  status: ProductStatus;
  coverImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProductListResult {
  ok: boolean;
  data?: ProductListItem[];
  error?: string;
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "全部状态" },
  { value: "PUBLISHED", label: "已发布" },
  { value: "DRAFT", label: "草稿" },
];

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("zh-CN");
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("全部分类");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/admin/products", { cache: "no-store" });
      const result = (await response.json()) as ProductListResult;

      if (!response.ok || !result.ok || !result.data) {
        setErrorMessage("加载产品失败，请刷新重试。");
        return;
      }

      setProducts(result.data);
    } catch {
      setErrorMessage("网络异常，加载失败。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const values = [...new Set(products.map((item) => item.category))];
    return ["全部分类", ...values];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesKeyword =
        !keyword ||
        product.name.toLowerCase().includes(keyword) ||
        product.slug.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword);

      const matchesStatus =
        selectedStatus === "ALL" || product.status === selectedStatus;

      const matchesCategory =
        selectedCategory === "全部分类" || product.category === selectedCategory;

      return matchesKeyword && matchesStatus && matchesCategory;
    });
  }, [products, searchQuery, selectedStatus, selectedCategory]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);

    try {
      const response = await fetch(`/api/admin/products/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setErrorMessage("删除失败，请重试。");
        return;
      }

      setProducts((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    } catch {
      setErrorMessage("网络异常，删除失败。");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 rounded-xl border border-black/[0.06] bg-white p-2 shadow-sm">
        <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 w-[280px] shrink-0 transition-colors focus-within:bg-black/[0.02]">
          <Search size={16} className="text-[#111111]/30 shrink-0" />
          <input
            type="text"
            placeholder="搜索名称 / slug / 分类..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-[#111111] placeholder:text-[#111111]/30 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2">
            <div className="relative flex items-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 text-[13px] font-medium transition-colors hover:bg-black/[0.02]">
              <Filter size={13} className="text-[#111111]/40" />
              <select
                className="appearance-none bg-transparent text-[#111111]/70 outline-none cursor-pointer pr-4"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="h-4 w-px bg-black/[0.06] mx-1" />

            <div className="relative flex items-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 text-[13px] font-medium transition-colors hover:bg-black/[0.02]">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <select
                className="appearance-none bg-transparent text-[#111111]/70 outline-none cursor-pointer pr-4"
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value)}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-5 w-px bg-black/[0.06] mx-1" />

          <span className="text-[12px] font-semibold text-[#111111]/40 px-2">
            共 {filteredProducts.length} 件
          </span>

          <Link
            href="/admin/products/new"
            className="flex items-center gap-1.5 rounded-md bg-[#111111] px-3 py-2 text-[13px] font-medium text-white transition-colors hover:bg-black/80 shadow-sm"
          >
            <Plus size={14} strokeWidth={2.5} />
            新建产品
          </Link>
        </div>
      </div>

      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          {errorMessage}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-black/[0.06] bg-white shadow-sm">
        <div className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_auto] items-center gap-4 border-b border-black/[0.05] bg-black/[0.02] px-6 py-3 text-[10px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
          <div className="w-12">封面</div>
          <div>产品名称</div>
          <div>分类</div>
          <div>状态</div>
          <div>创建时间</div>
          <div className="w-16 text-right">操作</div>
        </div>

        <div className="divide-y divide-black/[0.04]">
          {loading ? (
            <div className="px-6 py-8 text-sm text-[#111111]/50 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              正在加载产品...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="px-6 py-8 text-sm text-[#111111]/50">暂无产品数据</div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group grid grid-cols-[auto_2fr_1fr_1fr_1fr_auto] items-center gap-4 px-6 py-4 transition-colors hover:bg-[#F8F9FA]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-black/[0.06] bg-black/[0.02] overflow-hidden">
                  {product.coverImageUrl ? (
                    <img
                      src={product.coverImageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={18} className="text-[#111111]/20" />
                  )}
                </div>

                <div>
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="font-semibold text-[#111111] hover:underline"
                  >
                    {product.name}
                  </Link>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-[#111111]/40">Slug: {product.slug}</span>
                  </div>
                </div>

                <div>
                  <span className="inline-flex items-center rounded-md bg-black/[0.04] px-2 py-1 text-xs font-medium text-[#111111]/60">
                    {product.category}
                  </span>
                </div>

                <div>
                  {product.status === "PUBLISHED" ? (
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span className="text-xs font-medium text-[#111111]/70">已发布</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                      <span className="text-xs font-medium text-[#111111]/50">草稿</span>
                    </div>
                  )}
                </div>

                <div className="text-sm text-[#111111]/50">
                  {formatDate(product.createdAt)}
                </div>

                <div className="flex w-16 justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-[#111111]/40 hover:bg-black/[0.04] hover:text-[#111111]"
                  >
                    <Edit2 size={14} />
                  </Link>
                  <button
                    onClick={() => setDeleteId(product.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-[#111111]/40 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AdminModal
        isOpen={Boolean(deleteId)}
        onClose={() => !deleting && setDeleteId(null)}
        onConfirm={handleDelete}
        title="确认删除该产品吗？"
        description="此操作会从产品列表中移除该条目。若需要保留历史，请改为草稿状态。"
        confirmLabel="删除产品"
        loading={deleting}
        isDestructive
      />
    </div>
  );
}
