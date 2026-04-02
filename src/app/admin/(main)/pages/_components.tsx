"use client";

import { useState, useRef } from "react";
import { ImageIcon, Film, Loader2 } from "lucide-react";
import { useCtx } from "./_context";

// ─── SectionHeader ────────────────────────────────────────────────────────────

export function SectionHeader({ title, note }: { title: string; note?: string }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-black/[0.06] pb-3">
      <h3 className="text-base font-bold text-[#111111]">{title}</h3>
      {note && <span className="text-[12px] text-[#111111]/30">{note}</span>}
    </div>
  );
}

// ─── FieldRow ─────────────────────────────────────────────────────────────────

export function FieldRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-[13px] font-semibold tracking-[0.08em] text-[#111111]/40 uppercase">
          {label}
        </label>
        {hint && <span className="text-[12px] text-[#111111]/25">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

// ─── TextInput ────────────────────────────────────────────────────────────────

export function TextInput({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const { get, set } = useCtx();
  return (
    <input
      type="text"
      value={get(name, defaultValue)}
      onChange={(e) => set(name, e.target.value)}
      className="w-full rounded-lg border border-black/[0.08] bg-white px-3 py-2.5 text-[15px] text-[#111111] transition-colors focus:border-black/30 outline-none"
    />
  );
}

// ─── TextArea ─────────────────────────────────────────────────────────────────

export function TextArea({
  name,
  defaultValue = "",
  rows = 3,
}: {
  name: string;
  defaultValue?: string;
  rows?: number;
}) {
  const { get, set } = useCtx();
  return (
    <textarea
      value={get(name, defaultValue)}
      onChange={(e) => set(name, e.target.value)}
      rows={rows}
      className="w-full rounded-lg border border-black/[0.08] bg-white px-3 py-2.5 text-[15px] text-[#111111] transition-colors focus:border-black/30 outline-none resize-none"
    />
  );
}

// ─── DarkInput ────────────────────────────────────────────────────────────────
// 深色主题输入框（用于黑金卡片内部）

export function DarkInput({
  name,
  defaultValue = "",
  gold,
}: {
  name: string;
  defaultValue?: string;
  gold?: boolean;
}) {
  const { get, set } = useCtx();
  return (
    <input
      type="text"
      value={get(name, defaultValue)}
      onChange={(e) => set(name, e.target.value)}
      className={`w-full rounded-lg border border-white/10 bg-[#1A1A1A] px-3 py-2.5 text-[15px] outline-none focus:border-white/30 ${
        gold ? "text-[#D4AF37]" : "text-white"
      }`}
    />
  );
}

// ─── DarkArea ─────────────────────────────────────────────────────────────────

export function DarkArea({
  name,
  defaultValue = "",
  rows = 2,
}: {
  name: string;
  defaultValue?: string;
  rows?: number;
}) {
  const { get, set } = useCtx();
  return (
    <textarea
      value={get(name, defaultValue)}
      onChange={(e) => set(name, e.target.value)}
      rows={rows}
      className="w-full rounded-lg border border-white/10 bg-[#1A1A1A] px-3 py-2.5 text-[15px] text-gray-300 outline-none resize-none focus:border-white/30"
    />
  );
}

// ─── ImageUpload ──────────────────────────────────────────────────────────────

export function ImageUpload({
  name,
  label,
  hint,
  aspectHint,
  defaultValue = "",
}: {
  name: string;
  label: string;
  hint?: string;
  aspectHint?: string;
  defaultValue?: string;
}) {
  const { get, set } = useCtx();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentUrl = get(name, defaultValue);
  const isAutoExtracted = get(`${name}_auto`, '') === 'true';

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const { directUpload } = await import("@/lib/upload");
      const result = await directUpload(file, "image");
      set(name, result.url);
      set(`${name}_auto`, ''); // 手动上传时清除自动标记
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleUpload(file);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-[13px] font-semibold tracking-[0.08em] text-[#111111]/40 uppercase">
          {label}
        </label>
        {hint && <span className="text-[12px] text-[#111111]/25">{hint}</span>}
        {isAutoExtracted && (
          <span className="text-[11px] text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">
            ✓ 自动提取
          </span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
      {currentUrl ? (
        <div className="relative group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentUrl}
            alt="已上传图片"
            className="w-full h-32 object-cover rounded-xl border border-black/[0.08]"
          />
          {isAutoExtracted && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">
              自动提取
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-[11px] font-medium rounded-lg hover:bg-gray-100"
            >
              更换
            </button>
            <button
              type="button"
              onClick={() => {
                set(name, "");
                set(`${name}_auto`, '');
              }}
              className="px-3 py-1.5 bg-red-500 text-white text-[11px] font-medium rounded-lg hover:bg-red-600"
            >
              删除
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`flex h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors ${
            uploading
              ? "border-blue-300 bg-blue-50"
              : "border-black/[0.1] bg-[#FAFAFA] hover:border-black/20 hover:bg-black/[0.02]"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="text-blue-500 animate-spin" />
              <span className="text-[11px] text-blue-500 font-medium">上传中...</span>
            </>
          ) : (
            <>
              <ImageIcon size={20} className="text-[#111111]/25" />
              <span className="text-[11px] text-[#111111]/40 font-medium">点击上传</span>
              {aspectHint && (
                <span className="text-[10px] text-[#111111]/25">{aspectHint}</span>
              )}
            </>
          )}
        </div>
      )}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

// ─── VideoUpload ──────────────────────────────────────────────────────────────

export function VideoUpload({
  name,
  label,
  hint,
  posterFieldName,
}: {
  name: string;
  label: string;
  hint?: string;
  posterFieldName?: string; // 关联的封面字段名
}) {
  const { get, set } = useCtx();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractingFrame, setExtractingFrame] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentUrl = get(name, "");

  // 提取视频第一帧
  const extractFirstFrame = async (videoUrl: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';

      video.onloadeddata = () => {
        video.currentTime = 0.1; // 跳到 0.1 秒，避免黑帧
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
              if (blob) {
                const file = new File([blob], 'video-frame.jpg', { type: 'image/jpeg' });
                import("@/lib/upload").then(({ directUpload }) =>
                  directUpload(file, "image")
                ).then((result) => {
                  resolve(result.url);
                }).catch(() => resolve(null));
              } else {
                resolve(null);
              }
            }, 'image/jpeg', 0.9);
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      };

      video.onerror = () => resolve(null);
      video.src = videoUrl;
    });
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const { directUpload } = await import("@/lib/upload");
      const result = await directUpload(file, "video");
      set(name, result.url);

      // 如果指定了封面字段，且封面字段为空，自动提取第一帧
      if (posterFieldName) {
        const currentPoster = get(posterFieldName, "");
        if (!currentPoster) {
          setExtractingFrame(true);
          const frameUrl = await extractFirstFrame(result.url);
          setExtractingFrame(false);
          if (frameUrl) {
            set(posterFieldName, frameUrl);
            set(`${posterFieldName}_auto`, 'true'); // 标记为自动提取
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("video/")) handleUpload(file);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-[13px] font-semibold tracking-[0.08em] text-[#111111]/40 uppercase">
          {label}
        </label>
        {hint && <span className="text-[12px] text-[#111111]/25">{hint}</span>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={handleFileChange}
      />
      {currentUrl ? (
        <div className="relative group">
          <video
            src={currentUrl}
            className="w-full h-32 rounded-xl border border-black/[0.08] bg-black object-cover"
            muted
            preload="metadata"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-[11px] font-medium rounded-lg hover:bg-gray-100"
            >
              更换
            </button>
            <button
              type="button"
              onClick={() => set(name, "")}
              className="px-3 py-1.5 bg-red-500 text-white text-[11px] font-medium rounded-lg hover:bg-red-600"
            >
              删除
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && !extractingFrame && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`flex h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors ${
            uploading || extractingFrame
              ? "border-blue-300 bg-blue-50"
              : "border-black/[0.1] bg-[#FAFAFA] hover:border-black/20 hover:bg-black/[0.02]"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="text-blue-500 animate-spin" />
              <span className="text-[11px] text-blue-500 font-medium">上传中...</span>
            </>
          ) : extractingFrame ? (
            <>
              <Loader2 size={20} className="text-green-500 animate-spin" />
              <span className="text-[11px] text-green-500 font-medium">正在提取封面...</span>
            </>
          ) : (
            <>
              <Film size={20} className="text-[#111111]/25" />
              <span className="text-[11px] text-[#111111]/40 font-medium">
                点击上传 / 拖拽视频到此处
              </span>
              <span className="text-[10px] text-[#111111]/25">MP4 / WebM，最大 80MB</span>
            </>
          )}
        </div>
      )}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

// ─── CardBlock ────────────────────────────────────────────────────────────────

export function CardBlock({
  index,
  label,
  children,
}: {
  index: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-black/[0.06] p-4 space-y-3 bg-[#FAFAFA]">
      <span className="text-[12px] font-bold tracking-widest text-[#111111]/30 uppercase">
        {label} {index}
      </span>
      {children}
    </div>
  );
}
