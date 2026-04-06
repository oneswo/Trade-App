import { getSiteSettingsRepo } from "@/lib/data/repository";

export async function translateText(text: string, sourceLang = "zh", targetLang = "en") {
  if (!text || typeof text !== "string") {
    throw new Error("缺少待翻译文本");
  }

  if (text.length > 5000) {
    throw new Error("文本长度超过限制(最大5000字符)");
  }

  const settingsRepo = getSiteSettingsRepo();
  const settings = await settingsRepo.get();
  const { translationProvider, translationApiKey, translationApiBaseUrl, translationModel } = settings;

  if (!translationProvider || !translationApiKey) {
    throw new Error("请先在「全局设置」中配置翻译 API");
  }

  let apiUrl: string;
  let headers: Record<string, string>;
  let payload: unknown;

  if (translationProvider === "qwen" || translationProvider === "openai") {
    apiUrl =
      translationApiBaseUrl ||
      (translationProvider === "qwen"
        ? "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions");

    if (translationApiBaseUrl && !translationApiBaseUrl.includes("/chat/completions")) {
      apiUrl = `${translationApiBaseUrl.replace(/\/+$/, "")}/chat/completions`;
    }

    headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${translationApiKey}`,
    };

    const systemPrompt = `You are a professional translator. Translate the following text from ${
      sourceLang === "zh" ? "Chinese" : sourceLang
    } to ${
      targetLang === "en" ? "English" : targetLang
    }. Only return the translated text, no explanations.`;

    payload = {
      model: translationModel || (translationProvider === "qwen" ? "qwen-turbo" : "gpt-4o-mini"),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    };
  } else if (translationProvider === "deepl") {
    apiUrl = "https://api-free.deepl.com/v2/translate";
    headers = {
      "Content-Type": "application/json",
      Authorization: `DeepL-Auth-Key ${translationApiKey}`,
    };

    payload = {
      text: [text],
      target_lang: targetLang.toUpperCase(),
      source_lang: sourceLang.toUpperCase() === "ZH" ? "ZH" : undefined,
    };
  } else {
    throw new Error("不支持的翻译服务商");
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg =
      errorData.error?.message || errorData.message || `HTTP ${response.status}`;
    throw new Error(`翻译失败: ${errorMsg}`);
  }

  const resultData = await response.json();

  const translatedText =
    translationProvider === "qwen" || translationProvider === "openai"
      ? resultData.choices?.[0]?.message?.content?.trim() || ""
      : resultData.translations?.[0]?.text || "";

  if (!translatedText) {
    throw new Error("翻译结果为空");
  }

  return translatedText;
}
