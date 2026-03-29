import { getCategoryRepo } from "@/lib/data/repository";

export const revalidate = 60;

export async function GET() {
  try {
    const repo = getCategoryRepo();
    const all = await repo.list();
    const data = all.filter((c) => c.enabled);
    return Response.json({ ok: true, data });
  } catch {
    return Response.json({ ok: false, error: "unexpected_error" }, { status: 500 });
  }
}
