import AboutPageClient from "@/components/pages/AboutPageClient";
import { isSupportedLocale } from "@/lib/i18n/locales";
import { getPageContentData } from "@/lib/page-content";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const initialContent = isSupportedLocale(locale)
    ? await getPageContentData("about", locale)
    : null;

  return <AboutPageClient initialContent={initialContent} />;
}
