'use client';
import { ChevronDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCatalogProducts } from '@/hooks/useProductCatalog';
import { useCategories, type CategoryRecord } from '@/hooks/useCategories';
import { ProductCardMedia } from '@/components/products/ProductCardMedia';

import { useLocale } from 'next-intl';
import { usePageContent } from '@/hooks/usePageContent';
import type { CatalogProductCard } from '@/lib/products/catalog';

type PageContentProps = {
  initialContent?: Record<string, string> | null;
  initialProducts?: CatalogProductCard[] | null;
  initialCategories?: CategoryRecord[] | null;
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  '挖掘机': ['挖掘机', 'Excavator'],
  '装载机': ['装载机', 'Loader'],
  '推土机': ['推土机', 'Dozer'],
  '压路机': ['压路机', 'Roller'],
  '起重机': ['起重机', 'Crane'],
  'Excavators': ['挖掘机', 'Excavator'],
  'Loaders': ['装载机', 'Loader'],
  'Dozers': ['推土机', 'Dozer'],
  'Rollers': ['压路机', 'Roller'],
  'Cranes': ['起重机', 'Crane'],
};

function normalizeYear(yearStr: string): string {
  const match = yearStr.match(/\d{4}/);
  return match ? match[0] : '';
}

function ProductsContent({ initialContent, initialProducts, initialCategories }: PageContentProps) {
  const locale = useLocale();
  const isZh = locale === 'zh';
  const { get: cms } = usePageContent('products', initialContent);
  const { products, loading } = useCatalogProducts(initialProducts);
  const { categories: catList } = useCategories(initialCategories);
  const searchParams = useSearchParams();
  const initCategory = searchParams.get('category');

  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  /* ── 动态筛选项：从已加载产品数据中提取 ── */
  const dynamicBrands = useMemo(() => {
    const seen = new Set<string>();
    products.forEach(p => { if (p.brand && p.brand !== '--') seen.add(p.brand); });
    return [...seen].sort();
  }, [products]);

  const dynamicYears = useMemo(() => {
    const seen = new Set<string>();
    products.forEach((p) => {
      const year = normalizeYear(p.year);
      if (year) seen.add(year);
    });
    return [...seen].sort((a, b) => Number(b) - Number(a));
  }, [products]);

  /* ── 核心数据流水线：筛选 ── */
  const filteredProducts = useMemo(() => {
    let list = products;

    if (selectedBrand) {
      list = list.filter(p => p.brand === selectedBrand);
    }
    if (selectedCategory) {
      list = list.filter(p =>
        (() => {
          if (p.categorySlug && p.categorySlug === selectedCategory.trim().toLowerCase()) return true;
          const kws = CATEGORY_KEYWORDS[selectedCategory] || [selectedCategory];
          return kws.some(kw => p.category.includes(kw) || kw.includes(p.category));
        })()
      );
    }
    if (selectedYear) {
      list = list.filter((p) => normalizeYear(p.year) === selectedYear);
    }
    return list;
  }, [products, selectedBrand, selectedCategory, selectedYear]);

  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // URL 参数初始化分类（catList 异步加载，此处 setState 是必要的副作用）
  useEffect(() => {
    if (initCategory && catList.length > 0) {
      const matched = catList.find(c =>
        c.slug.toLowerCase() === initCategory.toLowerCase() ||
        c.nameEn.toLowerCase().includes(initCategory.toLowerCase()) ||
        c.nameZh.includes(initCategory)
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (matched) setSelectedCategory(matched.slug);
    }
  }, [initCategory, catList]);

  // 筛选变化时回到第 1 页（派生 UI 状态，此处 setState 是必要的）
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [selectedBrand, selectedCategory, selectedYear]);

  return (
    <main className="w-full bg-[#FAFAFA] min-h-screen">

      {/* 2. 页面工作台架构 (Workspace Layout) */}
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-12">
        <section className="w-full">

          {/* Utility Bar */}
          <div className="w-full mb-8 bg-white rounded-2xl border border-[#EDECEA] shadow-[0_8px_30px_rgba(0,0,0,0.04)] px-5 py-4 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center min-w-fit pr-1">
                <h3 className="font-bold text-[13px] text-[#111111] uppercase tracking-[0.04em] border-l-4 border-[#111111] pl-3 flex items-center">
                  {cms('filter.sidebarTitle', isZh ? '筛选器' : 'Filters')}
                </h3>
              </div>

              <div className="ml-auto flex flex-wrap items-center justify-end gap-3 xl:gap-4">
                {dynamicBrands.length > 0 && (
                  <div className="relative min-w-[160px]">
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="h-11 w-full appearance-none rounded-xl border border-[#EDECEA] bg-[#F6F4F0] px-4 pr-10 text-[13px] font-semibold text-[#111111] focus:outline-none"
                    >
                      <option value="">{cms('filter.brandTitle', isZh ? '品牌' : 'Brands')}</option>
                      {dynamicBrands.map((brand) => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#111111]" />
                  </div>
                )}

                {catList.length > 0 && (
                  <div className="relative min-w-[170px]">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="h-11 w-full appearance-none rounded-xl border border-[#EDECEA] bg-[#F6F4F0] px-4 pr-10 text-[13px] font-semibold text-[#111111] focus:outline-none"
                    >
                      <option value="">{cms('filter.categoryTitle', isZh ? '分类' : 'Categories')}</option>
                      {catList.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {isZh ? cat.nameZh : cat.nameEn}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#111111]" />
                  </div>
                )}

                {dynamicYears.length > 0 && (
                  <div className="relative min-w-[170px]">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="h-11 w-full appearance-none rounded-xl border border-[#EDECEA] bg-[#F6F4F0] px-4 pr-10 text-[13px] font-semibold text-[#111111] focus:outline-none"
                    >
                      <option value="">{cms('filter.yearTitle', isZh ? '年份' : 'Year')}</option>
                      {dynamicYears.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#111111]" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {loading ? (
              <div className="col-span-full rounded border border-gray-200 bg-white px-6 py-10 text-sm text-gray-500">
                {cms('filter.loadingText', isZh ? '正在加载产品数据...' : 'Loading products...')}
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="col-span-full rounded border border-gray-200 bg-white px-6 py-16 text-center text-[#111111] font-bold text-[15px]">
                {cms('filter.emptyText', isZh ? '暂无符合条件的产品，请尝试其他筛选项' : 'No products found. Try different filters.')}
              </div>
            ) : currentProducts.map(product => (
              <div key={product.id} className="bg-white border border-gray-200/90 hover:border-[#111111]/70 hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)] transition-all duration-300 group flex flex-col relative rounded-2xl overflow-hidden">

                {/* 图像部分 */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                  <ProductCardMedia
                    src={product.coverMediaUrl}
                    type={product.coverMediaType}
                    alt={product.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-[800ms]"
                  />

                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 border border-white rounded-md flex items-center gap-2 shadow-md">
                    <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse"></span>
                    <span className="text-[#111111] font-bold text-[10px] tracking-[0.12em] uppercase">{cms('card.statusLabel', isZh ? '现货状态' : 'Available')}</span>
                  </div>
                </div>

                {/* 详单文案区 */}
                <div className="p-5 pb-4 flex-1 flex flex-col relative z-20 bg-white">

                  <div className="flex items-center justify-between mb-2.5 text-[12px] font-bold uppercase tracking-[0.08em]">
                    <span className="rounded-md bg-[#F6F4F0] px-2.5 py-1 text-[#8E949F]">
                      {product.brand}
                    </span>
                    <span className="rounded-md bg-[#F6F4F0] px-2.5 py-1 text-[#9CA3AF]">
                      {product.category}
                    </span>
                  </div>

                  <h2 className="text-[34px] font-black text-[#C8A12A] leading-none mb-2.5 group-hover:text-[#B8921E] transition-colors">{product.title}</h2>

                </div>

                {/* 稳定常显 CTA，避免悬浮突兀 */}
                <Link href={`/products/${product.slug}`} className="w-full bg-[#111111] text-white flex items-center justify-center gap-2 py-4 font-bold text-xs uppercase tracking-[0.2em] transition-colors duration-200 hover:bg-[#C8A12A] hover:text-[#111111]">
                  {cms('card.viewDetailsBtn', isZh ? '查阅详尽机况' : 'VIEW DETAILS')} <ArrowUpRight size={16} className="text-[#D4AF37]" />
                </Link>

              </div>
            ))}
          </div>

          {/* Pagination (真实分页功能) */}
          {totalPages > 1 && (
            <div className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-center gap-1 flex-wrap overflow-x-auto">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-[#111111] transition-colors disabled:opacity-30 disabled:hover:text-gray-400"
              >
                <ArrowRight className="rotate-180" size={20} />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className={`w-12 h-12 flex items-center justify-center font-black text-lg transition-colors ${currentPage === i + 1
                      ? 'bg-[#111111] text-white'
                      : 'text-gray-500 hover:text-[#111111]'
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-12 h-12 flex items-center justify-center text-[#111111] hover:text-[#D4AF37] transition-colors disabled:opacity-30 disabled:hover:text-[#111111]"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          )}

        </section>

      </div>
    </main>
  );
}

export default function ProductsPageClient({ initialContent, initialProducts, initialCategories }: PageContentProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA] pt-20">{'Fetching inventory data...'}</div>}>
      <ProductsContent
        initialContent={initialContent}
        initialProducts={initialProducts}
        initialCategories={initialCategories}
      />
    </Suspense>
  );
}
