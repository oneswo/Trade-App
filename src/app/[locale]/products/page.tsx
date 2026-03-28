'use client';
import { ChevronDown, Check, ArrowRight, X, SlidersHorizontal, ArrowUpRight, Search } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCatalogProducts } from '@/hooks/useProductCatalog';

import { useLocale } from 'next-intl';
import { usePageContent } from '@/hooks/usePageContent';

const FILTERS_ZH = {
  brands: ['卡特彼勒', '小松', '三一', '日立', '沃尔沃', '斗山'],
  categories: ['挖掘机', '装载机', '推土机', '压路机', '起重机'],
  years: ['2022及以上', '2018-2021', '2014-2017', '2013及以前'],
  weight: ['15吨以下', '15-35吨', '35吨以上']
};

const FILTERS_EN = {
  brands: ['Caterpillar', 'Komatsu', 'SANY', 'Hitachi', 'Volvo', 'Doosan'],
  categories: ['Excavators', 'Loaders', 'Dozers', 'Rollers', 'Cranes'],
  years: ['2022 & Newer', '2018-2021', '2014-2017', '2013 & Older'],
  weight: ['Compact (< 15t)', 'Mid (15-35t)', 'Heavy (> 35t)']
};

/* ────────────────────────────────────────────────────
 * 筛选标签 → 产品字段值 映射表
 * 解决 "卡特彼勒" (筛选标签) vs "卡特" (product.brand) 的不一致
 * ──────────────────────────────────────────────────── */
