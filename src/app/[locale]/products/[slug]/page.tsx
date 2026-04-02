'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { 
  ChevronRight, Play, 
  CheckCircle2, ShieldCheck, Ship,
  ArrowUpRight
} from 'lucide-react';
import { useCatalogProductDetail } from '@/hooks/useProductCatalog';
import { openInquiryModal } from '@/lib/inquiries/modal';
import { usePageContent } from '@/hooks/usePageContent';
import { useLocale } from 'next-intl';

export default function ProductDetailPage() {
  const params = useParams<{ slug: string | string[] }>();
  const locale = useLocale();
  const isZh = locale === 'zh';
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug || '';
  const { product, loading } = useCatalogProductDetail(slug);
  const [activeMedia, setActiveMedia] = useState<number>(0); 
  const { get: cms } = usePageContent("product-detail");

  if (loading) {
    return (
      <main className="w-full bg-[#FAFAFA] min-h-screen pt-[100px] pb-20">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12">
          <div className="rounded-xl border border-black/[0.06] bg-white px-6 py-12 text-sm text-[#111111]/55">
            {isZh ? "正在加载产品详情..." : "Loading product details..."}
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="w-full bg-[#FAFAFA] min-h-screen pt-[100px] pb-20">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12">
          <div className="rounded-xl border border-black/[0.06] bg-white px-6 py-12 text-sm text-[#111111]/55">
            {isZh ? "未找到该产品，请返回列表查看其他设备。" : "Product not found. Please go back to browse other machines."}
          </div>
        </div>
      </main>
    );
  }

  const normalizedMediaIndex =
    activeMedia < 0
      ? -1
      : product.images.length === 0
        ? -1
        : Math.min(activeMedia, Math.max(product.images.length - 1, 0));

  return (
    <main className="w-full bg-[#FAFAFA] min-h-screen pt-[80px] md:pt-[100px] pb-20">
      
      {/* 0. 顶部极简路径 / 面包屑导航 */}
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12 flex items-center justify-between -mt-1 md:-mt-2 mb-6">
        <nav className="flex items-center gap-2 text-[11px] md:text-[13px] font-bold uppercase tracking-[0.18em] text-gray-400">
          <Link href="/" className="hover:text-[#111111] transition-colors">
            {cms("breadcrumb.home", isZh ? "首页" : "Home")}
          </Link>
          <ChevronRight size={14} className="text-gray-300" />
          <Link href="/products" className="hover:text-[#111111] transition-colors">
            {cms("breadcrumb.products", isZh ? "产品列表" : "Products")}
          </Link>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-gray-500">{product.category}</span>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-[#111111] max-w-[120px] sm:max-w-none truncate">{product.title}</span>
        </nav>
        

      </div>

      {/* ======================= 版块 1：首屏二分栏极速验机 (The Hero Overview) ======================= */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12 mb-24 lg:mb-32">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-y-4 lg:gap-y-6 gap-x-10 xl:gap-x-16 items-stretch">
          
          {/* ----- [1] 左上角 (TOP LEFT) / ROW 1：主图 ----- */}
          <div className="lg:col-span-7 order-1 relative w-full aspect-[16/10] bg-gray-100 border border-gray-200 overflow-hidden group cursor-crosshair rounded-2xl">
            {normalizedMediaIndex >= 0 ? (
              <Image
                src={product.images[normalizedMediaIndex]}
                alt={product.title}
                fill
                unoptimized
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out"
              />
            ) : (
              product.videoUrl ? (
                <video
                  src={product.videoUrl}
                  controls
                  className="h-full w-full object-cover bg-black"
                />
              ) : (
                <div className="w-full h-full bg-[#111111] flex flex-col items-center justify-center text-white relative">
                   <div className="w-20 h-20 border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center transition-colors z-10">
                     <Play size={32} className="text-white fill-white ml-2" />
                   </div>
                   <span className="absolute bottom-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                     {cms("gallery.noVideo", isZh ? "暂无产品视频" : "No product video")}
                   </span>
                </div>
              )
            )}
            
            <div className="absolute top-4 right-4 pointer-events-none gap-3 items-center flex z-20">
              <span className="bg-white/90 backdrop-blur-sm px-3.5 py-1.5 flex items-center gap-2 border border-gray-200 shadow-sm rounded-xl">
                <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse"></span>
                <span className="text-[#111111] font-black text-[11px] tracking-widest leading-none pt-[1px]">
                  {cms("gallery.stockLabel", isZh ? "现货数量" : "In Stock")}{" "}
                  {product.stockAmount ?? "--"}
                  {isZh ? " 台" : ""}
                </span>
              </span>
            </div>
          </div>

          {/* ----- [2] 右上角 (TOP RIGHT) / ROW 1：标题与核心参数 ----- */}
          <div className="lg:col-span-5 order-3 lg:order-2 flex flex-col h-full pt-8 lg:pt-1 pb-1">
            <div className="w-full mb-5 xl:mb-6">
              <h1 className="text-2xl md:text-3xl lg:text-[38px] xl:text-[42px] font-black text-[#111111] leading-[1.15] mb-5 tracking-tight">
                {product.title}
              </h1>
              
              {/* 三等分标签 — 移动端堆叠为2列 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full mt-2">
                <div className="flex items-center justify-start sm:justify-center gap-2 bg-white px-3 py-2.5 border border-gray-200 shadow-sm rounded-xl">
                  <CheckCircle2 size={15} className="text-[#25D366] shrink-0" />
                  <span className="text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.04em] whitespace-nowrap text-[#111111]">
                    {cms("badge.sgs", isZh ? "第三方 SGS 检测" : "SGS Verified")}
                  </span>
                </div>
                <div className="flex items-center justify-start sm:justify-center gap-2 bg-white px-3 py-2.5 border border-gray-200 shadow-sm rounded-xl">
                  <ShieldCheck size={15} className="text-[#111111] shrink-0" />
                  <span className="text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.04em] whitespace-nowrap text-[#111111]">
                    {cms("badge.loadTest", isZh ? "100% 性能满载实测" : "100% Load Tested")}
                  </span>
                </div>
                <div className="flex items-center justify-start sm:justify-center gap-2 bg-[#111111] px-3 py-2.5 text-white shadow-md rounded-xl">
                  <Ship size={15} className="text-[#D4AF37] shrink-0" />
                  <span className="text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.04em] whitespace-nowrap text-[#D4AF37]">
                    {cms("badge.roRo", isZh ? "准现车滚装发运" : "Ro-Ro Ready")}
                  </span>
                </div>
              </div>
            </div>

            {/* 绝对对齐的核心参数框 - 充满剩余高度 (Fill remaining flex height) */}
            <div className="w-full flex-1 bg-white border border-gray-200 p-6 xl:p-8 shadow-sm flex flex-col overflow-hidden rounded-2xl">
              <div className="flex flex-col items-center mb-6 xl:mb-8 shrink-0">
                <h3 className="text-[12px] xl:text-[13px] font-black uppercase tracking-[0.3em] text-[#111111]">
                  {cms("coreSpecs.title", isZh ? "机皇核心指标" : "Core Specifications")}
                </h3>
                <div className="w-8 h-1 bg-[#D4AF37] mt-3 rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-2 auto-rows-fr gap-3 xl:gap-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {product.coreSpecs.map((spec, i) => (
                  <div key={i} className="flex flex-col items-center justify-center bg-[#F8F8F9] rounded-xl p-3 text-center transition-colors hover:bg-gray-100">
                    <span className="text-[10px] xl:text-[11px] text-gray-400 font-bold uppercase tracking-[0.15em] mb-1.5 xl:mb-2">{spec.label}</span>
                    <span className="text-base sm:text-lg xl:text-[20px] font-black text-[#111111]">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ----- [3] 左下角 (BOTTOM LEFT) / ROW 2：缩略图矩阵 ----- */}
          <div className="lg:col-span-7 order-2 lg:order-3 w-full grid grid-cols-4 sm:grid-cols-5 gap-2 md:gap-3 shrink-0 select-none">
            {product.videoUrl ? (
              <button 
                onClick={() => setActiveMedia(-1)}
                className={`relative w-full aspect-square border-2 p-[2px] transition-all outline-none group overflow-hidden bg-white rounded-xl ${normalizedMediaIndex === -1 ? 'border-[#111111]' : 'border-transparent hover:border-gray-300'}`}
              >
                <div className="w-full h-full relative overflow-hidden bg-gray-100 rounded-[8px]">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt="Video Thumbnail"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#111111]" />
                  )}
                  
                  {/* 半透明遮罩与播放按钮 */}
                  <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center transition-colors group-hover:bg-black/40 z-10">
                    <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors shadow-lg">
                      <Play size={14} className="text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  
                  {/* Spotlight White Overlay for Unselected State */}
                  {normalizedMediaIndex !== -1 && <div className="absolute inset-0 bg-white/40 z-20 transition-opacity duration-300 group-hover:opacity-0"></div>}
                </div>
              </button>
            ) : null}

            {product.images.slice(0, product.videoUrl ? 4 : 5).map((img, index) => (
              <button 
                key={index}
                onClick={() => setActiveMedia(index)}
                className={`relative w-full aspect-square border-2 p-[2px] transition-all outline-none group rounded-xl ${normalizedMediaIndex === index ? 'border-[#111111]' : 'border-transparent hover:border-gray-300'}`}
              >
                <div className="w-full h-full relative overflow-hidden bg-gray-100 rounded-[8px]">
                  <Image src={img} alt={`Thumbnail ${index + 1}`} fill unoptimized className="object-cover" />
                  {normalizedMediaIndex !== index && <div className="absolute inset-0 bg-white/40 transition-opacity duration-300 group-hover:opacity-0"></div>}
                </div>
              </button>
            ))}
          </div>

          {/* ----- [4] 右下角 (BOTTOM RIGHT) / ROW 2：大号黑金转化按钮 ----- */}
          <div className="lg:col-span-5 order-4 flex items-stretch pt-2 lg:pt-0">
            <button 
               onClick={openInquiryModal}
               className="w-full h-full bg-[#111111] text-white p-5 xl:p-6 border border-[#111111] relative overflow-hidden group flex items-center justify-between shadow-lg rounded-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-[#D4AF37] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out z-0"></div>
              
              <div className="relative z-10 flex flex-col items-start text-left">
                <span className="text-lg md:text-xl xl:text-2xl font-black mb-1 xl:mb-2 group-hover:text-black transition-colors">
                  {cms("cta.title", isZh ? "获取私密底价与实车视频" : "Get Private Quote & Videos")}
                </span>
                <span className="text-[11px] xl:text-[12px] font-bold tracking-widest text-gray-400 group-hover:text-black/70 transition-colors">
                  {cms("cta.subtitle", isZh ? "10 分钟内连线售前工程师" : "Talk to Engineer in 10 mins")}
                </span>
              </div>
              <ArrowUpRight size={28} className="relative z-10 text-[#D4AF37] group-hover:text-black transition-colors" />
            </button>
          </div>
          
        </div>

      </section>

      {/* ======================= 版块 2：专业总成全宽参数墙 (Full-Width Tech Specs Wall) ======================= */}
      <section className="w-full bg-[#F5F5F7] border-y border-gray-200 py-16 lg:py-24">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12">
           
           <div className="bg-white rounded-3xl p-8 md:p-12 lg:p-16 xl:p-20 shadow-2xl shadow-gray-200/50 relative overflow-hidden">
             
             {/* 装饰水印背景 */}
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-gray-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

             {/* 表头 */}
             <div className="mb-12 border-b-2 border-[#111111] pb-6 flex items-end justify-between relative z-10">
               <div>
                 <h2 className="text-2xl md:text-3xl lg:text-[36px] font-black text-[#111111] tracking-tight mb-2">
                   {cms("techWall.title", isZh ? "详尽技术规格档案" : "Detailed Technical Specifications")}
                 </h2>
                 <p className="text-gray-400 text-xs md:text-sm tracking-[0.2em] uppercase font-bold">
                   {cms("techWall.subtitle", isZh ? "精确到毫米的严苛工况数据背书" : "Precision engineering data backing")}
                 </p>
               </div>
               <div className="hidden md:flex items-center justify-center w-16 h-16 bg-[#25D366]/10 rounded-2xl text-[#25D366]">
                 <ShieldCheck size={32} />
               </div>
             </div>
             
             {/* 参数阵列 (等分左右双列，严格左对齐中线) */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 xl:gap-x-24 gap-y-0 relative z-10">
               {product.detailedSpecs.map((spec, index) => (
                 <div key={index} className="flex flex-col sm:flex-row sm:items-center py-5 border-b border-dashed border-gray-200 hover:border-solid hover:border-[#111111] transition-all duration-300 group">
                   <span className="text-[12px] xl:text-[13px] font-bold text-gray-400 tracking-widest uppercase w-full sm:w-[45%] mb-1 sm:mb-0 group-hover:text-gray-600 transition-colors">
                     {spec.label}
                   </span>
                   <span className="text-[15px] xl:text-[17px] font-black text-[#111111] w-full sm:w-[55%] group-hover:translate-x-1 transition-transform duration-300">
                     {spec.value}
                   </span>
                 </div>
               ))}
             </div>
             
             <div className="mt-12 pt-6 flex items-start gap-3 relative z-10">
               <span className="text-[#D4AF37] mt-0.5">*</span>
               <p className="text-[12px] text-gray-400 tracking-widest font-medium leading-relaxed max-w-3xl">
                 {cms(
                   "techWall.disclaimer",
                   isZh
                     ? "尺寸、工时和容量等运行数据可能因测量方式及设备后续加装套件不同而存在细微误差或变动，此表仅作为原厂出厂标准核算参考。最终成交前，请与您的专属顾问连线并获取精准的实车视频或第三方（SGS）出具的实时核实报告。"
                     : "Dimensions, operating hours, and capacities may slightly vary due to continuous usage or aftermarket attachments. Please confirm with your dedicated advisor."
                 )}
               </p>
             </div>

           </div>

        </div>
      </section>

    </main>
  );
}
