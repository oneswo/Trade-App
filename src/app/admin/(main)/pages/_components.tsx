"use client";

import { useEffect, useState, useRef } from "react";
import { ImageIcon, Film, Loader2, Sparkles, CheckCircle, XCircle } from "lucide-react";
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
  translateFrom, // 对应的中文字段名
}: {
  name: string;
  defaultValue?: string;
  translateFrom?: string;
}) {
  const { get, has, set, isZh, allFields } = useCtx();
  const [translating, setTranslating] = useState(false);
  const [translateResult, setTranslateResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // 显示翻译按钮的条件: 英文tab + 有对应的中文字段 + 中文有值 + 当前为空
  const zhValue = translateFrom ? allFields[translateFrom] || '' : '';
  const currentValue = get(name, defaultValue);
  const showTranslateBtn = !isZh && translateFrom && zhValue && !currentValue;

  useEffect(() => {
    if (!isZh) return;
    if (defaultValue === "") return;
    if (has(name)) return;
    set(name, defaultValue);
  }, [defaultValue, has, isZh, name, set]);

  const handleTranslate = async () => {
    if (!zhValue) return;
    
    setTranslating(true);
    setTranslateResult(null);
    
    try {
      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: zhValue,
          sourceLang: 'zh',
          targetLang: 'en',
        }),
      });
      
      const data = await res.json();
      
      if (data.ok && data.translatedText) {
        set(name, data.translatedText);
        setTranslateResult({ success: true, message: '翻译成功' });
        setTimeout(() => setTranslateResult(null), 3000);
      } else {
        setTranslateResult({ success: false, message: data.error || '翻译失败' });
      }
    } catch (err) {
      setTranslateResult({ 
        success: false, 
        message: err instanceof Error ? err.message : '网络错误' 
      });
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={currentValue}
        onChange={(e) => set(name, e.target.value)}
        className={`w-full rounded-lg border border-black/[0.08] bg-white px-3 py-2.5 text-[15px] text-[#111111] transition-colors focus:border-black/30 outline-none ${
          showTranslateBtn ? 'pr-24' : ''
        }`}
      />
      {showTranslateBtn && (
        <button
          type="button"
          onClick={handleTranslate}
          disabled={translating}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[11px] font-bold hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          title="从中文翻译"
        >
          {translating ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              <span>翻译中</span>
            </>
          ) : (
            <>
              <Sparkles size={12} />
              <span>AI翻译</span>
            </>
          )}
        </button>
      )}
      {translateResult && (
        <div className={`absolute -bottom-6 right-0 flex items-center gap-1 text-[11px] font-semibold ${
          translateResult.success ? 'text-green-600' : 'text-red-500'
        }`}>
          {translateResult.success ? (
            <><CheckCircle size={11} /> {translateResult.message}</>
          ) : (
            <><XCircle size={11} /> {translateResult.message}</>
          )}
        </div>
      )}
    </div>
  );
}

// ─── TextArea ─────────────────────────────────────────────────────────────────

