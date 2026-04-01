import { NextResponse } from "next/server";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import { getAdminAuthRepo } from "@/lib/data/repository";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";
import { signSession } from "@/lib/auth/session";

const loginSchema = z.object({
  identifier: z.string().trim().min(1),
  password: z.string().trim().min(1),
});

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const parsed = loginSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "validation_failed" },
        { status: 400 }
      );
    }

    const identifier = parsed.data.identifier.toLowerCase();
    const password = parsed.data.password;

    const repo = getAdminAuthRepo();
    const admin = await repo.findByIdentifier(identifier);

    // 支持 bcrypt 哈希密码（生产环境）和明文密码（dev 环境变量）
    const isValid =
      admin &&
      (admin.password.startsWith("$2")
        ? bcryptjs.compareSync(password, admin.password)
        : admin.password === password);

    if (!isValid) {
      return NextResponse.json(
        { ok: false, error: "invalid_credentials" },
        { status: 401 }
      );
    }

    const payload = `${admin.id}.${Date.now()}`;
    const token = signSession(payload);

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { ok: false, error: "unexpected_error" },
      { status: 500 }
    );
  }
}
