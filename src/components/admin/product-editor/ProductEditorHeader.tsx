"use client";

import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";

export function ProductEditorHeader({
  isEdit,
  lang,
  onLangChange,
  savingStatus,
  onSaveDraft,
  onPublish,
}: {
  isEdit: boolean;
  lang: "zh" | "en";
  onLangChange: (lang: "zh" | "en") => void;
  savingStatus: "IDLE" | "DRAFT" | "PUBLISHED";
  onSaveDraft: () => void;
  onPublish: () => void;
}) {
  return (
    <header className="sticky top-0 flex items-center justify-between rounded-xl border border-black/[0.06] bg-white px-6 py-4 shadow-sm z-50">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.06] bg-[#FAFAFA] text-[#111111]/40 hover:bg-black/[0.04] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-[15px] font-bold text-[#111111] leading-tight">
            {isEdit ? "编辑机械库档案" : "新增机械库档案"}
          </h1>
          <p className="text-[11px] font-semibold tracking-wider text-[#111111]/40 uppercase mt-0.5">
            {isEdit ? "Edit Asset Document" : "Create New Asset Document"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex bg-black/[0.04] p-1 rounded-lg border border-black/[0.04]">
          <button
            onClick={() => onLangChange("zh")}
            className={`px-4 py-1.5 text-[12px] font-bold rounded-md transition-all ${
              lang === "zh"
                ? "bg-white text-[#111111] shadow-sm"
                : "text-[#111111]/50 hover:text-[#111111]"
            }`}
          >
            中文
          </button>
          <button
            onClick={() => onLangChange("en")}
            className={`px-4 py-1.5 text-[12px] font-bold rounded-md transition-all ${
              lang === "en"
                ? "bg-white text-[#111111] shadow-sm"
                : "text-[#111111]/50 hover:text-[#111111]"
            }`}
          >
            English
          </button>
        </div>

        <div className="h-5 w-px bg-black/[0.1]" />

        <div className="flex items-center gap-3">
          <button
            onClick={onSaveDraft}
            disabled={savingStatus !== "IDLE"}
            className="hidden md:flex items-center justify-center gap-1.5 rounded-lg border border-black/[0.06] bg-white px-4 py-2 text-[12px] font-semibold text-[#111111]/60 hover:bg-black/[0.02] hover:text-[#111111] shadow-sm transition-colors disabled:opacity-50"
          >
            {savingStatus === "DRAFT" ? (
              <Loader2 size={14} className="animate-spin" />
            ) : null}
            存为草稿
          </button>
          <button
            onClick={onPublish}
            disabled={savingStatus !== "IDLE"}
            className="flex items-center gap-1.5 rounded-lg bg-[#111111] px-5 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-black/80 transition-all disabled:opacity-50"
          >
            {savingStatus === "PUBLISHED" ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            立即发布
          </button>
        </div>
      </div>
    </header>
  );
}
