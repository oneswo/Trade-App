import { createHmac, timingSafeEqual } from "crypto";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";

function getSecret(): string {
  return process.env.JWT_SECRET ?? "kxtj-dev-secret-change-in-production";
}

function hmacHex(data: string): string {
  return createHmac("sha256", getSecret()).update(data, "utf8").digest("hex");
}

/** 签发会话 token：payload.hmac_hex */
export function signSession(payload: string): string {
  return `${payload}.${hmacHex(payload)}`;
}

export function verifyToken(token: string): boolean {
  const lastDot = token.lastIndexOf(".");
  if (lastDot < 0) return false;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  if (!payload || !sig) return false;

  const expected = hmacHex(payload);
  try {
    const sigBuf = Buffer.from(sig, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length || sigBuf.length === 0) return false;
    return timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

export function hasAdminSession(request: Request): boolean {
  const cookie = request.headers.get("cookie") ?? "";
  const target = `${ADMIN_SESSION_COOKIE}=`;
  const rawToken = cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(target))
    ?.slice(target.length)
    .trim();

  if (!rawToken) return false;
  return verifyToken(rawToken);
}
