"use client";

import { useState } from "react";
import {
  Activity,
  CalendarDays,
  Cpu,
  Loader2,
  MapPin,
  Sparkles,
  Target,
} from "lucide-react";
import type { ProductEditorCoreMetrics } from "./types";
import { translateWithAdminApi } from "./translate";

export function CoreSpecsSection({
  lang,
  coreMetrics,
  onCoreMetricsChange,
}: {
  lang: "zh" | "en";
  coreMetrics: ProductEditorCoreMetrics;
  onCoreMetricsChange: (metrics: ProductEditorCoreMetrics) => void;
}) {
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState("");

  const fieldMap = [
    { label: "出厂年份", keyZh: "yearZh", keyEn: "yearEn", placeholderZh: "2021", placeholderEn: "2021", icon: <CalendarDays size={12} className="text-gray-600" /> },
    { label: "表显工时", keyZh: "hoursZh", keyEn: "hoursEn", placeholderZh: "1,800 小时", placeholderEn: "1,800 hours", icon: <Activity size={12} className="text-gray-600" /> },
    { label: "公称吨位", keyZh: "tonnageZh", keyEn: "tonnageEn", placeholderZh: "36.0 吨", placeholderEn: "36.0 t", icon: <Target size={12} className="text-gray-600" /> },
    { label: "实车坐标", keyZh: "locationZh", keyEn: "locationEn", placeholderZh: "上海保税区", placeholderEn: "Shanghai Bonded Zone", icon: <MapPin size={12} className="text-gray-600" /> },
    { label: "系统机型", keyZh: "modelZh", keyEn: "modelEn", placeholderZh: "五十铃 6HK1", placeholderEn: "Isuzu 6HK1", icon: <Cpu size={12} className="text-gray-600" /> },
    { label: "品牌认证标", keyZh: "brandZh", keyEn: "brandEn", placeholderZh: "三一", placeholderEn: "SANY", icon: null },
  ] as const;

  const handleTranslateAll = async () => {
    if (lang !== "en") return;

    setTranslateError("");
    setTranslating(true);
    try {
      const translated = await Promise.all(
        fieldMap.map((field) => {
          const value = coreMetrics[field.keyZh];
          return value?.trim() ? translateWithAdminApi(value) : Promise.resolve(coreMetrics[field.keyEn] || "");
        })
      );

      const next = { ...coreMetrics };
      fieldMap.forEach((field, index) => {
        next[field.keyEn] = translated[index];
      });
      onCoreMetricsChange(next);
    } catch (error) {
      setTranslateError(error instanceof Error ? error.message : "翻译失败，请稍后重试");
    } finally {
      setTranslating(false);
    }
  };

  return (
    <section className="bg-[#111111] rounded-xl p-8 shadow-sm">
      <div className="mb-6 pb-4 border-b border-white/[0.08] flex items-center justify-between gap-4">
        <h2 className="text-[13px] font-bold text-white flex items-center gap-2">
          <Activity size={16} className="text-[#D4AF37]" />
          首屏前置核心指标 (Core Specifications)
        </h2>
        {lang === "en" && (
          <button
            type="button"
            onClick={handleTranslateAll}
            disabled={translating}
            className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            {translating ? (
              <span className="flex items-center gap-1.5">
                <Loader2 size={12} className="animate-spin" />
                翻译中
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#D4AF37]" />
                一键翻译核心指标
              </span>
            )}
          </button>
        )}
      </div>
      {translateError && (
        <p className="mb-4 text-[12px] font-medium text-[#ffb4b4]">{translateError}</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {fieldMap.map((field) => {
          const key = lang === "zh" ? field.keyZh : field.keyEn;
          const value = coreMetrics[key];
          const placeholder = lang === "zh" ? field.placeholderZh : field.placeholderEn;
          return (
            <div
              key={field.keyZh}
              className="bg-white/5 rounded-lg p-3.5 border border-white/5 focus-within:border-white/20 transition-colors"
            >
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 flex justify-between">
                {field.label}
                {field.icon}
              </div>
              <input
                type="text"
                value={value || ""}
                onChange={(e) =>
                  onCoreMetricsChange({
                    ...coreMetrics,
                    [key]: e.target.value,
                  })
                }
                placeholder={placeholder}
                className="w-full bg-transparent text-[15px] font-bold text-white focus:outline-none placeholder:text-gray-700"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
