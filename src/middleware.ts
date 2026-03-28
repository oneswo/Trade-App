import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";

const intlMiddleware = createIntlMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 后台鉴权 ────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();

    const session = request.cookies.get(ADMIN_SESSION_COOKIE);
    if (session?.value) return NextResponse.next();

    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── next-intl 国际化路由（仅前台页面，跳过 API / 静态文件）──
  return intlMiddleware(request);
}

export const config = {
  // API 路由、静态文件、_next 全部跳过
  matcher: [
    "/admin/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
