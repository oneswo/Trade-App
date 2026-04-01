import ProductsPageClient from "@/components/pages/ProductsPageClient";
import { isSupportedLocale } from "@/lib/i18n/locales";
import { getPageContentData } from "@/lib/page-content";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const initialContent = isSupportedLocale(locale)
    ? await getPageContentData("products", locale)
    : null;

  return <ProductsPageClient initialContent={initialContent} />;
}
