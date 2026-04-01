"use client";

import { Plus, Settings2, Trash2 } from "lucide-react";
import type { ProductEditorSpec } from "./types";

export function TechSpecsSection({
  specs,
  onAddSpec,
  onRemoveSpec,
  onUpdateSpec,
}: {
  specs: ProductEditorSpec[];
  onAddSpec: () => void;
  onRemoveSpec: (index: number) => void;
  onUpdateSpec: (index: number, field: "key" | "value", value: string) => void;
}) {
  return (
    <section className="bg-white rounded-xl p-8 border border-black/[0.06] shadow-sm">
      <div className="mb-8 pb-5 border-b border-black/[0.05] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[13px] font-bold text-[#111111] flex items-center gap-2 mb-1">
            <Settings2 size={16} className="text-[#111111]/40" />
            全规格参数阵列档案 (Full Tech Specs)
          </h2>
          <p className="text-[11px] text-[#111111]/40 pl-6 transform">
            此表格所有新增与修改，会在前端底部的瀑布流技术表中同步体现。
          </p>
        </div>
        <button
          onClick={onAddSpec}
          type="button"
          className="text-[12px] font-semibold tracking-wider uppercase bg-[#FAFAFA] border border-black/[0.08] hover:bg-black/[0.02] text-[#111111] px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <Plus size={14} />
          新增规范参数行
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
        {specs.map((spec, i) => (
          <div
            key={i}
            className="flex items-center gap-0 bg-[#FAFAFA] border border-black/[0.04] p-2 pr-4 rounded-xl group hover:bg-white hover:border-black/[0.08] transition-colors shadow-sm"
          >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#111111]/20 font-bold text-[10px] shadow-sm shrink-0 border border-black/[0.04] ml-1">
              {(i + 1).toString().padStart(2, "0")}
            </div>
            <input
              type="text"
              value={spec.key}
              onChange={(e) => onUpdateSpec(i, "key", e.target.value)}
              placeholder="标签，如：Engine"
              className="w-[45%] bg-transparent px-4 py-2 text-[12px] font-semibold text-[#111111]/50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-black/10 rounded-md transition-all ml-1"
            />

            <div className="w-px h-5 bg-black/[0.05] mx-3" />

            <input
              type="text"
              value={spec.value}
              onChange={(e) => onUpdateSpec(i, "value", e.target.value)}
              placeholder="参数值，如：V6 3.0L"
              className="flex-1 bg-transparent px-4 py-2 text-[13px] font-bold text-[#111111] focus:outline-none focus:bg-white focus:ring-1 focus:ring-black/10 rounded-md transition-all"
            />

            <button
              onClick={() => onRemoveSpec(i)}
              type="button"
              className="text-[#111111]/20 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors ml-1 shrink-0"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
