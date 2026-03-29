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

  const sortedInquiries = [...inquiries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const recentInquiries = sortedInquiries.slice(0, 5).map((inq) => {
    // 粗略计算时间差
    const diffMs = Date.now() - new Date(inq.createdAt).getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffHours / 24;
    
    let timeLabel = "";
    if (diffHours < 1) timeLabel = "刚刚";
    else if (diffHours < 24) timeLabel = `${Math.floor(diffHours)}小时前`;
    else timeLabel = `${Math.floor(diffDays)}天前`;

    return {
      id: inq.id,
      name: inq.name,
      email: inq.email || "—",
      phone: inq.phone || undefined,
      message: inq.message,
      product: inq.source || "通用询盘",
      country: "🌐",
      region: inq.locale?.toUpperCase() || "未知",
      time: timeLabel,
      isUnread: !inq.isRead,
      status: inq.status,
    };
  });

  return Response.json({
    ok: true,
    data: {
      totalInquiries,
      unreadInquiries,
      totalProducts,
      draftProducts,
      recentInquiries,
    },
  });
}
