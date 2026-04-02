"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import {
  type CatalogProductCard,
  type CatalogProductDetail,
  getCatalogProductDetail,
  getCatalogProducts,
  getCatalogRelatedProducts,
} from "@/lib/products/catalog";
import { type SupportedLocale } from "@/lib/i18n/locales";

export function useCatalogProducts(initialProducts?: CatalogProductCard[] | null) {
  const [products, setProducts] = useState<CatalogProductCard[]>(() => initialProducts ?? []);
  const [loading, setLoading] = useState(() => initialProducts == null);
  const locale = useLocale() as SupportedLocale;

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (initialProducts == null) {
        setLoading(true);
      }
      try {
        const list = await getCatalogProducts(locale);
        if (!active) return;
        setProducts(list);
      } finally {
        if (active) setLoading(false);
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [initialProducts, locale]);

  return {
    products,
    loading,
  };
}

export function useCatalogProductDetail(slug: string) {
  const [product, setProduct] = useState<CatalogProductDetail | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<CatalogProductCard[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale() as SupportedLocale;

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!slug) {
        setProduct(null);
        setRelatedProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [detail, related] = await Promise.all([
          getCatalogProductDetail(slug, locale),
          getCatalogRelatedProducts(slug, 3, locale),
        ]);

        if (!active) return;

        setProduct(detail);
        setRelatedProducts(related);
      } finally {
        if (active) setLoading(false);
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [locale, slug]);

  return {
    product,
    relatedProducts,
    loading,
  };
}
