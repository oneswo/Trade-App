import { z } from "zod";
import { hasAdminSession } from "@/lib/auth/session";
import { getTicketRepo } from "@/lib/data/repository";

const TYPE_ENUM = z.enum(["BUG", "FEATURE", "QUESTION"]);

const createTicketSchema = z.object({
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().min(2).max(1000),
  type: TYPE_ENUM,
});

export async function GET(request: Request) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const repo = getTicketRepo();
  const tickets = await repo.list();

  return Response.json({
    ok: true,
    data: tickets,
  });
}

export async function POST(request: Request) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const raw = await request.json();
    const parsed = createTicketSchema.safeParse(raw);

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

    const repo = getTicketRepo();
    const created = await repo.create(parsed.data);

    return Response.json({
      ok: true,
      data: created,
    });
  } catch {
    return Response.json(
      { ok: false, error: "unexpected_error" },
      { status: 500 }
    );
  }
}
