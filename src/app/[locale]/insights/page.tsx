import InsightsPageClient from "@/components/pages/InsightsPageClient";
import { isSupportedLocale } from "@/lib/i18n/locales";
import { getPageContentData } from "@/lib/page-content";

export default async function InsightsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const initialContent = isSupportedLocale(locale)
    ? await getPageContentData("insights", locale)
    : null;

  return <InsightsPageClient initialContent={initialContent} />;
}
