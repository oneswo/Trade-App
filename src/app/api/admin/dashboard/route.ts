import { hasAdminSession } from "@/lib/auth/session";
import { getInquiryRepo, getProductRepo } from "@/lib/data/repository";

export async function GET(request: Request) {
  if (!hasAdminSession(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const [inquiries, products] = await Promise.all([
    getInquiryRepo().list(),
    getProductRepo().list(),
  ]);

  const totalInquiries = inquiries.length;
  const unreadInquiries = inquiries.filter((i) => !i.isRead).length;
  const totalProducts = products.length;
  const draftProducts = products.filter((p) => p.status === "DRAFT").length;

  return Response.json({
    ok: true,
    data: {
      totalInquiries,
      unreadInquiries,
      totalProducts,
      draftProducts,
    },
  });
}
