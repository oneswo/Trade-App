"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { BasicMetaSection } from "./product-editor/BasicMetaSection";
import { CoreSpecsSection } from "./product-editor/CoreSpecsSection";
import {
  MediaGallerySection,
  type MediaSlot,
  type SlotUploadState,
} from "./product-editor/MediaGallerySection";
import { ProductEditorHeader } from "./product-editor/ProductEditorHeader";
import { TechSpecsSection } from "./product-editor/TechSpecsSection";
import type {
  CategoryOption,
  ProductEditorContent,
  ProductEditorCoreMetrics,
  ProductEditorSpec,
} from "./product-editor/types";

const SLOT_COUNT = 5;
const emptySlot = (): MediaSlot => ({ url: "", type: "" });
const emptyState = (): SlotUploadState => ({
  uploading: false,
  progress: 0,
  error: "",
  showSuccess: false,
});

export default function ProductEditorForm({
  productId,
}: {
  productId?: string;
}) {
  const router = useRouter();
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const isEdit = !!productId;
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [savingStatus, setSavingStatus] = useState<"IDLE" | "DRAFT" | "PUBLISHED">(
    "IDLE"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [enableTrustCards, setEnableTrustCards] = useState(true);
  const [stockAmount, setStockAmount] = useState<number>(3);
  const [category, setCategory] = useState("");
  const [content, setContent] = useState<ProductEditorContent>({
    nameZh: "",
    nameEn: "",
    summaryZh: "",
    summaryEn: "",
  });
  const [coreMetrics, setCoreMetrics] = useState<ProductEditorCoreMetrics>({
    year: "",
    hours: "",
    tonnage: "",
    location: "",
    model: "",
    brand: "",
  });
  const [specs, setSpecs] = useState<ProductEditorSpec[]>([
    { key: "Engine Model (型号)", value: "CAT C6.4 ACERT" },
    { key: "Net Power (净功率)", value: "103 kW (138 hp)" },
    { key: "Bucket Capacity (铲斗容量)", value: "1.2 m³" },
    { key: "Max Digging Depth (挖掘深度)", value: "6,650 mm" },
  ]);
  const [description, setDescription] = useState("");
  const [mediaSlots, setMediaSlots] = useState<MediaSlot[]>(
    () => Array.from({ length: SLOT_COUNT }, emptySlot),
  );
  const [slotStates, setSlotStates] = useState<SlotUploadState[]>(
    () => Array.from({ length: SLOT_COUNT }, emptyState),
  );
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.data) {
          setCategories(data.data.filter((item: { enabled: boolean }) => item.enabled));
          setCategory((prev) => (prev || data.data.length === 0 ? prev : data.data[0].slug));
        }
      })
      .catch(console.error);
  }, []);

  // ── Slot 上传 ──────────────────────────────────────────────────

  const handleSlotUpload = useCallback(async (index: number, file: File) => {
    const kind = file.type.startsWith("video/") ? "video" as const : "image" as const;

    // 获取旧文件 URL（用于上传成功后删除）
    const oldUrl = mediaSlots[index]?.url;

    // 设置上传中状态
    setSlotStates((prev) => {
      const next = [...prev];
      next[index] = { uploading: true, progress: 0, error: "", showSuccess: false };
      return next;
    });
    setSelectedSlot(index);

    try {
      const { directUploadWithProgress } = await import("@/lib/upload");
      const result = await directUploadWithProgress(file, kind, (percent) => {
        setSlotStates((prev) => {
          const next = [...prev];
          next[index] = { ...next[index], progress: percent };
          return next;
        });
      });

      // 上传成功 → 写入 slot
      setMediaSlots((prev) => {
        const next = [...prev];
        next[index] = { url: result.url, type: kind };
        return next;
      });
      setSlotStates((prev) => {
        const next = [...prev];
        next[index] = { uploading: false, progress: 100, error: "", showSuccess: true };
        return next;
      });

      // 删除旧文件（异步，不阻塞 UI）
      if (oldUrl && oldUrl.startsWith("http")) {
        fetch("/api/admin/media/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: [oldUrl] }),
        }).catch(console.error);
      }

      // 2 秒后清除成功勾
      setTimeout(() => {
        setSlotStates((prev) => {
          const next = [...prev];
          if (next[index]?.showSuccess) {
            next[index] = { ...next[index], showSuccess: false };
          }
          return next;
        });
      }, 2000);
    } catch (err) {
      setSlotStates((prev) => {
        const next = [...prev];
        next[index] = {
          uploading: false,
          progress: 0,
          error: err instanceof Error ? err.message : "上传失败",
          showSuccess: false,
        };
        return next;
      });
    }
  }, [mediaSlots]);

  const handleRemoveSlot = useCallback(async (index: number) => {
    const currentSlot = mediaSlots[index];
    const urlToDelete = currentSlot?.url;

    // 先清除前端状态
    setMediaSlots((prev) => {
      const next = [...prev];
      next[index] = emptySlot();
      return next;
    });
    setSlotStates((prev) => {
      const next = [...prev];
      next[index] = emptyState();
      return next;
    });

    // 异步删除 R2 文件（不阻塞 UI）
    if (urlToDelete && urlToDelete.startsWith("http")) {
      fetch("/api/admin/media/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: [urlToDelete] }),
      }).catch(console.error);
    }
  }, [mediaSlots]);

  // ── 从 slots 派生出提交用的字段 ──────────────────────────────

  const coverImageUrl = mediaSlots[0]?.type !== "video" ? mediaSlots[0]?.url || "" : "";
  const videoUrl = (() => {
    // 如果主图是视频，用它
    if (mediaSlots[0]?.type === "video" && mediaSlots[0]?.url) return mediaSlots[0].url;
    // 否则找 gallery 里的第一个视频
    for (let i = 1; i < SLOT_COUNT; i++) {
      if (mediaSlots[i]?.type === "video" && mediaSlots[i]?.url) return mediaSlots[i].url;
    }
    return "";
  })();
  const galleryImageUrls = mediaSlots
    .slice(1)
    .filter((s) => s.url && s.type !== "video")
    .map((s) => s.url);

  useEffect(() => {
    if (!isEdit || !productId) return;

    fetch(`/api/admin/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.data) {
          const product = data.data;
          setCategory(product.category);
          setEnableTrustCards(product.enableTrustCards ?? true);
          setStockAmount(product.stockAmount ?? 3);
          setContent({
            nameZh: product.nameZh || "",
            nameEn: product.nameEn || "",
            summaryZh: product.summaryZh || "",
            summaryEn: product.summaryEn || "",
          });
          if (product.coreMetrics) {
            setCoreMetrics({
              year: product.coreMetrics.year || "",
              hours: product.coreMetrics.hours || "",
              tonnage: product.coreMetrics.tonnage || "",
              location: product.coreMetrics.location || "",
              model: product.coreMetrics.model || "",
              brand: product.coreMetrics.brand || "",
            });
          }
          if (product.specs && product.specs.length > 0) {
            setSpecs(product.specs);
          }
          setDescription(product.description || "");

          // 从旧字段还原到 slots
          const loaded: MediaSlot[] = Array.from({ length: SLOT_COUNT }, emptySlot);
          if (product.coverImageUrl) {
            loaded[0] = { url: product.coverImageUrl, type: "image" };
          }
          if (product.videoUrl && !product.coverImageUrl) {
            loaded[0] = { url: product.videoUrl, type: "video" };
          }
          const gallery: string[] = product.galleryImageUrls || [];
          for (let i = 0; i < gallery.length && i < SLOT_COUNT - 1; i++) {
            loaded[i + 1] = { url: gallery[i], type: "image" };
          }
          // 如果主图已经是图片且有视频，把视频放到最后空位
          if (product.videoUrl && product.coverImageUrl) {
            const emptyIdx = loaded.findIndex((s) => !s.url);
            if (emptyIdx !== -1) {
              loaded[emptyIdx] = { url: product.videoUrl, type: "video" };
            }
          }
          setMediaSlots(loaded);
        } else {
          setErrorMsg("加载产品数据失败");
        }
      })
      .catch(() => setErrorMsg("网络异常，加载失败"))
      .finally(() => setInitialLoading(false));
  }, [isEdit, productId]);

  const handleSubmit = async (statusToSave: "DRAFT" | "PUBLISHED") => {
    // ── 草稿不验证必填项，发布才验证 ──
    if (statusToSave === "PUBLISHED") {
      const errors: { field: string; message: string }[] = [];

      if (!content.nameZh && !content.nameEn) {
        errors.push({ field: "field-basic", message: "请至少填写一个语言的主标题" });
      } else {
        // 检查主标题最小长度（后端要求至少2个字符）
        const mainName = content.nameZh || content.nameEn;
        if (mainName.trim().length < 2) {
          errors.push({ field: "field-basic", message: "主标题至少需要 2 个字符" });
        }
      }
      if (!category.trim()) {
        errors.push({ field: "field-basic", message: "请选择产品分类" });
      }

      if (errors.length > 0) {
        setValidationErrors(errors.map((e) => e.message));
        setShowValidationModal(true);
        setErrorMsg("");
        return;
      }
    }

    setValidationErrors([]);
    setShowValidationModal(false);
    setSavingStatus(statusToSave);
    setErrorMsg("");

    try {
      const payload = {
        name: content.nameZh || content.nameEn || "未命名设备",
        nameZh: content.nameZh,
        nameEn: content.nameEn,
        category,
        summary: content.summaryZh || content.summaryEn || "",
        summaryZh: content.summaryZh,
        summaryEn: content.summaryEn,
        description,
        stockAmount,
        enableTrustCards,
        coreMetrics,
        specs: specs.filter((spec) => spec.key.trim() && spec.value.trim()),
        coverImageUrl: coverImageUrl || null,
        galleryImageUrls,
        videoUrl: videoUrl || null,
        status: statusToSave,
      };

      const res = await fetch(
        isEdit ? `/api/admin/products/${productId}` : "/api/admin/products",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || "接口保存失败");
        setSavingStatus("IDLE");
        return;
      }

      router.push("/admin/products");
    } catch {
      setErrorMsg("网络异常，无法连接后台。");
      setSavingStatus("IDLE");
    }
  };

  const addSpecLine = () => setSpecs([...specs, { key: "", value: "" }]);

  const removeSpecLine = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: "key" | "value", value: string) => {
    const nextSpecs = [...specs];
    nextSpecs[index][field] = value;
    setSpecs(nextSpecs);
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-[#111111]/30" />
      </div>
    );
  }

  return (
    <div ref={formRef} className="space-y-6 pb-20">
      {/* 居中验证弹窗 */}
      {showValidationModal && validationErrors.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={20} />
                <span className="font-bold text-[15px]">发布失败</span>
              </div>
              <button
                onClick={() => setShowValidationModal(false)}
                className="p-1 hover:bg-black/5 rounded-lg transition-colors"
              >
                <X size={18} className="text-[#111111]/40" />
              </button>
            </div>
            <div className="text-[13px] text-[#111111]/70 mb-4">
              以下必填项未填写：
            </div>
            <ul className="space-y-2 mb-6">
              {validationErrors.map((msg) => (
                <li key={msg} className="flex items-center gap-2 text-[13px] text-red-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {msg}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowValidationModal(false)}
              className="w-full py-2.5 bg-[#111111] text-white text-[13px] font-semibold rounded-lg hover:bg-black/80 transition-colors"
            >
              我知道了
            </button>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2 text-sm shadow-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      <ProductEditorHeader
        isEdit={isEdit}
        lang={lang}
        onLangChange={setLang}
        savingStatus={savingStatus}
        onSaveDraft={() => handleSubmit("DRAFT")}
        onPublish={() => handleSubmit("PUBLISHED")}
      />

      <main className="flex flex-col gap-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
          <div id="field-media" className="xl:col-span-7 flex flex-col">
            <MediaGallerySection
              stockAmount={stockAmount}
              onStockAmountChange={setStockAmount}
              slots={mediaSlots}
              slotStates={slotStates}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
              onUploadSlot={handleSlotUpload}
              onRemoveSlot={handleRemoveSlot}
            />
          </div>

          <div id="field-basic" className="xl:col-span-5 flex flex-col">
            <BasicMetaSection
              lang={lang}
              content={content}
              onContentChange={setContent}
              category={category}
              categories={categories}
              onCategoryChange={setCategory}
              description={description}
              onDescriptionChange={setDescription}
            />
          </div>
        </div>

        <CoreSpecsSection
          enableTrustCards={enableTrustCards}
          onToggleTrustCards={() => setEnableTrustCards(!enableTrustCards)}
          coreMetrics={coreMetrics}
          onCoreMetricsChange={setCoreMetrics}
        />

        <TechSpecsSection
          specs={specs}
          onAddSpec={addSpecLine}
          onRemoveSpec={removeSpecLine}
          onUpdateSpec={updateSpec}
        />
      </main>
    </div>
  );
}
