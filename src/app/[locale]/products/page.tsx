import ProductsPageClient from "@/components/pages/ProductsPageClient";
import { connection } from "next/server";
import { getCategoryRepo, getProductRepo } from "@/lib/data/repository";
import { isSupportedLocale } from "@/lib/i18n/locales";
import { getPageContentData } from "@/lib/page-content";
import { toCatalogProductCard } from "@/lib/products/catalog";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await connection();
  const { locale } = await params;
  const isValidLocale = isSupportedLocale(locale);
  const initialContent = isValidLocale
    ? await getPageContentData("products", locale)
    : null;
  const initialProducts = isValidLocale
    ? (await getProductRepo().list())
        .filter((item) => item.status === "PUBLISHED")
        .map((item) => toCatalogProductCard(item, locale))
    : null;
  const initialCategories = (await getCategoryRepo().list()).filter((item) => item.enabled);

  return (
    <ProductsPageClient
      initialContent={initialContent}
      initialProducts={initialProducts}
      initialCategories={initialCategories}
    />
  );
}
