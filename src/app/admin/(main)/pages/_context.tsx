"use client";

import { createContext, useContext } from "react";

// ─── 页面内容 Context ─────────────────────────────────────────────────────────
// 所有 Fields 子组件通过此 Context 读写当前页面的字段数据，
// 无需将 fields / setFields 逐层 prop 透传。

export const Ctx = createContext<{
  get: (name: string, fallback: string) => string;
  has: (name: string) => boolean;
  set: (name: string, val: string) => void;
  trackUploadedUrl: (url: string) => void;
  // 翻译相关
  isZh: boolean; // 当前是否中文 tab
  allFields: Record<string, string>; // 所有字段值(用于读取对应中文)
}>({
  get: (_, fallback) => fallback,
  has: () => false,
  set: () => {},
  trackUploadedUrl: () => {},
  isZh: true,
  allFields: {},
});

export function useCtx() {
  return useContext(Ctx);
}
