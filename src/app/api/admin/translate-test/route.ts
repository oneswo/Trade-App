import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";
import { verifyToken } from "@/lib/auth/session";

function getTranslationTestErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "连接失败，请稍后重试";
  }

  if (error.name === "TimeoutError" || error.message.toLowerCase().includes("timeout")) {
    return "连接超时,请检查网络和 API 地址";
  }

  if (
    error.message.includes("fetch failed") ||
    error.message.includes("ENOTFOUND") ||
    error.message.includes("ECONNREFUSED") ||
    error.message.toLowerCase().includes("network")
  ) {
    return "网络错误,请检查翻译服务配置或网络连接";
  }

  return error.message || "连接失败，请稍后重试";
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
    const { provider, apiKey, baseUrl, model } = body;

    if (!provider || !apiKey) {
      return NextResponse.json(
        { ok: false, error: "缺少必要的参数" },
        { status: 400 }
      );
    }

    // 根据服务商构建请求
    let apiUrl: string;
    let headers: Record<string, string>;
    let payload: any;

    if (provider === 'qwen' || provider === 'openai') {
      // 千问和 OpenAI 使用兼容接口
      apiUrl = baseUrl || (provider === 'qwen' 
        ? 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
        : 'https://api.openai.com/v1/chat/completions');
      
      // 如果是千问默认地址,需要补全路径
      if (baseUrl && !baseUrl.includes('/chat/completions')) {
        apiUrl = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
      }

      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      };

      payload = {
        model: model || (provider === 'qwen' ? 'qwen-turbo' : 'gpt-4o-mini'),
        messages: [
          { role: 'user', content: 'Hi' }
        ],
        max_tokens: 10,
      };
    } else if (provider === 'deepl') {
      apiUrl = 'https://api-free.deepl.com/v2/translate';
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
      };

      payload = {
        text: ['Hi'],
        target_lang: 'EN',
      };
    } else {
      return NextResponse.json(
        { ok: false, error: "不支持的翻译服务商" },
        { status: 400 }
      );
    }

    // 发送测试请求
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000), // 10秒超时
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || errorData.message || `HTTP ${response.status}`;
      return NextResponse.json(
        { ok: false, error: `连接失败: ${errorMsg}` },
        { status: 200 }
      );
    }

    // 验证成功
    return NextResponse.json({
      ok: true,
      message: '连接成功！API Key 有效',
    });

  } catch (error) {
    console.error('Translation API test failed:', error);

    return NextResponse.json(
      { ok: false, error: getTranslationTestErrorMessage(error) },
      { status: 200 }
    );
  }
}
