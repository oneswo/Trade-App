import { getInquiryRepo } from "@/lib/data/repository";
import { hasAdminSession } from "@/lib/auth/session";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const repo = getInquiryRepo();
  const updated = await repo.markRead(id);

  if (!updated) {
    return Response.json(
      {
        ok: false,
        error: "not_found",
      },
      { status: 404 }
    );
  }

  return Response.json({
    ok: true,
    data: updated,
  });
}
