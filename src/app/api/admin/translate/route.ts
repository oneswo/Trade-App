import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";
import { verifyToken } from "@/lib/auth/session";
import { translateText } from "@/lib/admin/translation-service";

function getTranslationErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "翻译失败，请稍后重试";
  }

  if (error.name === "TimeoutError" || error.message.toLowerCase().includes("timeout")) {
    return "翻译超时,请稍后重试";
  }

  if (
    error.message.includes("请先在「全局设置」中配置翻译 API") ||
    error.message.includes("不支持的翻译服务商") ||
    error.message.includes("缺少待翻译文本") ||
    error.message.includes("文本长度超过限制") ||
    error.message.startsWith("翻译失败:")
  ) {
    return error.message;
  }

  if (
    error.message.includes("fetch failed") ||
    error.message.includes("ENOTFOUND") ||
    error.message.includes("ECONNREFUSED") ||
    error.message.toLowerCase().includes("network")
  ) {
    return "网络错误,请检查翻译服务配置或网络连接";
  }

  return error.message || "翻译失败，请稍后重试";
}

async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? "";
  return token !== "" && verifyToken(token);
}

export async function POST(request: NextRequest) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { text, sourceLang = 'zh', targetLang = 'en' } = body;
    const translatedText = await translateText(text, sourceLang, targetLang);

    return NextResponse.json({
      ok: true,
      translatedText,
    });

  } catch (error) {
    console.error('Translation API error:', error);

    return NextResponse.json(
      { ok: false, error: getTranslationErrorMessage(error) },
      { status: 200 }
    );
  }
}
