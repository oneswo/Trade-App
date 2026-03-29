"use client";

import { useEffect } from "react";
import { X, Loader2, AlertTriangle } from "lucide-react";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  loading?: boolean;
  isDestructive?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  children?: React.ReactNode;
}

export default function AdminModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  loading = false,
  isDestructive = false,
  confirmLabel = "确认",
  cancelLabel = "取消",
  children,
}: AdminModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* 极简磨砂遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 opacity-100"
        onClick={onClose}
      />

      {/* 弹窗卡片：彻底去线化，依靠阴影与留白 */}
      <div className="relative w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 translate-y-0 opacity-100">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-[#111111]/40 transition-colors hover:bg-black/[0.04] hover:text-[#111111]"
        >
          <X size={16} />
        </button>

        {/* 图标与标题 */}
        <div className="mb-6 flex flex-col gap-3">
          {isDestructive && (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertTriangle size={20} strokeWidth={2.5} />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#111111]">
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-[13px] leading-relaxed text-[#111111]/50">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* 自定义注入内容（比如表单输入框） */}
        {children && <div className="mb-8">{children}</div>}

        {/* 底部操作组：强调横向对齐 */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl bg-black/[0.03] py-3 text-[13px] font-semibold text-[#111111]/70 transition-colors hover:bg-black/[0.06] disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`
              flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-semibold text-white transition-all
              ${isDestructive
                ? "bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-500/20"
                : "bg-[#111111] hover:bg-black/80 focus:ring-4 focus:ring-black/20"
              }
              disabled:cursor-not-allowed disabled:opacity-60
            `}
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : null}
            {loading ? "处理中..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
