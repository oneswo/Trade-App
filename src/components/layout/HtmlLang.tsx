"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

/** 根 layout 的 <html> 无法按 locale 分段，用客户端同步 lang / dir */
export default function HtmlLang() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
