"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function AdminError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[Admin Error Boundary]", error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-black/[0.06] bg-white p-8 shadow-sm text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <AlertCircle size={24} className="text-red-500" />
        </div>
        <h2 className="text-[16px] font-bold text-[#111111] mb-2">
          页面出现异常
        </h2>
        <p className="text-[13px] text-[#111111]/50 mb-6 leading-relaxed">
          当前操作遇到了问题，您可以尝试重试。
          {error.message && (
            <span className="block mt-2 text-[12px] text-red-500/70 font-mono break-all">
              {error.message}
            </span>
          )}
        </p>
        <button
          onClick={() => unstable_retry()}
          className="inline-flex items-center gap-2 rounded-lg bg-[#111111] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-black/80"
        >
          <RotateCcw size={14} />
          重试
        </button>
      </div>
    </div>
  );
}
