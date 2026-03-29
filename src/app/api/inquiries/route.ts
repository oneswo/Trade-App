import { z } from "zod";
import { getInquiryRepo } from "@/lib/data/repository";
import { hasAdminSession } from "@/lib/auth/session";

const inquirySchema = z.object({
  name: z.string().trim().min(1, "name_required").max(80, "name_too_long"),
  contact: z.string().trim().min(2, "contact_required").max(120, "contact_invalid"),
  message: z
    .string()
    .trim()
    .min(2, "message_too_short")
    .max(2000, "message_too_long"),
  locale: z.string().trim().min(2).max(10).optional(),
  source: z.string().trim().max(100).optional(),
  pagePath: z.string().trim().max(300).optional(),
  website: z.string().trim().max(200).optional(),
});

function parseContact(contact: string) {
  if (contact.includes("@")) {
    return { email: contact, phone: null as string | null };
  }
  return { email: null as string | null, phone: contact };
}

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 6;

declare global {
  var __inquiryRateLimitStore__: Map<string, number[]> | undefined;
}

function getRateLimitStore() {
  if (!globalThis.__inquiryRateLimitStore__) {
    globalThis.__inquiryRateLimitStore__ = new Map<string, number[]>();
  }
  return globalThis.__inquiryRateLimitStore__;
}

function getClientKey(request: Request) {
  const headerValue =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const firstIp = headerValue.split(",")[0]?.trim();
  return firstIp || "unknown";
}

function isRateLimited(clientKey: string) {
  const now = Date.now();
  const store = getRateLimitStore();
  const previous = store.get(clientKey) ?? [];
  const recent = previous.filter((time) => now - time <= RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    store.set(clientKey, recent);
    return true;
  }

  recent.push(now);
  store.set(clientKey, recent);
  return false;
}

export async function POST(request: Request) {
  try {
    const clientKey = getClientKey(request);
    if (isRateLimited(clientKey)) {
      return Response.json(
        {
          ok: false,
          error: "rate_limited",
        },
        { status: 429 }
      );
    }

    const raw = await request.json();
    const parsed = inquirySchema.safeParse(raw);

    if (!parsed.success) {
      return Response.json(
        {
          ok: false,
          error: "validation_failed",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    if (data.website && data.website.length > 0) {
      return Response.json({
        ok: true,
        data: {
          skipped: true,
        },
      });
    }

    const { email, phone } = parseContact(data.contact);
    const repo = getInquiryRepo();

    const inquiry = await repo.create({
      name: data.name,
      email,
      phone,
      message: data.message,
      locale: data.locale ?? "zh",
      source: data.source ?? null,
      pagePath: data.pagePath ?? null,
    });

    return Response.json({
      ok: true,
      data: {
        id: inquiry.id,
        createdAt: inquiry.createdAt,
      },
    });
  } catch {
    return Response.json(
      {
        ok: false,
        error: "unexpected_error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const repo = getInquiryRepo();
  const inquiries = await repo.list();

  return Response.json({
    ok: true,
    data: inquiries,
  });
}
