import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminAuthRepo } from "@/lib/data/repository";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";

const loginSchema = z.object({
  email: z.string().trim().email(),
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

    const email = parsed.data.email.toLowerCase();
    const password = parsed.data.password;

    const repo = getAdminAuthRepo();
    const admin = await repo.findByEmail(email);

    if (!admin || admin.password !== password) {
      return NextResponse.json(
        { ok: false, error: "invalid_credentials" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: `mock_${crypto.randomUUID()}`,
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

