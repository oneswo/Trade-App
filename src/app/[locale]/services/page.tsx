import ServicesPageClient from "@/components/pages/ServicesPageClient";
import { isSupportedLocale } from "@/lib/i18n/locales";
import { getPageContentData } from "@/lib/page-content";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const initialContent = isSupportedLocale(locale)
    ? await getPageContentData("services", locale)
    : null;

  return <ServicesPageClient initialContent={initialContent} />;
}
