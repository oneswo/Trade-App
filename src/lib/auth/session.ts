import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";

export function hasAdminSession(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const target = `${ADMIN_SESSION_COOKIE}=`;

  return cookie
    .split(";")
    .map((item) => item.trim())
    .some((item) => item.startsWith(target) && item.length > target.length);
}
