import { getInquiryRepo } from "@/lib/data/repository";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
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

