"use client";

import {
  Activity,
  CalendarDays,
  Cpu,
  MapPin,
  Target,
} from "lucide-react";
import type { ProductEditorCoreMetrics } from "./types";

export function CoreSpecsSection({
  enableTrustCards,
  onToggleTrustCards,
  coreMetrics,
  onCoreMetricsChange,
}: {
  enableTrustCards: boolean;
  onToggleTrustCards: () => void;
  coreMetrics: ProductEditorCoreMetrics;
  onCoreMetricsChange: (metrics: ProductEditorCoreMetrics) => void;
}) {
  return (
    <section className="bg-[#111111] rounded-xl p-8 shadow-sm">
      <div className="mb-6 pb-4 border-b border-white/[0.08] flex items-center justify-between">
        <h2 className="text-[13px] font-bold text-white flex items-center gap-2">
          <Activity size={16} className="text-[#D4AF37]" />
          首屏前置核心指标 (Core Specifications)
        </h2>

        <div className="flex items-center gap-3">
          <span className="text-[12px] font-semibold text-gray-400">
            开启安全背书卡片 (销售闭环)
          </span>
          <button
            type="button"
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${
              enableTrustCards ? "bg-[#25D366]" : "bg-white/20"
            }`}
            onClick={onToggleTrustCards}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition ${
                enableTrustCards ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white/5 rounded-lg p-3.5 border border-white/5 focus-within:border-white/20 transition-colors">
          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 flex justify-between">
            出厂年份 <CalendarDays size={12} className="text-gray-600" />
          </div>
          <input
            type="text"
            value={coreMetrics.year}
            onChange={(e) =>
              onCoreMetricsChange({ ...coreMetrics, year: e.target.value })
            }
            placeholder="2021"
            className="w-full bg-transparent text-[15px] font-bold text-white focus:outline-none placeholder:text-gray-700"
          />
        </div>
        <div className="bg-white/5 rounded-lg p-3.5 border border-white/5 focus-within:border-white/20 transition-colors">
          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 flex justify-between">
            表显工时 <Activity size={12} className="text-gray-600" />
          </div>
          <input
            type="text"
            value={coreMetrics.hours}
            onChange={(e) =>
              onCoreMetricsChange({ ...coreMetrics, hours: e.target.value })
            }
            placeholder="1,800 小时"
            className="w-full bg-transparent text-[15px] font-bold text-white focus:outline-none placeholder:text-gray-700"
          />
        </div>
        <div className="bg-white/5 rounded-lg p-3.5 border border-white/5 focus-within:border-white/20 transition-colors">
          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 flex justify-between">
            公称吨位 <Target size={12} className="text-gray-600" />
          </div>
          <input
            type="text"
            value={coreMetrics.tonnage}
            onChange={(e) =>
              onCoreMetricsChange({ ...coreMetrics, tonnage: e.target.value })
            }
            placeholder="36.0 吨"
            className="w-full bg-transparent text-[15px] font-bold text-white focus:outline-none placeholder:text-gray-700"
          />
        </div>
        <div className="bg-white/5 rounded-lg p-3.5 border border-white/5 focus-within:border-white/20 transition-colors">
          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 flex justify-between">
            实车坐标 <MapPin size={12} className="text-gray-600" />
          </div>
          <input
            type="text"
            value={coreMetrics.location}
            onChange={(e) =>
              onCoreMetricsChange({ ...coreMetrics, location: e.target.value })
            }
            placeholder="上海保税区"
            className="w-full bg-transparent text-[15px] font-bold text-white focus:outline-none placeholder:text-gray-700"
          />
        </div>
        <div className="bg-white/5 rounded-lg p-3.5 border border-white/5 focus-within:border-white/20 transition-colors">
          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 flex justify-between">
            系统机型 <Cpu size={12} className="text-gray-600" />
          </div>
          <input
            type="text"
            value={coreMetrics.model}
            onChange={(e) =>
              onCoreMetricsChange({ ...coreMetrics, model: e.target.value })
            }
            placeholder="Isuzu 6HK1"
            className="w-full bg-transparent text-[15px] font-bold text-white focus:outline-none placeholder:text-gray-700"
          />
        </div>
        <div className="bg-white/5 rounded-lg p-3.5 border border-white/5 focus-within:border-white/20 transition-colors">
          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 flex justify-between">
            品牌认证标
          </div>
          <input
            type="text"
            value={coreMetrics.brand}
            onChange={(e) =>
              onCoreMetricsChange({ ...coreMetrics, brand: e.target.value })
            }
            placeholder="SANY"
            className="w-full bg-transparent text-[15px] font-bold text-white focus:outline-none placeholder:text-gray-700"
          />
        </div>
      </div>
    </section>
  );
}