export function TextArea({
  name,
  defaultValue = "",
  rows = 3,
  translateFrom, // 对应的中文字段名
}: {
  name: string;
  defaultValue?: string;
  rows?: number;
  translateFrom?: string;
}) {
  const { get, has, set, isZh, allFields } = useCtx();
  const [translating, setTranslating] = useState(false);
  const [translateResult, setTranslateResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // 显示翻译按钮的条件: 英文tab + 有对应的中文字段 + 中文有值 + 当前为空
  const zhValue = translateFrom ? allFields[translateFrom] || '' : '';
  const currentValue = get(name, defaultValue);
  const showTranslateBtn = !isZh && translateFrom && zhValue && !currentValue;

  useEffect(() => {
    if (!isZh) return;
    if (defaultValue === "") return;
    if (has(name)) return;
    set(name, defaultValue);
  }, [defaultValue, has, isZh, name, set]);

  const handleTranslate = async () => {
    if (!zhValue) return;
    
    setTranslating(true);
    setTranslateResult(null);
    
    try {
      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: zhValue,
          sourceLang: 'zh',
          targetLang: 'en',
        }),
      });
      
      const data = await res.json();
      
      if (data.ok && data.translatedText) {
        set(name, data.translatedText);
        setTranslateResult({ success: true, message: '翻译成功' });
        setTimeout(() => setTranslateResult(null), 3000);
      } else {
        setTranslateResult({ success: false, message: data.error || '翻译失败' });
      }
    } catch (err) {
      setTranslateResult({ 
        success: false, 
        message: err instanceof Error ? err.message : '网络错误' 
      });
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="relative">
      <textarea
        value={currentValue}
        onChange={(e) => set(name, e.target.value)}
        rows={rows}
        className={`w-full rounded-lg border border-black/[0.08] bg-white px-3 py-2.5 text-[15px] text-[#111111] transition-colors focus:border-black/30 outline-none resize-none ${
          showTranslateBtn ? 'pr-24' : ''
        }`}
      />
      {showTranslateBtn && (
        <button
          type="button"
          onClick={handleTranslate}
          disabled={translating}
          className="absolute right-2 top-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[11px] font-bold hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          title="从中文翻译"
        >
          {translating ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              <span>翻译中</span>
            </>
          ) : (
            <>
              <Sparkles size={12} />
              <span>AI翻译</span>
            </>
          )}
        </button>
      )}
      {translateResult && (
        <div className={`absolute -bottom-6 right-0 flex items-center gap-1 text-[11px] font-semibold ${
          translateResult.success ? 'text-green-600' : 'text-red-500'
        }`}>
          {translateResult.success ? (
            <><CheckCircle size={11} /> {translateResult.message}</>
          ) : (
            <><XCircle size={11} /> {translateResult.message}</>
          )}
        </div>
      )}
    </div>
  );
}

// ─── DarkInput ────────────────────────────────────────────────────────────────
// 深色主题输入框（用于黑金卡片内部）

export function DarkInput({
  name,
  defaultValue = "",
  gold,
  translateFrom,
}: {
  name: string;
  defaultValue?: string;
  gold?: boolean;
  translateFrom?: string;
}) {
  const { get, has, set, isZh, allFields } = useCtx();
  const [translating, setTranslating] = useState(false);
  const [translateResult, setTranslateResult] = useState<{ success: boolean; message: string } | null>(null);
  const zhValue = translateFrom ? allFields[translateFrom] || '' : '';
  const currentValue = get(name, defaultValue);
  const showTranslateBtn = !isZh && translateFrom && zhValue && !currentValue;

  useEffect(() => {
    if (!isZh) return;
    if (defaultValue === "") return;
    if (has(name)) return;
    set(name, defaultValue);
  }, [defaultValue, has, isZh, name, set]);

  const handleTranslate = async () => {
    if (!zhValue) return;

    setTranslating(true);
    setTranslateResult(null);

    try {
      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: zhValue,
          sourceLang: 'zh',
          targetLang: 'en',
        }),
      });

      const data = await res.json();

      if (data.ok && data.translatedText) {
        set(name, data.translatedText);
        setTranslateResult({ success: true, message: '翻译成功' });
        setTimeout(() => setTranslateResult(null), 3000);
      } else {
        setTranslateResult({ success: false, message: data.error || '翻译失败' });
      }
    } catch (err) {
      setTranslateResult({
        success: false,
        message: err instanceof Error ? err.message : '网络错误',
      });
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={currentValue}
        onChange={(e) => set(name, e.target.value)}
        className={`w-full rounded-lg border border-white/10 bg-[#1A1A1A] px-3 py-2.5 text-[15px] outline-none focus:border-white/30 ${
          showTranslateBtn ? 'pr-24' : ''
        } ${gold ? "text-[#D4AF37]" : "text-white"}`}
      />
      {showTranslateBtn && (
        <button
          type="button"
          onClick={handleTranslate}
          disabled={translating}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[11px] font-bold hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          title="从中文翻译"
        >
          {translating ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              <span>翻译中</span>
            </>
          ) : (
            <>
              <Sparkles size={12} />
              <span>AI翻译</span>
            </>
          )}
        </button>
      )}
      {translateResult && (
        <div className={`absolute -bottom-6 right-0 flex items-center gap-1 text-[11px] font-semibold ${
          translateResult.success ? 'text-green-400' : 'text-red-400'
        }`}>
          {translateResult.success ? (
            <><CheckCircle size={11} /> {translateResult.message}</>
          ) : (
            <><XCircle size={11} /> {translateResult.message}</>
          )}
        </div>
      )}
    </div>
  );
}

