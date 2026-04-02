"use client";

import { createContext, useContext } from "react";

// ─── 页面内容 Context ─────────────────────────────────────────────────────────
// 所有 Fields 子组件通过此 Context 读写当前页面的字段数据，
// 无需将 fields / setFields 逐层 prop 透传。

export const Ctx = createContext<{
  get: (name: string, fallback: string) => string;
  set: (name: string, val: string) => void;
  trackUploadedUrl: (url: string) => void;
}>({
  get: (_, fallback) => fallback,
  set: () => {},
  trackUploadedUrl: () => {},
});

export function useCtx() {
  return useContext(Ctx);
}