const BRAND_KEYWORDS: Record<string, string[]> = {
  '卡特彼勒': ['卡特', 'CAT', 'Caterpillar'],
  '小松': ['小松', 'Komatsu'],
  '三一': ['三一', 'SANY'],
  '日立': ['日立', 'Hitachi'],
  '沃尔沃': ['沃尔沃', 'Volvo'],
  '斗山': ['斗山', 'Doosan'],
  'Caterpillar': ['卡特', 'CAT', 'Caterpillar'],
  'Komatsu': ['小松', 'Komatsu'],
  'SANY': ['三一', 'SANY'],
  'Hitachi': ['日立', 'Hitachi'],
  'Volvo': ['沃尔沃', 'Volvo'],
  'Doosan': ['斗山', 'Doosan'],
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

function ProductsContent() {
  const locale = useLocale();
  const isZh = locale === 'zh';
  const { get: c } = usePageContent('products');
  const FILTERS = isZh ? FILTERS_ZH : FILTERS_EN;

  const { products, loading } = useCatalogProducts();
  const searchParams = useSearchParams();
  const initCategory = searchParams.get('category');
  
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  /* ── 核心数据流水线：筛选 → 排序 ── */
  const filteredProducts = useMemo(() => {
    const allBrands  = [...FILTERS_ZH.brands,     ...FILTERS_EN.brands];
    const allCats    = [...FILTERS_ZH.categories,  ...FILTERS_EN.categories];
    const allYears   = [...FILTERS_ZH.years,       ...FILTERS_EN.years];
    const allWeights = [...FILTERS_ZH.weight,       ...FILTERS_EN.weight];

    const selBrands  = activeFilters.filter(f => allBrands.includes(f));
    const selCats    = activeFilters.filter(f => allCats.includes(f));
    const selYears   = activeFilters.filter(f => allYears.includes(f));
    const selWeights = activeFilters.filter(f => allWeights.includes(f));

    let list = products;

    // 组内 OR，组间 AND
    if (selBrands.length > 0) {
      list = list.filter(p =>
        selBrands.some(bf => {
          const kws = BRAND_KEYWORDS[bf] || [bf];
          return kws.some(kw => p.brand.includes(kw) || kw.includes(p.brand));
        })
      );
    }
    if (selCats.length > 0) {
      list = list.filter(p =>
        selCats.some(cf => {
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
  }, [products, activeFilters, searchQuery, sortOption]);

  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // URL 参数初始化分类
  useEffect(() => {
    if (initCategory) {
       const matchedFilter = FILTERS.categories.find(c => c.toLowerCase().includes(initCategory.toLowerCase()));
       if (matchedFilter) {
          setActiveFilters([matchedFilter]);
       }
    }
    // 不设默认筛选，初始展示全部产品
  }, [initCategory, FILTERS]);

  // 筛选/搜索/排序变化时自动回到第 1 页
  useEffect(() => {
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
         <div className="absolute inset-0 opacity-60 bg-cover bg-center pointer-events-none scale-105 active:scale-100 transition-transform duration-[10s]" style={{ backgroundImage: `url('${c('hero.bgImage', '/images/hero/products.png')}')` }}></div>
         <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-[#111111]/10 pointer-events-none"></div>
         
         {/* 琥珀色微光 (Radiant Glow) */}
         <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D4AF37] opacity-[0.05] blur-[120px] rounded-full pointer-events-none"></div>
         <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#D4AF37] opacity-[0.03] blur-[150px] rounded-full pointer-events-none"></div>

         <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-[1100px] mx-auto text-center mt-4">
            
            {/* 顶部分类小提示，为了三页格式统一而保留相似体积的元素 */}
            <div className="flex items-center justify-center gap-3 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-8 border border-[#D4AF37]/20 rounded-full px-5 py-2 bg-[#D4AF37]/5 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span> 
              {isZh ? '982 台实况现车整装待发' : '982 MACHINES READY FOR SHIPMENT'}
            </div>

            <h1 className="hero-title">
              {isZh ? '全系现车，' : 'All in Stock, '}<span className="text-[#D4AF37]">{isZh ? '实盘底库。' : 'Real Inventory.'}</span>
            </h1>

            {/* 搜框替换原副标题 (Height Locked) */}
            <div className="w-full flex items-center justify-center min-h-[60px] md:min-h-[80px]">
              <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 p-2 w-full max-w-[700px] mx-auto focus-within:bg-white/20 focus-within:border-white/40 transition-all duration-300 shadow-2xl rounded-sm">
                <Search className="text-gray-400 ml-4 mr-3" size={20} />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={c('filter.searchPlaceholder', isZh ? "搜索型号，例如输入：CAT 320D" : "Search model, e.g. CAT 320D")}
                  className="flex-1 bg-transparent text-white font-medium placeholder:text-gray-500 tracking-wider focus:outline-none text-base py-3"
                />
                <button className="bg-[#D4AF37] text-black font-black uppercase text-xs tracking-widest px-8 md:px-10 py-3.5 hover:bg-white hover:text-black hover:shadow-[0_10px_20px_rgba(212,175,55,0.3)] transition-all">
                  {isZh ? '精确寻机' : 'SEARCH'}
                </button>
              </div>
            </div>

         </div>
      </section>

      {/* 2. 页面工作台架构 (Workspace Layout) */}
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-12 flex flex-col lg:flex-row gap-12 items-start">
        
        {/* 移动端过滤器触发按钮 */}
        <div className="lg:hidden w-full flex justify-between items-center bg-white p-4 border border-gray-200">
           <span className="font-black text-[#111111] uppercase tracking-widest text-sm">{isZh ? '筛选机械库' : 'FILTERS'}</span>
           <button onClick={() => setIsMobileSidebarOpen(true)} className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-100 px-4 py-2 uppercase tracking-wide">
             <SlidersHorizontal size={14} /> {isZh ? '打开终端' : 'OPEN TERMINAL'}
           </button>
        </div>

        {/* ---------------- 左侧：高压迫感检索树 (Precision Sidebar Filters) ---------------- */}
        <aside className={`fixed inset-y-0 left-0 z-[200] lg:relative lg:z-auto w-[300px] lg:w-[280px] bg-[#FAFAFA] lg:bg-transparent h-full lg:h-auto overflow-y-auto lg:overflow-visible transition-transform transform ${isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'} shrink-0`}>
          
          <div className="lg:hidden p-6 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
            <span className="font-black text-lg">{isZh ? '滤镜终端' : 'FILTERS TERMINAL'}</span>
            <X size={20} className="cursor-pointer text-gray-500" onClick={() => setIsMobileSidebarOpen(false)} />
          </div>

          <div className="p-6 lg:p-0 space-y-10">
            
            <div className="flex items-center justify-between w-full h-[40px] pb-3 border-b border-gray-200 box-border">
               <h3 className="font-bold text-[13px] text-[#111111] uppercase border-l-4 border-[#111111] pl-3 leading-none flex items-center">{isZh ? '属性筛选大盘' : 'FILTER TERMINAL'}</h3>
               <button 
                 onClick={() => setActiveFilters([])}
                 className="text-[13px] font-bold text-gray-500 hover:text-[#D4AF37] transition-colors leading-none"
               >
                 {isZh ? '重置参数' : 'RESET'}
               </button>
            </div>

            {/* Filter Group: 品牌 */}
            <div>
              <h4 className="font-black text-sm text-[#111111] uppercase tracking-widest mb-4">{isZh ? '核心厂牌' : 'BRANDS'}</h4>
              <ul className="space-y-3">
                {FILTERS.brands.map(brand => (
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

            {/* Filter Group: 品类 */}
            <div className="border-t border-gray-200 pt-8">
              <h4 className="font-black text-sm text-[#111111] uppercase tracking-widest mb-4">{isZh ? '器械类目' : 'CATEGORIES'}</h4>
              <ul className="space-y-3">
                {FILTERS.categories.map(cat => (
                  <li key={cat}>
                    <label
                      onClick={() => toggleFilter(cat)}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${activeFilters.includes(cat) ? 'bg-[#111111] border-[#111111]' : 'border-gray-300 bg-white group-hover:border-[#111111]'}`}>
                        {activeFilters.includes(cat) && <Check size={12} className="text-[#D4AF37]" strokeWidth={4} />}
                      </div>
                      <span className={`text-[13px] font-medium transition-colors ${activeFilters.includes(cat) ? 'text-[#111111] font-bold' : 'text-gray-600 group-hover:text-[#111111]'}`}>{cat}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filter Group: 年份 */}
            <div className="border-t border-gray-200 pt-8 flex-1">
              <h4 className="font-black text-sm text-[#111111] uppercase tracking-widest mb-4">{isZh ? '年份区间' : 'YEAR RANGE'}</h4>
              <ul className="space-y-3">
                {FILTERS.years.map(yr => (
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

            {/* Sticky Action on Mobile */}
            <div className="lg:hidden sticky bottom-0 left-0 w-full p-4 bg-white border-t border-gray-200 mt-8">
               <button onClick={() => setIsMobileSidebarOpen(false)} className="w-full bg-[#111111] text-white font-bold uppercase tracking-widest py-4 text-xs">{isZh ? '执行绝对检索' : 'EXECUTE SEARCH'}</button>
            </div>

          </div>
        </aside>

        {/* ---------------- 右侧：硬装图鉴卡片阵列 (Equipment Matrix) ---------------- */}
        <section className="flex-1 w-full">
           
           {/* Utility Bar */}
           <div className="w-full flex items-center justify-between mb-8 pb-3 h-[40px] border-b border-gray-200 box-border">
              <div className="text-[#111111] font-bold text-[13px] leading-none flex items-center truncate">
                {isZh ? '为您列阵' : 'SHOWING'} <span className="font-black text-lg mx-2 text-[#D4AF37] leading-none transform translate-y-[-1px]">{filteredProducts.length}</span> {isZh ? '辆符合指标的实车' : 'MACHINES FOUND'}
              </div>
              <div className="flex items-center gap-2 leading-none shrink-0">
                 <span className="text-[13px] font-bold text-gray-500 uppercase">{isZh ? '排序方式:' : 'SORT BY:'}</span>
                 <select 
                   value={sortOption}
                   onChange={e => setSortOption(e.target.value)}
                   className="bg-transparent border-0 font-bold text-[13px] text-[#111111] uppercase focus:outline-none cursor-pointer pr-4 appearance-none leading-none"
                 >
                   <option value="newest">{isZh ? '年份最新' : 'Newest First'}</option>
                   <option value="hours">{isZh ? '工时最低' : 'Lowest Hours'}</option>
                   <option value="brand">{isZh ? '厂牌 (A-Z)' : 'Brand (A-Z)'}</option>
                 </select>
                 <ChevronDown size={14} className="text-[#111111] pointer-events-none relative -translate-x-3" />
              </div>
           </div>

           {/* Cards Grid */}
           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {loading ? (
                <div className="col-span-full rounded border border-gray-200 bg-white px-6 py-10 text-sm text-gray-500">
                  {isZh ? '正在加载产品数据...' : 'Loading products...'}
                </div>
              ) : currentProducts.map(product => (
                <div key={product.id} className="bg-white border border-gray-200 hover:border-[#111111] transition-all duration-300 group flex flex-col relative rounded-sm group overflow-hidden">
                   
                   {/* 图像部分 */}
                   <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                     <Image src={product.image || '/images/products/1.jpg'} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-[800ms]" />
                     
                     {/* B2B 核心指标盾牌 */}
                     <div className="absolute top-3 left-3 bg-[#111111] text-white px-3 py-1 font-black text-[13px] tracking-widest uppercase flex items-center shadow-lg">
                       {product.year}
                     </div>
                     <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 border border-white flex items-center gap-2 shadow-lg">
                       <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse"></span>
                       <span className="text-[#111111] font-bold text-[10px] tracking-widest uppercase">{isZh ? '现货状态' : 'Available'}</span>
                     </div>
                   </div>

                   {/* 详单文案区 */}
                   <div className="p-6 flex-1 flex flex-col relative z-20 bg-white">
                      
                      <div className="flex items-center justify-between mb-3 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                        <span>{product.brand}</span>
                        <span className="text-gray-400">{product.category}</span>
                      </div>
                      
                      <h2 className="text-[17px] font-black text-[#111111] leading-tight mb-5 group-hover:text-[#D4AF37] transition-colors">{product.title}</h2>
                      
                      {/* 冷峻参数栅格 (Specs Grid) - 极简排版对齐 */}
                      <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-auto">
                        <div className="flex flex-col">
                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{isZh ? '工时' : 'Hours'}</span>
                           <span className="text-xs font-black text-[#111111]">{product.hours}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{isZh ? '自重' : 'Weight'}</span>
                           <span className="text-xs font-black text-[#111111]">{product.weight}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{isZh ? '动力' : 'Engine'}</span>
                           <span className="text-xs font-black text-[#111111]">{product.engine}</span>
                        </div>
                        <div className="flex flex-col border-l border-gray-100 pl-2">
                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{isZh ? '定位' : 'LOC'}</span>
                           <span className="text-xs font-black text-[#111111] truncate">{product.location}</span>
                        </div>
                      </div>

                   </div>

                   {/* 绝对居底的隐形突刺按钮 (Hover CTA) */}
                   <Link href={`/products/${product.slug}`} className="absolute bottom-0 w-full bg-[#111111] text-white flex items-center justify-center gap-2 py-4 font-bold text-xs uppercase tracking-[0.2em] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-30">
                     {isZh ? '查阅详尽机况' : 'VIEW DETAILS'} <ArrowUpRight size={16} className="text-[#D4AF37]" />
                   </Link>

                </div>
              ))}
           </div>
           
           {/* Pagination (真实分页功能) */}
           {totalPages > 1 && (
             <div className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-center gap-2">
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA] pt-20">{'Fetching inventory data...'}</div>}>
      <ProductsContent />
    </Suspense>
  );
}
