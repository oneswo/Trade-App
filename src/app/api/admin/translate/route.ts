import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";
import { verifyToken } from "@/lib/auth/session";
import { getSiteSettingsRepo } from "@/lib/data/repository";

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

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { ok: false, error: "缺少待翻译文本" },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { ok: false, error: "文本长度超过限制(最大5000字符)" },
        { status: 400 }
      );
    }

    // 获取翻译配置
    const settingsRepo = getSiteSettingsRepo();
    const settings = await settingsRepo.get();
    const { translationProvider, translationApiKey, translationApiBaseUrl } = settings;

    if (!translationProvider || !translationApiKey) {
      return NextResponse.json(
        { ok: false, error: "请先在「全局设置」中配置翻译 API" },
        { status: 400 }
      );
    }

    // 根据服务商构建请求
    let apiUrl: string;
    let headers: Record<string, string>;
    let payload: any;

    if (translationProvider === 'qwen' || translationProvider === 'openai') {
      // 千问和 OpenAI 使用兼容接口
      apiUrl = translationApiBaseUrl || (translationProvider === 'qwen'
        ? 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
        : 'https://api.openai.com/v1/chat/completions');
      
      // 如果是自定义地址,需要补全路径
      if (translationApiBaseUrl && !translationApiBaseUrl.includes('/chat/completions')) {
        apiUrl = `${translationApiBaseUrl.replace(/\/+$/, '')}/chat/completions`;
      }

      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${translationApiKey}`,
      };

      // 构建翻译 prompt
      const systemPrompt = `You are a professional translator. Translate the following text from ${sourceLang === 'zh' ? 'Chinese' : sourceLang} to ${targetLang === 'en' ? 'English' : targetLang}. Only return the translated text, no explanations.`;
      
      payload = {
        model: translationProvider === 'qwen' ? 'qwen-turbo' : 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.3, // 翻译使用较低温度,保证准确性
        max_tokens: 2000,
      };
    } else if (translationProvider === 'deepl') {
      apiUrl = 'https://api-free.deepl.com/v2/translate';
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `DeepL-Auth-Key ${translationApiKey}`,
      };

      payload = {
        text: [text],
        target_lang: targetLang.toUpperCase(),
        source_lang: sourceLang.toUpperCase() === 'ZH' ? 'ZH' : undefined,
      };
    } else {
      return NextResponse.json(
        { ok: false, error: "不支持的翻译服务商" },
        { status: 400 }
      );
    }

    // 发送翻译请求
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000), // 30秒超时
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || errorData.message || `HTTP ${response.status}`;
      return NextResponse.json(
        { ok: false, error: `翻译失败: ${errorMsg}` },
        { status: 200 }
      );
    }

    const resultData = await response.json();

    // 解析翻译结果
    let translatedText: string;

    if (translationProvider === 'qwen' || translationProvider === 'openai') {
      translatedText = resultData.choices?.[0]?.message?.content?.trim() || '';
    } else if (translationProvider === 'deepl') {
      translatedText = resultData.translations?.[0]?.text || '';
    } else {
      translatedText = '';
    }

    if (!translatedText) {
      return NextResponse.json(
        { ok: false, error: "翻译结果为空" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      ok: true,
      translatedText,
    });

  } catch (error) {
    console.error('Translation API error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
        return NextResponse.json(
          { ok: false, error: '翻译超时,请稍后重试' },
          { status: 200 }
        );
      }
    }

    return NextResponse.json(
      { ok: false, error: '网络错误,请检查网络连接' },
      { status: 200 }
    );
  }
}