// ─── DarkArea ─────────────────────────────────────────────────────────────────

export function DarkArea({
  name,
  defaultValue = "",
  rows = 2,
  translateFrom,
}: {
  name: string;
  defaultValue?: string;
  rows?: number;
  translateFrom?: string;
}) {
  const { get, has, set, isZh, allFields } = useCtx();
  const [translating, setTranslating] = useState(false);
  const [translateResult, setTranslateResult] = useState<{ success: boolean; message: string } | null>(null);
  const zhValue = translateFrom ? allFields[translateFrom] || '' : '';
  const currentValue = get(name, defaultValue);
  const showTranslateBtn = !isZh && translateFrom && zhValue && !currentValue;

  useEffect(() => {
    if (!isZh) return;
    if (defaultValue === "") return;
    if (has(name)) return;
    set(name, defaultValue);
  }, [defaultValue, has, isZh, name, set]);

  const handleTranslate = async () => {
    if (!zhValue) return;

    setTranslating(true);
    setTranslateResult(null);

    try {
      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: zhValue,
          sourceLang: 'zh',
          targetLang: 'en',
        }),
      });

      const data = await res.json();

      if (data.ok && data.translatedText) {
        set(name, data.translatedText);
        setTranslateResult({ success: true, message: '翻译成功' });
        setTimeout(() => setTranslateResult(null), 3000);
      } else {
        setTranslateResult({ success: false, message: data.error || '翻译失败' });
      }
    } catch (err) {
      setTranslateResult({
        success: false,
        message: err instanceof Error ? err.message : '网络错误',
      });
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="relative">
      <textarea
        value={currentValue}
        onChange={(e) => set(name, e.target.value)}
        rows={rows}
        className={`w-full rounded-lg border border-white/10 bg-[#1A1A1A] px-3 py-2.5 text-[15px] text-gray-300 outline-none resize-none focus:border-white/30 ${
          showTranslateBtn ? 'pr-24' : ''
        }`}
      />
      {showTranslateBtn && (
        <button
          type="button"
          onClick={handleTranslate}
          disabled={translating}
          className="absolute right-2 top-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[11px] font-bold hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          title="从中文翻译"
        >
          {translating ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              <span>翻译中</span>
            </>
          ) : (
            <>
              <Sparkles size={12} />
              <span>AI翻译</span>
            </>
          )}
        </button>
      )}
      {translateResult && (
        <div className={`absolute -bottom-6 right-0 flex items-center gap-1 text-[11px] font-semibold ${
          translateResult.success ? 'text-green-400' : 'text-red-400'
        }`}>
          {translateResult.success ? (
            <><CheckCircle size={11} /> {translateResult.message}</>
          ) : (
            <><XCircle size={11} /> {translateResult.message}</>
          )}
        </div>
      )}
    </div>
  );
}

// ─── ImageUpload ──────────────────────────────────────────────────────────────

export function ImageUpload({
  name,
  label,
  hint,
  aspectHint,
  defaultValue = "",
  previewAspect = "h-32",
  previewFit = "cover",
}: {
  name: string;
  label: string;
  hint?: string;
  aspectHint?: string;
  defaultValue?: string;
  previewAspect?: string;
  previewFit?: "cover" | "contain";
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
        <div className={`relative group overflow-hidden rounded-xl border border-black/[0.08] bg-[#F6F6F6] ${previewAspect}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentUrl}
            alt="已上传图片"
            className={`h-full w-full ${previewFit === "contain" ? "object-contain" : "object-cover"}`}
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
      const { directUpload } = await import("@/lib/upload");
      const result = await directUpload(file, "video");
      set(name, result.url);
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
        <div className="relative group w-full max-w-[480px] aspect-[4/3] overflow-hidden rounded-xl border border-black/[0.08] bg-black">
          <video
            src={currentUrl}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            preload="metadata"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-10">
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
          className={`flex w-full max-w-[480px] aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors ${
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
