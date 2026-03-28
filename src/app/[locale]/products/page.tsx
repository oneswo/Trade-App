'use client';
import { ChevronDown, Check, ArrowRight, X, SlidersHorizontal, ArrowUpRight, Search } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useState } from 'react';
import { useCatalogProducts } from '@/hooks/useProductCatalog';

const FILTERS = {
  brands: ['Caterpillar (CAT)', 'Komatsu', 'SANY', 'Hitachi', 'Volvo', 'Doosan'],
  categories: ['挖掘机 (Excavator)', '装载机 (Loader)', '推土机 (Dozer)', '压路机 (Roller)', '起重机 (Crane)'],
  years: ['2022及以上', '2018-2021', '2014-2017', '2013及以前'],
  weight: ['15吨以下 (微型)', '15-35吨 (中型)', '35吨以上 (重型)']
};

export default function ProductsPage() {
  const { products, loading } = useCatalogProducts();
  const [activeFilters, setActiveFilters] = useState<string[]>(['Caterpillar (CAT)', 'Komatsu', '挖掘机 (Excavator)']);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
      <section className="w-full bg-[#111111] text-center py-20 md:py-28 px-4 relative overflow-hidden flex flex-col justify-center items-center">
        {/* 微弱的科幻十字准星网格 */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
        
        <span className="relative z-10 text-[#D4AF37] text-[10px] md:text-xs font-black tracking-[0.4em] uppercase mb-4 block">KXTJ Global Database</span>
        <h1 className="relative z-10 text-4xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-none">
          全球现车<span className="text-gray-500">实盘底库.</span>
        </h1>
        
        <div className="relative z-10 flex items-center bg-white/10 backdrop-blur-md border border-white/20 p-2 w-full max-w-2xl mx-auto focus-within:bg-white/20 transition-colors">
          <Search className="text-gray-400 ml-4 mr-3" size={20} />
          <input 
            type="text" 
            placeholder="搜索型号，例如输入：CAT 320D" 
            className="flex-1 bg-transparent text-white font-medium placeholder:text-gray-500 focus:outline-none text-base py-3"
          />
          <button className="bg-[#D4AF37] text-black font-black uppercase text-xs tracking-widest px-8 py-3.5 hover:bg-white transition-colors">
            精确寻机
          </button>
        </div>

        <p className="relative z-10 text-gray-500 text-sm font-medium mt-8 tracking-widest uppercase flex items-center justify-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span> 
          982 台实况现车就绪 (100% Quality Assured)
        </p>
      </section>

      {/* 2. 页面工作台架构 (Workspace Layout) */}
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-12 flex flex-col lg:flex-row gap-12 items-start">
        
        {/* 移动端过滤器触发按钮 */}
        <div className="lg:hidden w-full flex justify-between items-center bg-white p-4 border border-gray-200">
           <span className="font-black text-[#111111] uppercase tracking-widest text-sm">筛选机械库</span>
           <button onClick={() => setIsMobileSidebarOpen(true)} className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-100 px-4 py-2 uppercase tracking-wide">
             <SlidersHorizontal size={14} /> 打开终端
           </button>
        </div>

        {/* ---------------- 左侧：高压迫感检索树 (Precision Sidebar Filters) ---------------- */}
        <aside className={`fixed inset-y-0 left-0 z-[200] lg:relative lg:z-auto w-[300px] lg:w-[280px] bg-[#FAFAFA] lg:bg-transparent h-full lg:h-auto overflow-y-auto lg:overflow-visible transition-transform transform ${isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'} shrink-0`}>
          
          <div className="lg:hidden p-6 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
            <span className="font-black text-lg">滤镜终端</span>
            <X size={20} className="cursor-pointer text-gray-500" onClick={() => setIsMobileSidebarOpen(false)} />
          </div>

          <div className="p-6 lg:p-0 space-y-10">
            
            {/* Reset */}
            <div className="flex items-center justify-between">
               <h3 className="font-black text-xs text-gray-400 tracking-[0.2em] uppercase border-l-2 border-[#111111] pl-3">属性筛选大盘</h3>
               <button className="text-xs font-bold text-gray-400 hover:text-[#D4AF37] transition-colors underline underline-offset-4">RESET</button>
            </div>

            {/* Filter Group: 品牌 */}
            <div>
              <h4 className="font-black text-sm text-[#111111] uppercase tracking-widest mb-4">核心厂牌 / Brands</h4>
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
              <h4 className="font-black text-sm text-[#111111] uppercase tracking-widest mb-4">器械类目 / Category</h4>
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
              <h4 className="font-black text-sm text-[#111111] uppercase tracking-widest mb-4">年份区间 / Year</h4>
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
               <button onClick={() => setIsMobileSidebarOpen(false)} className="w-full bg-[#111111] text-white font-bold uppercase tracking-widest py-4 text-xs">执行绝对检索</button>
            </div>

          </div>
        </aside>

        {/* ---------------- 右侧：硬装图鉴卡片阵列 (Equipment Matrix) ---------------- */}
        <section className="flex-1 w-full">
           
           {/* Utility Bar */}
           <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 pb-6 border-b border-gray-200">
              <div className="text-gray-500 font-bold uppercase tracking-widest text-[11px] md:text-xs">
                为您列阵 <span className="text-[#111111] text-lg mx-1">{products.length}</span> 辆符合指标的实车
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Sort By:</span>
                 <select className="bg-transparent border-0 font-black text-sm text-[#111111] uppercase tracking-wide focus:outline-none cursor-pointer pr-4 appearance-none">
                   <option>年份最新 (Newest)</option>
                   <option>工时最低 (Low Hours)</option>
                   <option>厂牌排序 (Brand A-Z)</option>
                 </select>
                 <ChevronDown size={14} className="text-gray-400 pointer-events-none relative -translate-x-3" />
              </div>
           </div>

           {/* Cards Grid */}
           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {loading ? (
                <div className="col-span-full rounded border border-gray-200 bg-white px-6 py-10 text-sm text-gray-500">
                  正在加载产品数据...
                </div>
              ) : products.map(product => (
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
                       <span className="text-[#111111] font-bold text-[10px] tracking-widest uppercase">Available</span>
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
                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">工时 / Hours</span>
                           <span className="text-xs font-black text-[#111111]">{product.hours}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">自重 / Weight</span>
                           <span className="text-xs font-black text-[#111111]">{product.weight}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">动力 / Engine</span>
                           <span className="text-xs font-black text-[#111111]">{product.engine}</span>
                        </div>
                        <div className="flex flex-col border-l border-gray-100 pl-2">
                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">定位 / LOC</span>
                           <span className="text-xs font-black text-[#111111] truncate">{product.location}</span>
                        </div>
                      </div>

                   </div>

                   {/* 绝对居底的隐形突刺按钮 (Hover CTA) */}
                   <Link href={`/products/${product.slug}`} className="absolute bottom-0 w-full bg-[#111111] text-white flex items-center justify-center gap-2 py-4 font-bold text-xs uppercase tracking-[0.2em] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-30">
                     查阅详尽机况 <ArrowUpRight size={16} className="text-[#D4AF37]" />
                   </Link>

                </div>
              ))}
           </div>
           
           {/* Pagination (冷酷大数位) */}
           <div className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-center gap-2">
              <button className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-[#111111] transition-colors"><ArrowRight className="rotate-180" size={20}/></button>
              <button className="w-12 h-12 flex items-center justify-center font-black text-lg bg-[#111111] text-white">1</button>
              <button className="w-12 h-12 flex items-center justify-center font-black text-lg text-gray-500 hover:text-[#111111] transition-colors">2</button>
              <button className="w-12 h-12 flex items-center justify-center font-black text-lg text-gray-500 hover:text-[#111111] transition-colors">3</button>
              <span className="text-gray-400 tracking-widest mx-2">...</span>
              <button className="w-12 h-12 flex items-center justify-center font-black text-lg text-gray-500 hover:text-[#111111] transition-colors">24</button>
              <button className="w-12 h-12 flex items-center justify-center text-[#111111] hover:text-[#D4AF37] transition-colors"><ArrowRight size={20}/></button>
           </div>

        </section>

      </div>
    </main>
  );
}
