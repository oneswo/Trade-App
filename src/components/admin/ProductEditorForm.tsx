"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createEmptyProductMediaSlot,
  buildLegacyProductMediaSlots,
  decomposeProductMediaSlots,
  normalizeProductMediaSlots,
} from "@/lib/products/media";
import { cleanupTrackedMediaUrls } from "@/lib/admin/media-cleanup";
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
    () => Array.from({ length: SLOT_COUNT }, createEmptyProductMediaSlot),
  );
  const [slotStates, setSlotStates] = useState<SlotUploadState[]>(
    () => Array.from({ length: SLOT_COUNT }, emptyState),
  );
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const sessionUploadedUrlsRef = useRef<Set<string>>(new Set());
  const cleanupPendingSessionUploads = useCallback((keepalive?: boolean) => {
    if (sessionUploadedUrlsRef.current.size === 0) return;
    const trackedUrls = [...sessionUploadedUrlsRef.current];
    sessionUploadedUrlsRef.current.clear();
    void cleanupTrackedMediaUrls(trackedUrls, [], keepalive ? { keepalive: true } : undefined);
  }, []);

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
      sessionUploadedUrlsRef.current.add(result.url);
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
  }, []);

  const handleRemoveSlot = useCallback(async (index: number) => {
    // 先清除前端状态
    setMediaSlots((prev) => {
      const next = [...prev];
      next[index] = createEmptyProductMediaSlot();
      return next;
    });
    setSlotStates((prev) => {
      const next = [...prev];
      next[index] = emptyState();
      return next;
    });
  }, []);

  // ── 从 slots 派生出提交用的字段 ──────────────────────────────
  const normalizedMediaSlots = normalizeProductMediaSlots(mediaSlots, SLOT_COUNT);
  const { coverImageUrl, galleryImageUrls, videoUrl } =
    decomposeProductMediaSlots(normalizedMediaSlots);

  useEffect(() => {
    if (!isEdit || !productId) return;

    fetch(`/api/admin/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.data) {
          const product = data.data;
          setCategory(product.category);
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
              mediaSlots: product.coreMetrics.mediaSlots || [],
            });
          }
          if (product.specs && product.specs.length > 0) {
            setSpecs(product.specs);
          }
          setDescription(product.description || "");

          // 从旧字段还原到 slots
          const loaded = product.coreMetrics?.mediaSlots
            ? normalizeProductMediaSlots(product.coreMetrics.mediaSlots, SLOT_COUNT)
            : buildLegacyProductMediaSlots({
                coverImageUrl: product.coverImageUrl,
                galleryImageUrls: product.galleryImageUrls,
                videoUrl: product.videoUrl,
              });
          setMediaSlots(loaded);
        } else {
          setErrorMsg("加载产品数据失败");
        }
      })
      .catch(() => setErrorMsg("网络异常，加载失败"))
      .finally(() => setInitialLoading(false));
  }, [isEdit, productId]);

  useEffect(() => {
    return () => {
      cleanupPendingSessionUploads(true);
    };
  }, [cleanupPendingSessionUploads]);

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
        coreMetrics: {
          ...coreMetrics,
          mediaSlots: normalizedMediaSlots,
        },
        specs: specs.filter((spec) => spec.key.trim() && spec.value.trim()),
        coverImageUrl,
        galleryImageUrls,
        videoUrl,
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

      const trackedUrls = [...sessionUploadedUrlsRef.current];
      sessionUploadedUrlsRef.current.clear();
      await cleanupTrackedMediaUrls(
        trackedUrls,
        normalizedMediaSlots
          .map((slot) => slot.url)
          .filter((url): url is string => Boolean(url))
      );
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
    setSpecs(specs.map((spec, i) =>
      i === index ? { ...spec, [field]: value } : spec
    ));
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
