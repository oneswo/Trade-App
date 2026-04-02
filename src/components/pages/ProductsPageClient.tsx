'use client';
import { ChevronDown, Check, ArrowRight, X, SlidersHorizontal, ArrowUpRight, Search } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useState, useEffect, useMemo, Suspense, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCatalogProducts } from '@/hooks/useProductCatalog';
import { useCategories } from '@/hooks/useCategories';
import { ProductCardMedia } from '@/components/products/ProductCardMedia';

import { useLocale } from 'next-intl';
import { usePageContent } from '@/hooks/usePageContent';

type PageContentProps = {
  initialContent?: Record<string, string> | null;
};

// 年份区间定义（仅用于匹配逻辑，实际展示的区间从产品数据动态筛选）
const FILTERS_ZH = {
  years: ['2022及以上', '2018-2021', '2014-2017', '2013及以前'],
  weight: ['15吨以下', '15-35吨', '35吨以上']
};

const FILTERS_EN = {
  years: ['2022 & Newer', '2018-2021', '2014-2017', '2013 & Older'],
  weight: ['Compact (< 15t)', 'Mid (15-35t)', 'Heavy (> 35t)']
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

/** 从 "21.5T" / "21.5吨" 等字符串中提取数字 */
function parseNumeric(str: string): number {
  const m = str.match(/[\d.]+/);
  return m ? parseFloat(m[0]) : 0;
}

/** 年份区间匹配 */
function matchesYear(yearStr: string, filter: string): boolean {
  const y = parseInt(yearStr, 10);
  if (isNaN(y)) return false;
  if (filter.includes('2022')) return y >= 2022;
  if (filter.includes('2018') && filter.includes('2021')) return y >= 2018 && y <= 2021;
  if (filter.includes('2014') && filter.includes('2017')) return y >= 2014 && y <= 2017;
  if (filter.includes('2013')) return y <= 2013;
  return false;
}

/** 吨位区间匹配 */
function matchesWeight(weightStr: string, filter: string): boolean {
  const w = parseNumeric(weightStr);
  if (w === 0) return false;
  if ((filter.includes('以下') || filter.includes('Compact')) && filter.includes('15')) return w < 15;
  if (filter.includes('15') && filter.includes('35')) return w >= 15 && w <= 35;
  if ((filter.includes('以上') || filter.includes('Heavy')) && filter.includes('35')) return w > 35;
  return false;
}

function ProductsContent({ initialContent }: PageContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const isZh = locale === 'zh';
  const { get: c } = usePageContent('products', initialContent);
  const { products, loading } = useCatalogProducts();
  const { categories: catList } = useCategories();
  const searchParams = useSearchParams();
  const initCategory = searchParams.get('category');
  const initQ = searchParams.get('q') ?? '';
  
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(initQ);
  const [searchQuery, setSearchQuery] = useState(initQ);
  const [sortOption, setSortOption] = useState('newest');
  const didInitUrlRef = useRef(false);
  const heroBgImage = c('hero.bgImage', '');

  /* ── 动态筛选项：从已加载产品数据中提取 ── */
  const dynamicBrands = useMemo(() => {
    const seen = new Set<string>();
    products.forEach(p => { if (p.brand && p.brand !== '--') seen.add(p.brand); });
    return [...seen].sort();
  }, [products]);

  const dynamicYears = useMemo(() => {
    const allRanges = isZh ? FILTERS_ZH.years : FILTERS_EN.years;
    return allRanges.filter(range => products.some(p => matchesYear(p.year, range)));
  }, [products, isZh]);

  /* ── 核心数据流水线：筛选 → 排序 ── */
  const filteredProducts = useMemo(() => {
    const allCatSlugs = catList.map(c => c.slug);
    const allYears   = [...FILTERS_ZH.years, ...FILTERS_EN.years];
    const allWeights = [...FILTERS_ZH.weight, ...FILTERS_EN.weight];

    const selBrands  = activeFilters.filter(f => dynamicBrands.includes(f));
    const selCats    = activeFilters.filter(f => allCatSlugs.includes(f));
    const selYears   = activeFilters.filter(f => allYears.includes(f));
    const selWeights = activeFilters.filter(f => allWeights.includes(f));

    let list = products;

    // 组内 OR，组间 AND
    if (selBrands.length > 0) {
      // 品牌已本地化，直接精确比对
      list = list.filter(p => selBrands.includes(p.brand));
    }
    if (selCats.length > 0) {
      list = list.filter(p =>
        selCats.some(cf => {
          // 优先用原始 categorySlug 直接比对（精确匹配）
          if (p.categorySlug && p.categorySlug === cf.trim().toLowerCase()) return true;
          // 回退：用关键词模糊匹配本地化后的 category 展示文字
          const kws = CATEGORY_KEYWORDS[cf] || [cf];
          return kws.some(kw => p.category.includes(kw) || kw.includes(p.category));
        })
      );
    }
    if (selYears.length > 0) {
      list = list.filter(p => selYears.some(yf => matchesYear(p.year, yf)));
    }
    if (selWeights.length > 0) {
      list = list.filter(p => selWeights.some(wf => matchesWeight(p.weight, wf)));
    }

    // 搜索
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.engine.toLowerCase().includes(q) ||
        p.year.includes(q)
      );
    }

    // 排序
    const sorted = [...list];
    switch (sortOption) {
      case 'newest':
        sorted.sort((a, b) => parseInt(b.year) - parseInt(a.year));
        break;
      case 'hours':
        sorted.sort((a, b) => parseNumeric(a.hours) - parseNumeric(b.hours));
        break;
      case 'brand':
        sorted.sort((a, b) => a.brand.localeCompare(b.brand));
        break;
    }
    return sorted;
  }, [products, activeFilters, searchQuery, sortOption, catList, dynamicBrands]);

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
      if (matched) setActiveFilters([matched.slug]);
    }
  }, [initCategory, catList]);

  // 输入防抖：300ms 后触发实时过滤
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // URL 查询参数持久化（q）
  useEffect(() => {
    if (!didInitUrlRef.current) {
      didInitUrlRef.current = true;
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    const q = searchQuery.trim();
    if (q) params.set('q', q);
    else params.delete('q');
    const next = params.toString();
    const current = searchParams.toString();
    if (next !== current) {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }
  }, [pathname, router, searchParams, searchQuery]);

  // 筛选/搜索/排序变化时回到第 1 页（派生 UI 状态，此处 setState 是必要的）
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [activeFilters, searchQuery, sortOption]);

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  return (
    <main className="w-full bg-[#FAFAFA] min-h-screen pt-[72px]">
      
      {/* 1. 顶部全景冷峻大画幅 (Hero Search Terminal) */}
      <section className="relative w-full h-[450px] md:h-[500px] flex items-center justify-center bg-[#111111] overflow-hidden">
         {/* 背景暗纹蒙版与网格 */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
         <div className="absolute inset-0 opacity-60 bg-cover bg-center pointer-events-none scale-105 active:scale-100 transition-transform duration-[10s]" style={heroBgImage ? { backgroundImage: `url('${heroBgImage}')` } : undefined}></div>
         <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-[#111111]/10 pointer-events-none"></div>
         
         {/* 琥珀色微光 (Radiant Glow) */}
         <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D4AF37] opacity-[0.05] blur-[120px] rounded-full pointer-events-none"></div>
         <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#D4AF37] opacity-[0.03] blur-[150px] rounded-full pointer-events-none"></div>

         <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-[1100px] mx-auto text-center mt-4">
            
            {/* 顶部分类小提示，为了三页格式统一而保留相似体积的元素 */}
            <div className="flex items-center justify-center gap-3 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-6 border border-[#D4AF37]/20 rounded-full px-5 py-2 bg-[#D4AF37]/5 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span> 
              {c('hero.tag', isZh ? '全球二手重工机械直采平台' : 'GLOBAL USED HEAVY EQUIPMENT DIRECT SOURCING')}
            </div>

            <h1 className={`hero-title ${isZh ? 'hero-zh' : 'hero-en'}`}>
              {c('hero.title1', isZh ? '精品重装，' : 'PREMIUM IRON, ')}<span className="text-[#D4AF37]">{c('hero.titleGold', isZh ? '全球直发。' : 'GLOBAL DIRECT.')}</span>
            </h1>

            <p className="text-gray-400 text-sm md:text-[15px] font-medium text-center max-w-2xl mx-auto mb-6 leading-relaxed opacity-90">
              {c('hero.desc', isZh ? '集结全球顶级品牌二手工程机械，经 KXTJ 严苛百项质检，确保每台机械以最佳状态抵达目的地。' : 'Top-tier used construction machinery from global brands, each passing KXTJ\'s 100-point inspection.')}
            </p>

            {/* 搜框替换原副标题 (Height Locked) */}
            <div className="w-full flex items-center justify-center min-h-[60px] md:min-h-[80px]">
              <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 p-2 w-full max-w-[700px] mx-auto focus-within:bg-white/20 focus-within:border-white/40 transition-all duration-300 shadow-2xl rounded-sm">
                <Search className="text-gray-400 ml-4 mr-3" size={20} />
                <input 
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSearchQuery(searchInput);
                    }
                  }}
                  placeholder={c('filter.searchPlaceholder', isZh ? '搜索品牌、型号、工况...' : 'Search brand, model, condition...')}
                  className="flex-1 bg-transparent text-white font-medium placeholder:text-gray-500 tracking-wider focus:outline-none text-base py-3"
                />
                <button
                  onClick={() => setSearchQuery(searchInput)}
                  className="bg-[#D4AF37] text-black font-black uppercase text-xs tracking-widest px-8 md:px-10 py-3.5 hover:bg-white hover:text-black hover:shadow-[0_10px_20px_rgba(212,175,55,0.3)] transition-all"
                >
                  {c('filter.badge', isZh ? '精确寻机' : 'SEARCH')}
                </button>
              </div>
            </div>

         </div>
      </section>

      {/* 2. 页面工作台架构 (Workspace Layout) */}
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-12 flex flex-col lg:flex-row gap-12 items-start">
        
        {/* 移动端过滤器触发按钮 */}
        <div className="lg:hidden w-full flex justify-between items-center bg-white p-4 border border-gray-200">
           <span className="font-black text-[#111111] uppercase tracking-widest text-sm">{c('filter.panelTitle', isZh ? '筛选机械库' : 'FILTERS')}</span>
           <button onClick={() => setIsMobileSidebarOpen(true)} className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-100 px-4 py-2 uppercase tracking-wide">
             <SlidersHorizontal size={14} /> {c('filter.openBtn', isZh ? '打开终端' : 'OPEN TERMINAL')}
           </button>
        </div>

        {/* ---------------- 左侧：高压迫感检索树 (Precision Sidebar Filters) ---------------- */}
        <aside className={`fixed inset-y-0 left-0 z-[200] lg:relative lg:z-auto w-[300px] lg:w-[280px] bg-[#FAFAFA] lg:bg-transparent h-full lg:h-auto overflow-y-auto lg:overflow-visible transition-transform transform ${isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'} shrink-0`}>
          
          <div className="lg:hidden p-6 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
           <span className="font-black text-lg">{c('filter.mobileTitle', isZh ? '滤镜终端' : 'FILTERS TERMINAL')}</span>
            <X size={20} className="cursor-pointer text-gray-500" onClick={() => setIsMobileSidebarOpen(false)} />
          </div>

          <div className="p-6 lg:p-0 space-y-10">
            
            <div className="flex items-center justify-between w-full h-[44px] pb-3 border-b border-gray-200 box-border">
               <h3 className="font-bold text-[13px] text-[#111111] uppercase tracking-[0.04em] border-l-4 border-[#111111] pl-3 h-6 leading-none flex items-center">{c('filter.mobileSectionTitle', isZh ? '属性筛选大盘' : 'FILTER TERMINAL')}</h3>
               <button 
                 onClick={() => setActiveFilters([])}
                 className="text-[13px] font-bold uppercase tracking-[0.04em] text-gray-500 hover:text-[#D4AF37] transition-colors h-6 leading-none"
               >
                 {c('filter.resetBtn', isZh ? '重置参数' : 'RESET')}
               </button>
            </div>

            {/* Filter Group: 品牌（动态从产品数据汇总） */}
            {dynamicBrands.length > 0 && (
              <div>
                <h4 className="font-black text-sm text-[#111111] uppercase tracking-widest mb-4">{c('filter.brandTitle', isZh ? '核心厂牌' : 'BRANDS')}</h4>
                <ul className="space-y-3">
                  {dynamicBrands.map(brand => (
                    <li key={brand}>
                      <label
                        onClick={() => toggleFilter(brand)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${activeFilters.includes(brand) ? 'bg-[#111111] border-[#111111]' : 'border-gray-300 bg-white group-hover:border-[#111111]'}`}>
                          {activeFilters.includes(brand) && <Check size={12} className="text-[#D4AF37]" strokeWidth={4} />}
                        </div>
                        <span className={`text-[13px] font-medium transition-colors ${activeFilters.includes(brand) ? 'text-[#111111] font-bold' : 'text-gray-600 group-hover:text-[#111111]'}`}>{brand}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Filter Group: 品类（动态读取 categories 表）*/}
            {catList.length > 0 && (
              <div className="border-t border-gray-200 pt-8">
                <h4 className="font-black text-sm text-[#111111] uppercase tracking-widest mb-4">{c('filter.categoryTitle', isZh ? '器械类目' : 'CATEGORIES')}</h4>
                <ul className="space-y-3">
                  {catList.map(cat => {
                    const label = isZh ? cat.nameZh : cat.nameEn;
                    const active = activeFilters.includes(cat.slug);
                    return (
                      <li key={cat.slug}>
                        <label onClick={() => toggleFilter(cat.slug)} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${active ? 'bg-[#111111] border-[#111111]' : 'border-gray-300 bg-white group-hover:border-[#111111]'}`}>
                            {active && <Check size={12} className="text-[#D4AF37]" strokeWidth={4} />}
                          </div>
                          <span className={`text-[13px] font-medium transition-colors ${active ? 'text-[#111111] font-bold' : 'text-gray-600 group-hover:text-[#111111]'}`}>{label}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Filter Group: 年份（只展示实际有产品的区间） */}
            {dynamicYears.length > 0 && (
              <div className="border-t border-gray-200 pt-8 flex-1">
                <h4 className="font-black text-sm text-[#111111] uppercase tracking-widest mb-4">{c('filter.yearTitle', isZh ? '年份区间' : 'YEAR RANGE')}</h4>
                <ul className="space-y-3">
                  {dynamicYears.map(yr => (
                    <li key={yr}>
                      <label
                        onClick={() => toggleFilter(yr)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${activeFilters.includes(yr) ? 'bg-[#111111] border-[#111111]' : 'border-gray-300 bg-white group-hover:border-[#111111]'}`}>
                          {activeFilters.includes(yr) && <Check size={12} className="text-[#D4AF37]" strokeWidth={4} />}
                        </div>
                        <span className={`text-[13px] font-medium transition-colors ${activeFilters.includes(yr) ? 'text-[#111111] font-bold' : 'text-gray-600 group-hover:text-[#111111]'}`}>{yr}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sticky Action on Mobile */}
            <div className="lg:hidden sticky bottom-0 left-0 w-full p-4 bg-white border-t border-gray-200 mt-8">
               <button onClick={() => setIsMobileSidebarOpen(false)} className="w-full bg-[#111111] text-white font-bold uppercase tracking-widest py-4 text-xs">{c('filter.executeBtn', isZh ? '执行绝对检索' : 'EXECUTE SEARCH')}</button>
            </div>

          </div>
        </aside>

        {/* ---------------- 右侧：硬装图鉴卡片阵列 (Equipment Matrix) ---------------- */}
        <section className="flex-1 w-full">
           
           {/* Utility Bar */}
           <div className="w-full flex flex-wrap items-center justify-between gap-y-2 h-[44px] mb-8 pb-3 border-b border-gray-200 box-border">
              <div className="text-[#111111] font-bold text-[13px] uppercase tracking-[0.04em] h-6 leading-none flex items-center">
                {c('filter.resultsPrefix', isZh ? '为您列阵' : 'SHOWING')} <span className="font-black text-[13px] mx-2 text-[#D4AF37] leading-none">{filteredProducts.length}</span> {c('filter.resultsSuffix', isZh ? '辆符合指标的实车' : 'MACHINES FOUND')}
              </div>
              <div className="flex items-center gap-2 h-6 leading-none shrink-0">
                 <span className="text-[13px] font-bold uppercase tracking-[0.04em] text-gray-500">{c('filter.sortLabel', isZh ? '排序:' : 'SORT:')}</span>
                 <select
                   value={sortOption}
                   onChange={e => setSortOption(e.target.value)}
                   className="bg-transparent border-0 font-bold text-[13px] uppercase tracking-[0.04em] text-[#111111] focus:outline-none cursor-pointer pr-4 appearance-none leading-none"
                 >
                  <option value="newest">{c('filter.sortNewest', isZh ? '年份最新' : 'Newest First')}</option>
                  <option value="hours">{c('filter.sortHours', isZh ? '工时最低' : 'Lowest Hours')}</option>
                  <option value="brand">{c('filter.sortBrand', isZh ? '厂牌 (A-Z)' : 'Brand (A-Z)')}</option>
                 </select>
                 <ChevronDown size={14} className="text-[#111111] pointer-events-none relative -translate-x-3" />
              </div>
           </div>

           {/* Cards Grid */}
           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {loading ? (
                <div className="col-span-full rounded border border-gray-200 bg-white px-6 py-10 text-sm text-gray-500">
                 {c('filter.loadingText', isZh ? '正在加载产品数据...' : 'Loading products...')}
                </div>
              ) : currentProducts.length === 0 ? (
                <div className="col-span-full rounded border border-gray-200 bg-white px-6 py-16 text-center text-[#111111] font-bold text-[15px]">
                  {c('filter.emptyText', isZh ? '暂无符合条件的产品，请尝试其他筛选项' : 'No products found. Try different filters.')}
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
                     
                     {/* B2B 核心指标盾牌 */}
                     <div className="absolute top-3 left-3 bg-[#111111] text-white px-2.5 py-1 font-black text-[12px] tracking-[0.12em] uppercase flex items-center rounded-md shadow-md">
                       {product.year}
                     </div>
                     <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 border border-white rounded-md flex items-center gap-2 shadow-md">
                       <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse"></span>
                      <span className="text-[#111111] font-bold text-[10px] tracking-[0.12em] uppercase">{c('card.statusLabel', isZh ? '现货状态' : 'Available')}</span>
                     </div>
                   </div>

                   {/* 详单文案区 */}
                   <div className="p-5 flex-1 flex flex-col relative z-20 bg-white">
                      
                      <div className="flex items-center justify-between mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">
                        <span>{product.brand}</span>
                        <span className="text-gray-400">{product.category}</span>
                      </div>
                      
                      <h2 className="text-[34px] font-black text-[#C8A12A] leading-none mb-4 group-hover:text-[#B8921E] transition-colors">{product.title}</h2>
                      
                      {/* 冷峻参数栅格 (Specs Grid) - 极简排版对齐 */}
                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <div className="flex flex-col rounded-lg bg-[#F7F7F8] px-3 py-2.5">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.12em] mb-1">{c('card.hoursLabel', isZh ? '工时' : 'Hours')}</span>
                           <span className="text-xs font-black text-[#111111]">{product.hours}</span>
                        </div>
                        <div className="flex flex-col rounded-lg bg-[#F7F7F8] px-3 py-2.5">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.12em] mb-1">{c('card.weightLabel', isZh ? '自重' : 'Weight')}</span>
                           <span className="text-xs font-black text-[#111111]">{product.weight}</span>
                        </div>
                        <div className="flex flex-col rounded-lg bg-[#F7F7F8] px-3 py-2.5">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.12em] mb-1">{c('card.engineLabel', isZh ? '动力' : 'Engine')}</span>
                           <span className="text-xs font-black text-[#111111]">{product.engine}</span>
                        </div>
                        <div className="flex flex-col rounded-lg bg-[#F7F7F8] px-3 py-2.5">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.12em] mb-1">{c('card.locationLabel', isZh ? '定位' : 'LOC')}</span>
                           <span className="text-xs font-black text-[#111111] truncate">{product.location}</span>
                        </div>
                      </div>

                   </div>

                   {/* 稳定常显 CTA，避免悬浮突兀 */}
                   <Link href={`/products/${product.slug}`} className="w-full bg-[#111111] text-white flex items-center justify-center gap-2 py-4 font-bold text-xs uppercase tracking-[0.2em] transition-colors duration-200 hover:bg-black">
                    {c('card.viewDetailsBtn', isZh ? '查阅详尽机况' : 'VIEW DETAILS')} <ArrowUpRight size={16} className="text-[#D4AF37]" />
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
                  <ArrowRight className="rotate-180" size={20}/>
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      setCurrentPage(i + 1);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className={`w-12 h-12 flex items-center justify-center font-black text-lg transition-colors ${
                      currentPage === i + 1 
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
                  <ArrowRight size={20}/>
                </button>
             </div>
           )}

        </section>

      </div>
    </main>
  );
}

export default function ProductsPageClient({ initialContent }: PageContentProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA] pt-20">{'Fetching inventory data...'}</div>}>
      <ProductsContent initialContent={initialContent} />
    </Suspense>
  );
}
