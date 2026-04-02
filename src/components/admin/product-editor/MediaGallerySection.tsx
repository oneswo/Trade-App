"use client";

import { useRef } from "react";
import {
  Check,
  Image as ImageIcon,
  Plus,
  Trash2,
  X,
} from "lucide-react";

// ─── 类型 ────────────────────────────────────────────────────────────────────

export interface MediaSlot {
  url: string;        // 上传后的公开 URL，空串表示未上传
  type: "image" | "video" | "";  // 文件类型
}

export interface SlotUploadState {
  uploading: boolean;
  progress: number;   // 0-100
  error: string;
  showSuccess: boolean;
}

// ─── 判断 URL 是否为视频 ─────────────────────────────────────────────────────

function isVideoUrl(url: string) {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.includes("/video/") ||
    lower.endsWith(".mp4") ||
    lower.endsWith(".webm") ||
    lower.endsWith(".mov")
  );
}

// ─── 组件 ────────────────────────────────────────────────────────────────────

export function MediaGallerySection({
  stockAmount,
  onStockAmountChange,
  slots,
  slotStates,
  selectedSlot,
  onSelectSlot,
  onUploadSlot,
  onRemoveSlot,
}: {
  stockAmount: number;
  onStockAmountChange: (value: number) => void;
  slots: MediaSlot[];
  slotStates: SlotUploadState[];
  selectedSlot: number;
  onSelectSlot: (index: number) => void;
  onUploadSlot: (index: number, file: File) => void;
  onRemoveSlot: (index: number) => void;
}) {
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const activeSlot = slots[selectedSlot];
  const activeState = slotStates[selectedSlot];

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUploadSlot(index, file);
    e.target.value = "";
  };

  // ─── 预览区 ─────────────────────────────────────────────────────────────────

  const renderPreview = () => {
    // 上传中 — 进度条
    if (activeState?.uploading) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 w-full px-12">
          <div className="w-10 h-10 rounded-full border-2 border-blue-200 border-t-blue-500 animate-spin" />
          <div className="w-full max-w-xs">
            <div className="h-2 bg-black/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${activeState.progress}%` }}
              />
            </div>
            <p className="text-center text-[13px] font-bold text-blue-500 mt-2">
              {activeState.progress}%
            </p>
          </div>
        </div>
      );
    }

    // 已上传 — 显示图片或视频
    if (activeSlot?.url) {
      if (activeSlot.type === "video" || isVideoUrl(activeSlot.url)) {
        return (
          <video
            key={activeSlot.url}
            src={activeSlot.url}
            controls
            className="w-full h-full object-contain rounded-xl"
          />
        );
      }
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={activeSlot.url}
          alt="预览"
          className="w-full h-full object-contain rounded-xl"
        />
      );
    }

    // 空态
    return (
      <div className="flex flex-col items-center gap-3 text-[#111111]/25">
        <ImageIcon size={40} strokeWidth={1.2} />
        <span className="text-[13px] font-medium">点击下方格子上传媒体</span>
        <span className="text-[11px]">支持图片和视频</span>
      </div>
    );
  };

  // ─── 单个格子 ───────────────────────────────────────────────────────────────

  const renderSlot = (index: number) => {
    const slot = slots[index];
    const state = slotStates[index];
    const isSelected = selectedSlot === index;
    const hasContent = !!slot.url;
    const isUploading = state.uploading;

    return (
      <div key={index} className="relative">
        {/* 隐藏的 file input */}
        <input
          ref={inputRefs[index]}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
          className="hidden"
          onChange={(e) => handleFileChange(index, e)}
        />

        <div
          onClick={() => {
            onSelectSlot(index);
            if (!hasContent && !isUploading) {
              inputRefs[index].current?.click();
            }
          }}
          className={`
            aspect-[16/10] rounded-lg border-2 flex items-center justify-center
            cursor-pointer relative overflow-hidden group transition-all shadow-sm
            ${isSelected
              ? "border-blue-500 ring-2 ring-blue-500/20"
              : hasContent
                ? "border-black/[0.08] hover:border-black/[0.2]"
                : "border-dashed border-black/[0.1] hover:border-black/[0.2] bg-[#FAFAFA] hover:bg-white"
            }
          `}
        >
          {/* ── 上传中进度 ── */}
          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10">
              <div className="w-3/4 h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${state.progress}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-blue-500 mt-1.5">{state.progress}%</span>
            </div>
          )}

          {/* ── 上传成功勾 ── */}
          {state.showSuccess && !isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-green-500/10 z-10 animate-in fade-in duration-300">
              <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                <Check size={14} className="text-white" strokeWidth={3} />
              </div>
            </div>
          )}

          {/* ── 错误 ── */}
          {state.error && !isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10 px-2">
              <span className="text-[9px] font-bold text-red-500 text-center leading-tight">{state.error}</span>
            </div>
          )}

          {/* ── 已上传缩略图 ── */}
          {hasContent && !isUploading && !state.error && !state.showSuccess && (
            <>
              {slot.type === "video" || isVideoUrl(slot.url) ? (
                <video
                  src={slot.url}
                  className="w-full h-full object-cover"
                  muted
                  preload="metadata"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slot.url}
                  alt={`媒体 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}

              {/* 悬停：更换 + 删除 */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRefs[index].current?.click();
                  }}
                  className="px-2 py-1 bg-white text-[10px] font-bold rounded-md hover:bg-gray-100"
                >
                  更换
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSlot(index);
                  }}
                  className="p-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </>
          )}

          {/* ── 空态 + 图标 ── */}
          {!hasContent && !isUploading && !state.error && (
            <Plus size={20} className="text-[#111111]/30 group-hover:scale-110 transition-transform" />
          )}

          {/* ── 主图标签 ── */}
          {index === 0 && (
            <div className="absolute top-0 right-0 bg-[#111111] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-bl-[4px] z-20">
              主图
            </div>
          )}

          {/* ── 非主图序号 ── */}
          {index > 0 && (
            <div className="absolute top-0 right-0 bg-black/[0.1] text-black/[0.4] text-[9px] font-bold px-1.5 py-0.5 rounded-bl-[4px] z-20">
              {index + 1}
            </div>
          )}
        </div>

        {/* 选中指示点 */}
        {isSelected && (
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500" />
        )}
      </div>
    );
  };

  // ─── 主渲染 ─────────────────────────────────────────────────────────────────

  return (
    <section className="bg-white rounded-xl p-8 border border-black/[0.06] shadow-sm flex flex-col h-full">
      {/* 头部 */}
      <div className="mb-6 pb-4 border-b border-black/[0.05] flex items-center justify-between">
        <h2 className="text-[13px] font-bold text-[#111111] flex items-center gap-2">
          <ImageIcon size={16} className="text-[#111111]/40" />
          数字视觉馆 (Media Gallery)
        </h2>
        <div className="flex items-center gap-3 bg-[#FAFAFA] border border-black/[0.06] rounded-lg p-1.5 pr-4 shadow-sm">
          <div className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm border border-black/[0.04] text-[#25D366]">
            <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse shadow-lg" />
          </div>
          <label className="text-[11px] font-semibold tracking-widest text-[#111111]/50 uppercase">
            现车库存
          </label>
          <input
            type="number"
            value={stockAmount}
            onChange={(e) => onStockAmountChange(Number(e.target.value) || 0)}
            min="0"
            className="w-12 bg-transparent text-[14px] font-bold text-[#111111] focus:outline-none text-right placeholder:text-[#111111]/20"
          />
          <span className="text-[11px] font-bold text-[#111111]/40">台</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {/* ── 预览区（固定 16:10 宽高比，避免跳动） ── */}
        <div className="w-full aspect-[16/10] rounded-xl bg-[#FAFAFA] border border-black/[0.06] flex items-center justify-center overflow-hidden">
          {renderPreview()}
        </div>

        {/* ── 5 格子 ── */}
        <div className="grid grid-cols-5 gap-3 shrink-0 pb-1">
          {[0, 1, 2, 3, 4].map(renderSlot)}
        </div>
      </div>
    </section>
  );
}
