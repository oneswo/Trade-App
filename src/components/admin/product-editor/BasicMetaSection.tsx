"use client";

import { useState } from "react";
import { Globe2, Loader2, Sparkles } from "lucide-react";
import type {
  CategoryOption,
  ProductEditorContent,
} from "./types";
import { translateWithAdminApi } from "./translate";

export function BasicMetaSection({
  lang,
  content,
  onContentChange,
  category,
  categories,
  onCategoryChange,
}: {
  lang: "zh" | "en";
  content: ProductEditorContent;
  onContentChange: (content: ProductEditorContent) => void;
  category: string;
  categories: CategoryOption[];
  onCategoryChange: (category: string) => void;
}) {
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState("");

  const handleTranslateAll = async () => {
    if (lang !== "en") return;

    setTranslateError("");
    setTranslating(true);
    try {
      const [nameEn, summaryEn, descriptionEn] = await Promise.all([
        content.nameZh.trim()
          ? translateWithAdminApi(content.nameZh)
          : Promise.resolve(content.nameEn),
        content.summaryZh.trim()
          ? translateWithAdminApi(content.summaryZh)
          : Promise.resolve(content.summaryEn),
        content.descriptionZh.trim()
          ? translateWithAdminApi(content.descriptionZh)
          : Promise.resolve(content.descriptionEn),
      ]);

      onContentChange({
        ...content,
        nameEn,
        summaryEn,
        descriptionEn,
      });
    } catch (error) {
      setTranslateError(error instanceof Error ? error.message : "翻译失败，请稍后重试");
    } finally {
      setTranslating(false);
    }
  };

  return (
    <section className="bg-white rounded-xl p-8 border border-black/[0.06] shadow-sm flex flex-col h-full">
      <div className="mb-6 pb-4 border-b border-black/[0.05] flex items-center justify-between gap-4">
        <h2 className="text-[13px] font-bold text-[#111111] flex items-center gap-2">
          <Globe2 size={16} className="text-[#111111]/40" />
          基础信息 (Basic Meta) - {lang === "zh" ? "中文编辑" : "English Edit"}
        </h2>
        {lang === "en" && (
          <button
            type="button"
            onClick={handleTranslateAll}
            disabled={translating}
            className="shrink-0 rounded-lg border border-black/[0.08] bg-[#FAFAFA] px-3 py-2 text-[11px] font-semibold text-[#111111] transition-colors hover:bg-black/[0.03] disabled:opacity-50"
          >
            {translating ? (
              <span className="flex items-center gap-1.5">
                <Loader2 size={12} className="animate-spin" />
                翻译中
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} />
                一键翻译标题/卖点/详情
              </span>
            )}
          </button>
        )}
      </div>
      {translateError && (
        <p className="mb-4 text-[12px] font-medium text-red-600">{translateError}</p>
      )}

      <div className="flex flex-col gap-6 flex-1">
        <div className="space-y-2">
          <label className="text-[11px] font-semibold tracking-widest text-[#111111]/40 uppercase">
            主标题 ({lang.toUpperCase()}) <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            value={lang === "zh" ? content.nameZh : content.nameEn}
            onChange={(e) =>
              onContentChange({
                ...content,
                [lang === "zh" ? "nameZh" : "nameEn"]: e.target.value,
              })
            }
            placeholder={
              lang === "zh"
                ? "范例: 卡特彼勒 320D L 液压挖掘机"
                : "Example: Caterpillar 320D L Hydraulic Excavator"
            }
            className="w-full bg-[#FAFAFA] rounded-lg border border-black/[0.06] px-4 py-3 text-[14px] font-bold text-[#111111] focus:outline-none focus:border-black/30 focus:bg-white transition-all placeholder:text-[#111111]/20 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-widest text-[#111111]/40 uppercase">
              品牌分类级 (Brand Category) <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full bg-[#FAFAFA] rounded-lg border border-black/[0.06] px-4 py-2.5 text-[13px] font-bold text-[#111111] focus:outline-none focus:border-black/30 focus:bg-white transition-all appearance-none cursor-pointer"
            >
              {categories.length === 0 && <option value="">加载中...</option>}
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.nameEn} ({item.nameZh})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold tracking-widest text-[#111111]/40 uppercase">
            摘要卖点 ({lang.toUpperCase()})
          </label>
          <textarea
            rows={2}
            value={lang === "zh" ? content.summaryZh : content.summaryEn}
            onChange={(e) =>
              onContentChange({
                ...content,
                [lang === "zh" ? "summaryZh" : "summaryEn"]: e.target.value,
              })
            }
            placeholder={
              lang === "zh"
                ? "精炼一句，将在列表卡片中展示..."
                : "A concise one-liner for card display..."
            }
            className="w-full bg-[#FAFAFA] rounded-lg border border-black/[0.06] px-4 py-3 text-[13px] font-medium text-[#111111] focus:outline-none focus:border-black/30 focus:bg-white transition-all placeholder:text-[#111111]/20 resize-none"
          />
        </div>

        <div className="space-y-2 flex-1 flex flex-col">
          <label className="text-[11px] font-semibold tracking-widest text-[#111111]/40 uppercase">
            详情描述 ({lang.toUpperCase()})
          </label>
          <textarea
            value={lang === "zh" ? content.descriptionZh : content.descriptionEn}
            onChange={(e) =>
              onContentChange({
                ...content,
                [lang === "zh" ? "descriptionZh" : "descriptionEn"]: e.target.value,
              })
            }
            placeholder={
              lang === "zh"
                ? "产品详细介绍，将在前台详情页底部展示（支持换行）..."
                : "Detailed product description shown on the product detail page..."
            }
            className="w-full flex-1 min-h-[100px] bg-[#FAFAFA] rounded-lg border border-black/[0.06] px-4 py-3 text-[13px] font-medium text-[#111111] focus:outline-none focus:border-black/30 focus:bg-white transition-all placeholder:text-[#111111]/20 resize-none"
          />
        </div>
      </div>
    </section>
  );
}
