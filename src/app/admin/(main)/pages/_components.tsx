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

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", "image");
      if (currentUrl) formData.append("oldUrl", currentUrl);
      const res = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.ok && json.data?.url) {
        set(name, json.data.url);
      } else {
        setError(json.error || "上传失败");
      }
    } catch {
      setError("网络错误");
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
}: {
  name: string;
  label: string;
  hint?: string;
}) {
  const { get, set } = useCtx();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentUrl = get(name, "");

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", "video");
      if (currentUrl) formData.append("oldUrl", currentUrl);
      const res = await fetch("/api/admin/uploads", { method: "POST", body: formData });
      const json = await res.json();
      if (json.ok && json.data?.url) {
        set(name, json.data.url);
      } else {
        setError(json.error || "上传失败");
      }
    } catch {
      setError("网络错误");
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
