import HomePageClient from "@/components/pages/HomePageClient";
import { getPageContentData } from "@/lib/page-content";
import { isSupportedLocale } from "@/lib/i18n/locales";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const initialContent = isSupportedLocale(locale)
    ? await getPageContentData("home", locale)
    : null;

  return <HomePageClient initialContent={initialContent} />;
}
