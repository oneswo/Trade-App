"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { BasicMetaSection } from "./product-editor/BasicMetaSection";
import { CoreSpecsSection } from "./product-editor/CoreSpecsSection";
import { MediaGallerySection } from "./product-editor/MediaGallerySection";
import { ProductEditorHeader } from "./product-editor/ProductEditorHeader";
import { TechSpecsSection } from "./product-editor/TechSpecsSection";
import type {
  CategoryOption,
  ProductEditorContent,
  ProductEditorCoreMetrics,
  ProductEditorSpec,
} from "./product-editor/types";

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
  const [videoUrl, setVideoUrl] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [galleryImageUrls, setGalleryImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

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

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "cover" | "gallery" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg("");

    try {
      const { directUpload } = await import("@/lib/upload");
      const kind = type === "video" ? "video" as const : "image" as const;
      const result = await directUpload(file, kind);
      const url = result.url;

      if (type === "cover") {
        setCoverImageUrl(url);
      } else if (type === "gallery") {
        setGalleryImageUrls([...galleryImageUrls, url]);
      } else if (type === "video") {
        setVideoUrl(url);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "网络异常，上传失败");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImageUrls(galleryImageUrls.filter((_, i) => i !== index));
  };

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
          setCoverImageUrl(product.coverImageUrl || "");
          setGalleryImageUrls(product.galleryImageUrls || []);
          setVideoUrl(product.videoUrl || "");
        } else {
          setErrorMsg("加载产品数据失败");
        }
      })
      .catch(() => setErrorMsg("网络异常，加载失败"))
      .finally(() => setInitialLoading(false));
  }, [isEdit, productId]);

  const handleSubmit = async (statusToSave: "DRAFT" | "PUBLISHED") => {
    if (!content.nameZh && !content.nameEn) {
      setErrorMsg("请至少填写一个语言的主标题。");
      return;
    }

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
    <div className="space-y-6 pb-20">
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
          <div className="xl:col-span-7 flex flex-col">
            <MediaGallerySection
              stockAmount={stockAmount}
              onStockAmountChange={setStockAmount}
              videoUrl={videoUrl}
              coverImageUrl={coverImageUrl}
              galleryImageUrls={galleryImageUrls}
              uploading={uploading}
              onUpload={handleUpload}
              onRemoveGalleryImage={removeGalleryImage}
            />
          </div>

          <div className="xl:col-span-5 flex flex-col">
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
