import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";
import { verifyToken } from "@/lib/auth/session";

const intlMiddleware = createMiddleware(routing);

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isAdminLoginPath(pathname: string) {
  return pathname === "/admin/login" || pathname.startsWith("/admin/login/");
}

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isAdminPath(pathname)) {
    const rawToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value ?? "";
    const authenticated = rawToken !== "" && verifyToken(rawToken);

    if (!authenticated && !isAdminLoginPath(pathname)) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (authenticated && isAdminLoginPath(pathname)) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(en|zh)/:path*", "/admin/:path*"],
};
