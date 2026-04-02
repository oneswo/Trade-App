import type { InquiryRecord } from "@/lib/data/repository";

export const INQUIRY_SOURCE_LABELS: Record<string, string> = {
  "global-inquiry": "全局询盘",
  "global-fab": "全局询盘",
  "home-page-cta": "首页询盘",
  "product-detail-cta": "产品详情页",
  "about-page-cta": "关于我们页",
  "services-page-cta": "服务页面",
  "contact-page-form": "联系页面",
  "contact-page-cta": "联系页面",
};

export function resolveInquiryLabel(
  record: Pick<InquiryRecord, "source" | "pagePath">
) {
  const mappedLabel = record.source ? INQUIRY_SOURCE_LABELS[record.source] : null;
  return mappedLabel ?? record.pagePath ?? record.source ?? "通用询盘";
}
