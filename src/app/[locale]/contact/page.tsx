import ContactPageClient from "@/components/pages/ContactPageClient";
import { isSupportedLocale } from "@/lib/i18n/locales";
import { getPageContentData } from "@/lib/page-content";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const initialContent = isSupportedLocale(locale)
    ? await getPageContentData("contact", locale)
    : null;

  return <ContactPageClient initialContent={initialContent} />;
}
