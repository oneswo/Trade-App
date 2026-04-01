import HomePageClient from "@/components/pages/HomePageClient";
import { getPageContentData } from "@/lib/page-content";
import { isSupportedLocale } from "@/lib/i18n/locales";
import { getBlurDataURL } from "@/lib/blur";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const initialContent = isSupportedLocale(locale)
    ? await getPageContentData("home", locale)
    : null;

  const posterUrl = initialContent?.["hero.posterUrl"];
  const heroBlur = posterUrl ? await getBlurDataURL(posterUrl) : undefined;

  return <HomePageClient initialContent={initialContent} heroBlur={heroBlur} />;
}
