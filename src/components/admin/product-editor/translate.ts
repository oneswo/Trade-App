"use client";

export async function translateWithAdminApi(text: string, sourceLang = "zh", targetLang = "en") {
  const value = text.trim();
  if (!value) return "";

  const res = await fetch("/api/admin/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: value, sourceLang, targetLang }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || `翻译请求失败 (${res.status})`);
  }

  if (!data?.ok) {
    throw new Error(data?.error || "翻译失败");
  }

  if (typeof data.translatedText !== "string" || !data.translatedText.trim()) {
    throw new Error("翻译结果为空");
  }

  return data.translatedText as string;
}
