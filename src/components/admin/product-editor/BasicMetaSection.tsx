"use client";

import { Globe2 } from "lucide-react";
import type {
  CategoryOption,
  ProductEditorContent,
} from "./types";

export function BasicMetaSection({
  lang,
  content,
  onContentChange,
  category,
  categories,
  onCategoryChange,
  description,
  onDescriptionChange,
}: {
  lang: "zh" | "en";
  content: ProductEditorContent;
  onContentChange: (content: ProductEditorContent) => void;
  category: string;
  categories: CategoryOption[];
  onCategoryChange: (category: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
}) {
  return (
    <section className="bg-white rounded-xl p-8 border border-black/[0.06] shadow-sm flex flex-col h-full">
      <h2 className="text-[13px] font-bold text-[#111111] mb-6 pb-4 border-b border-black/[0.05] flex items-center gap-2">
        <Globe2 size={16} className="text-[#111111]/40" />
        基础信息 (Basic Meta) - {lang === "zh" ? "中文编辑" : "English Edit"}
      </h2>

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
            详情描述 (Description)
          </label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="产品详细介绍，将在前台详情页底部展示（支持换行）..."
            className="w-full flex-1 min-h-[100px] bg-[#FAFAFA] rounded-lg border border-black/[0.06] px-4 py-3 text-[13px] font-medium text-[#111111] focus:outline-none focus:border-black/30 focus:bg-white transition-all placeholder:text-[#111111]/20 resize-none"
          />
        </div>
      </div>
    </section>
  );
}
