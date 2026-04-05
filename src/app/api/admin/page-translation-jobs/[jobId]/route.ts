import { hasAdminSession } from "@/lib/auth/session";
import { getPageContentTranslationJob } from "@/lib/admin/page-content-translation-jobs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { jobId } = await params;
  const job = getPageContentTranslationJob(jobId);
  if (!job) {
    return Response.json({ ok: false, error: "Job not found" }, { status: 404 });
  }

  return Response.json({ ok: true, job });
}
