"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
  Video,
} from "lucide-react";

type ProductStatus = "DRAFT" | "PUBLISHED";
type UploadKind = "image" | "video";

interface ProductSpecInput {
  key: string;
  value: string;
}

interface ProductFormState {
  name: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  status: ProductStatus;
  specs: ProductSpecInput[];
  coverImageUrl: string;
  galleryImageUrls: string[];
  videoUrl: string;
}

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  status: ProductStatus;
  specs: ProductSpecInput[];
  coverImageUrl: string | null;
  galleryImageUrls: string[];
  videoUrl: string | null;
}

interface ApiResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

interface ProductEditorFormProps {
  mode: "create" | "edit";
  productId?: string;
}

const CATEGORIES = [
  "Large Excavators",
  "Mini Excavators",
  "Compact Excavators",
  "Bulldozers",
  "Loaders",
];

const defaultForm: ProductFormState = {
  name: "",
  slug: "",
  category: CATEGORIES[0],
  summary: "",
  description: "",
  status: "DRAFT",
  specs: [{ key: "", value: "" }],
  coverImageUrl: "",
  galleryImageUrls: [],
  videoUrl: "",
};

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueList(values: string[]) {
  return [...new Set(values.filter(Boolean).map((item) => item.trim()))];
}

export default function ProductEditorForm({
  mode,
  productId,
}: ProductEditorFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const [form, setForm] = useState<ProductFormState>(defaultForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState({
    cover: false,
    gallery: false,
    video: false,
  });

  useEffect(() => {
    if (!isEdit || !productId) return;

    let active = true;
    setLoading(true);
    setMessage("");

    const load = async () => {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          cache: "no-store",
        });
        const result = (await response.json()) as ApiResult<ProductDetail>;

        if (!active) return;

        if (!response.ok || !result.ok || !result.data) {
          setMessage("加载产品数据失败，请返回列表重试。");
          return;
        }

        const product = result.data;
        setForm({
          name: product.name,
          slug: product.slug,
          category: product.category,
          summary: product.summary,
          description: product.description,
          status: product.status,
          specs:
            product.specs.length > 0 ? product.specs : [{ key: "", value: "" }],
          coverImageUrl: product.coverImageUrl ?? "",
          galleryImageUrls: product.galleryImageUrls ?? [],
          videoUrl: product.videoUrl ?? "",
        });
        setSlugTouched(true);
      } catch {
        if (!active) return;
        setMessage("网络异常，加载失败。");
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [isEdit, productId]);

  const disabled = useMemo(
    () => saving || uploading.cover || uploading.gallery || uploading.video,
    [saving, uploading]
  );

  const setField = <K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateSpec = (index: number, key: keyof ProductSpecInput, value: string) => {
    setForm((prev) => {
      const next = [...prev.specs];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, specs: next };
    });
  };

  const addSpec = () => {
    setForm((prev) => ({ ...prev, specs: [...prev.specs, { key: "", value: "" }] }));
  };

  const removeSpec = (index: number) => {
    setForm((prev) => {
      const next = prev.specs.filter((_, idx) => idx !== index);
      return { ...prev, specs: next.length > 0 ? next : [{ key: "", value: "" }] };
    });
  };

  const uploadFile = async (file: File, kind: UploadKind) => {
    const body = new FormData();
    body.append("kind", kind);
    body.append("file", file);

    const response = await fetch("/api/admin/uploads", {
      method: "POST",
      body,
    });

    const result = (await response.json()) as ApiResult<{ url: string }>;
    if (!response.ok || !result.ok || !result.data) {
      throw new Error(result.error || "upload_failed");
    }

    return result.data.url;
  };

  const handleCoverUpload = async (file: File) => {
    setUploading((prev) => ({ ...prev, cover: true }));
    setMessage("");
    try {
      const url = await uploadFile(file, "image");
      setField("coverImageUrl", url);
      setMessage("封面上传成功。");
    } catch {
      setMessage("封面上传失败，请检查文件类型和大小。");
    } finally {
      setUploading((prev) => ({ ...prev, cover: false }));
    }
  };

  const handleGalleryUpload = async (files: FileList) => {
    if (files.length === 0) return;
    setUploading((prev) => ({ ...prev, gallery: true }));
    setMessage("");

    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const url = await uploadFile(file, "image");
        uploaded.push(url);
      }
      setField("galleryImageUrls", uniqueList([...form.galleryImageUrls, ...uploaded]));
      setMessage(`已上传 ${uploaded.length} 张图片。`);
    } catch {
      setMessage("图片上传失败，请检查格式与大小限制。");
    } finally {
      setUploading((prev) => ({ ...prev, gallery: false }));
    }
  };

  const handleVideoUpload = async (file: File) => {
    setUploading((prev) => ({ ...prev, video: true }));
    setMessage("");
    try {
      const url = await uploadFile(file, "video");
      setField("videoUrl", url);
      setMessage("视频上传成功。");
    } catch {
      setMessage("视频上传失败，请上传 mp4/webm/mov 格式。");
    } finally {
      setUploading((prev) => ({ ...prev, video: false }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");

    const slug = normalizeSlug(form.slug || form.name);
    if (!form.name.trim()) {
      setMessage("请先填写产品名称。");
      return;
    }
    if (!slug) {
      setMessage("请填写可用的英文 slug。");
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      slug,
      category: form.category.trim(),
      summary: form.summary.trim(),
      description: form.description.trim(),
      status: form.status,
      specs: form.specs
        .map((item) => ({ key: item.key.trim(), value: item.value.trim() }))
        .filter((item) => item.key && item.value),
      coverImageUrl: form.coverImageUrl.trim() || null,
      galleryImageUrls: uniqueList(form.galleryImageUrls),
      videoUrl: form.videoUrl.trim() || null,
    };

    try {
      const endpoint = isEdit
        ? `/api/admin/products/${productId}`
        : "/api/admin/products";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as ApiResult<ProductDetail>;
      if (!response.ok || !result.ok || !result.data) {
        if (result.error === "slug_exists") {
          setMessage("Slug 已存在，请换一个。");
        } else if (result.error === "validation_failed") {
          setMessage("字段校验未通过，请检查必填项和长度。");
        } else {
          setMessage("保存失败，请重试。");
        }
        return;
      }

      if (!isEdit) {
        router.push(`/admin/products/${result.data.id}/edit`);
        router.refresh();
        return;
      }

      setForm((prev) => ({ ...prev, slug: result.data!.slug }));
      setMessage("保存成功。");
      router.refresh();
    } catch {
      setMessage("网络异常，保存失败。");
    } finally {
      setSaving(false);
    }
  };

  const title = isEdit ? "编辑产品" : "新建产品";
  const subtitle = isEdit && productId ? `ID: ${productId}` : "创建一个可发布的新产品";

  if (loading) {
    return (
      <div className="rounded-xl border border-black/[0.06] bg-white p-8 text-sm text-[#111111]/60">
        正在加载产品数据...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.06] bg-white transition-colors hover:bg-black/[0.04]"
        >
          <ArrowLeft size={16} className="text-[#111111]/70" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">{title}</h1>
          <p className="mt-1 text-sm text-[#111111]/40">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[7fr_3fr] items-start">
        <div className="space-y-6">
          <section className="rounded-xl border border-black/[0.06] bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-semibold tracking-wider text-[#111111] uppercase">
              基本信息
            </h2>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                产品名称
              </label>
              <input
                value={form.name}
                onChange={(event) => {
                  const name = event.target.value;
                  setField("name", name);
                  if (!slugTouched) {
                    setField("slug", normalizeSlug(name));
                  }
                }}
                placeholder="例如：KXTJ-360 Hydraulic Excavator"
                className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-3 py-2.5 text-sm text-[#111111] outline-none focus:border-black/30 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                URL Slug
              </label>
              <input
                value={form.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setField("slug", event.target.value);
                }}
                placeholder="kxtj-360-hydraulic-excavator"
                className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-3 py-2.5 text-sm text-[#111111] outline-none focus:border-black/30 focus:bg-white"
              />
              <p className="text-[11px] text-[#111111]/35">
                系统会自动规范化为小写英文加中划线。
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                  分类
                </label>
                <select
                  value={form.category}
                  onChange={(event) => setField("category", event.target.value)}
                  className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-3 py-2.5 text-sm text-[#111111] outline-none focus:border-black/30 focus:bg-white"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                  上架状态
                </label>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setField("status", event.target.value as ProductStatus)
                  }
                  className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-3 py-2.5 text-sm text-[#111111] outline-none focus:border-black/30 focus:bg-white"
                >
                  <option value="DRAFT">草稿</option>
                  <option value="PUBLISHED">已发布</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                摘要
              </label>
              <textarea
                value={form.summary}
                onChange={(event) => setField("summary", event.target.value)}
                rows={3}
                placeholder="一句话说明产品卖点"
                className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-3 py-2.5 text-sm text-[#111111] outline-none focus:border-black/30 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                详细描述
              </label>
              <textarea
                value={form.description}
                onChange={(event) => setField("description", event.target.value)}
                rows={8}
                placeholder="填写产品完整介绍（可先纯文本，后续再接富文本）"
                className="w-full rounded-lg border border-black/10 bg-[#FAFAFA] px-3 py-2.5 text-sm text-[#111111] outline-none focus:border-black/30 focus:bg-white"
              />
            </div>
          </section>

          <section className="rounded-xl border border-black/[0.06] bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wider text-[#111111] uppercase">
                规格参数
              </h2>
              <button
                type="button"
                onClick={addSpec}
                className="inline-flex items-center gap-1 rounded-md bg-black/[0.04] px-3 py-1.5 text-xs font-medium text-[#111111] hover:bg-black/[0.08]"
              >
                <Plus size={13} />
                添加
              </button>
            </div>

            <div className="space-y-3">
              {form.specs.map((spec, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_1fr_auto] items-center gap-3 rounded-lg border border-black/[0.05] bg-[#FAFAFA] p-2"
                >
                  <input
                    value={spec.key}
                    onChange={(event) => updateSpec(index, "key", event.target.value)}
                    placeholder="Key"
                    className="w-full rounded-md border border-black/10 bg-white px-2.5 py-2 text-sm outline-none focus:border-black/30"
                  />
                  <input
                    value={spec.value}
                    onChange={(event) => updateSpec(index, "value", event.target.value)}
                    placeholder="Value"
                    className="w-full rounded-md border border-black/10 bg-white px-2.5 py-2 text-sm outline-none focus:border-black/30"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(index)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-[#111111]/40 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6 xl:sticky xl:top-24">
          <section className="rounded-xl border border-black/[0.06] bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-semibold tracking-wider text-[#111111] uppercase">
              媒体管理
            </h2>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                  封面图
                </label>
                {uploading.cover ? (
                  <span className="text-[11px] text-[#111111]/40">上传中...</span>
                ) : null}
              </div>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-black/20 bg-[#FAFAFA] px-3 py-3 text-xs font-medium text-[#111111]/65 hover:bg-black/[0.02]">
                <Upload size={14} />
                上传封面（jpg/png/webp，&lt;=8MB）
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void handleCoverUpload(file);
                    event.currentTarget.value = "";
                  }}
                />
              </label>
              {form.coverImageUrl ? (
                <div className="overflow-hidden rounded-lg border border-black/10 bg-black/[0.02]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.coverImageUrl}
                    alt="cover"
                    className="h-40 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setField("coverImageUrl", "")}
                    className="w-full border-t border-black/[0.06] px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                  >
                    移除封面
                  </button>
                </div>
              ) : (
                <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-black/10 bg-[#FAFAFA] text-[#111111]/25">
                  <ImageIcon size={18} />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                  图库图片
                </label>
                {uploading.gallery ? (
                  <span className="text-[11px] text-[#111111]/40">上传中...</span>
                ) : null}
              </div>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-black/20 bg-[#FAFAFA] px-3 py-3 text-xs font-medium text-[#111111]/65 hover:bg-black/[0.02]">
                <Upload size={14} />
                批量上传图片
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    if (event.target.files) void handleGalleryUpload(event.target.files);
                    event.currentTarget.value = "";
                  }}
                />
              </label>
              {form.galleryImageUrls.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {form.galleryImageUrls.map((url) => (
                    <div key={url} className="relative overflow-hidden rounded-md border border-black/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="gallery" className="h-20 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          setField(
                            "galleryImageUrls",
                            form.galleryImageUrls.filter((item) => item !== url)
                          )
                        }
                        className="absolute right-1 top-1 rounded bg-black/70 px-1 py-0.5 text-[10px] text-white"
                      >
                        删除
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                  产品视频
                </label>
                {uploading.video ? (
                  <span className="text-[11px] text-[#111111]/40">上传中...</span>
                ) : null}
              </div>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-black/20 bg-[#FAFAFA] px-3 py-3 text-xs font-medium text-[#111111]/65 hover:bg-black/[0.02]">
                <Video size={14} />
                上传视频（mp4/webm/mov，&lt;=80MB）
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void handleVideoUpload(file);
                    event.currentTarget.value = "";
                  }}
                />
              </label>
              {form.videoUrl ? (
                <div className="space-y-2 rounded-lg border border-black/10 bg-[#FAFAFA] p-2">
                  <video src={form.videoUrl} controls className="h-40 w-full rounded bg-black" />
                  <button
                    type="button"
                    onClick={() => setField("videoUrl", "")}
                    className="w-full rounded border border-black/10 px-2 py-1.5 text-xs text-red-600 hover:bg-red-50"
                  >
                    移除视频
                  </button>
                </div>
              ) : null}
            </div>
          </section>

          <button
            type="submit"
            disabled={disabled}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#111111] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "保存中..." : "保存产品"}
          </button>

          {message ? (
            <p className="rounded-lg border border-black/[0.06] bg-white px-3 py-2 text-xs text-[#111111]/70">
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
