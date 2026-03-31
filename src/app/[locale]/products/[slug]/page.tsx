'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { 
  ChevronRight, Play, 
  CheckCircle2, ShieldCheck, Ship,
  ArrowUpRight, Anchor, Target, Factory, ArrowRight
} from 'lucide-react';
import { useInquirySubmit } from "@/hooks/useInquirySubmit";
import { useCatalogProductDetail } from '@/hooks/useProductCatalog';
import { useLocale } from 'next-intl';

export default function ProductDetailPage() {
  const params = useParams<{ slug: string | string[] }>();
  const locale = useLocale();
  const isZh = locale === 'zh';
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug || '';
  const { product, relatedProducts, loading } = useCatalogProductDetail(slug);
  const [activeMedia, setActiveMedia] = useState<number>(0); 
  const { submitState, submitMessage, handleSubmit } = useInquirySubmit({
    source: "product-detail-cta",
  });

  const scrollToAnchor = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <main className="w-full bg-[#FAFAFA] min-h-screen pt-[100px] pb-20">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12">
          <div className="rounded-xl border border-black/[0.06] bg-white px-6 py-12 text-sm text-[#111111]/55">
            {isZh ? '正在加载产品详情...' : 'Loading product details...'}
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
            {isZh ? '未找到该产品，请返回列表查看其他设备。' : 'Product not found. Please go back to browse other machines.'}
          </div>
        </div>
      </main>
    );
  }

  const normalizedMediaIndex =
    activeMedia < 0
      ? -1
      : Math.min(activeMedia, Math.max(product.images.length - 1, 0));

  return (
    <main className="w-full bg-[#FAFAFA] min-h-screen pt-[80px] md:pt-[100px] pb-20">
      
      {/* 0. 顶部极简路径 / 面包屑导航 */}
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12 flex items-center justify-between mb-8">
        <nav className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400">
          <Link href="/" className="hover:text-[#111111] transition-colors">首页大盘</Link>
          <ChevronRight size={14} className="text-gray-300" />
          <Link href="/products" className="hover:text-[#111111] transition-colors">检索地图</Link>
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
                src={product.images[normalizedMediaIndex] || product.image || '/images/products/1.jpg'} 
                alt={product.title} 
                fill 
                unoptimized
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
                   <span className="absolute bottom-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">暂无产品视频</span>
                </div>
              )
            )}
            
            <div className="absolute top-4 left-4 bg-[#111111] text-white px-3 py-1.5 font-black text-xs tracking-widest uppercase flex items-center shadow-lg pointer-events-none z-20 rounded-xl">
              {product.year} 款
            </div>
            
            <div className="absolute top-4 right-4 pointer-events-none gap-3 items-center flex z-20">
              <span className="bg-white/90 backdrop-blur-sm px-3.5 py-1.5 flex items-center gap-2 border border-gray-200 shadow-sm rounded-xl">
                <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse"></span>
                <span className="text-[#111111] font-black text-[11px] tracking-widest leading-none pt-[1px]">
                  {isZh
                    ? `库存现车: ${product.stockAmount ?? '--'} 台`
                    : `IN STOCK: ${product.stockAmount ?? '--'}`}
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
                  <span className="text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.04em] whitespace-nowrap text-[#111111]">{isZh ? '第三方 SGS 检测' : 'SGS Verified'}</span>
                </div>
                <div className="flex items-center justify-start sm:justify-center gap-2 bg-white px-3 py-2.5 border border-gray-200 shadow-sm rounded-xl">
                  <ShieldCheck size={15} className="text-[#111111] shrink-0" />
                  <span className="text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.04em] whitespace-nowrap text-[#111111]">{isZh ? '100% 性能满载实测' : '100% Load Tested'}</span>
                </div>
                <div className="flex items-center justify-start sm:justify-center gap-2 bg-[#111111] px-3 py-2.5 text-white shadow-md rounded-xl">
                  <Ship size={15} className="text-[#D4AF37] shrink-0" />
                  <span className="text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.04em] whitespace-nowrap text-[#D4AF37]">{isZh ? '准现车滚装发运' : 'Ro-Ro Ready'}</span>
                </div>
              </div>
            </div>

            {/* 绝对对齐的核心参数框 - 充满剩余高度 (Fill remaining flex height) */}
            <div className="w-full flex-1 bg-white border border-gray-200 p-6 xl:p-8 shadow-sm flex flex-col overflow-hidden rounded-2xl">
              <div className="flex flex-col items-center mb-6 xl:mb-8 shrink-0">
                <h3 className="text-[12px] xl:text-[13px] font-black uppercase tracking-[0.3em] text-[#111111]">
                  {isZh ? '机皇核心指标' : 'Core Specifications'}
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
                  <Image src={product.images[0] || '/images/products/1.jpg'} alt="Video Thumbnail" fill unoptimized className="object-cover" />
                  
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
               onClick={() => scrollToAnchor('inquiry-cta')}
               className="w-full h-full bg-[#111111] text-white p-5 xl:p-6 border border-[#111111] relative overflow-hidden group flex items-center justify-between shadow-lg rounded-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-[#D4AF37] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out z-0"></div>
              
              <div className="relative z-10 flex flex-col items-start text-left">
                <span className="text-lg md:text-xl xl:text-2xl font-black mb-1 xl:mb-2 group-hover:text-black transition-colors">{isZh ? '获取私密底价与实车视频' : 'Get Private Quote & Videos'}</span>
                <span className="text-[11px] xl:text-[12px] font-bold tracking-widest text-gray-400 group-hover:text-black/70 transition-colors">{isZh ? '10 分钟内连线售前工程师' : 'Talk to Engineer in 10 mins'}</span>
              </div>
              <ArrowUpRight size={28} className="relative z-10 text-[#D4AF37] group-hover:text-black transition-colors" />
            </button>
          </div>
          
        </div>

      </section>

      {/* ======================= 版块 2：专业总成全宽参数墙 (Full-Width Tech Specs Wall) ======================= */}
      <section className="w-full bg-[#F5F5F7] border-y border-gray-200 py-16 lg:py-24 mb-24 lg:mb-32">
        <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 xl:px-12">
           
           <div className="bg-white rounded-3xl p-8 md:p-12 lg:p-16 xl:p-20 shadow-2xl shadow-gray-200/50 relative overflow-hidden">
             
             {/* 装饰水印背景 */}
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-gray-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

             {/* 表头 */}
             <div className="mb-12 border-b-2 border-[#111111] pb-6 flex items-end justify-between relative z-10">
               <div>
                 <h2 className="text-2xl md:text-3xl lg:text-[36px] font-black text-[#111111] tracking-tight mb-2">
                   {isZh ? '详尽技术规格档案' : 'Detailed Technical Specifications'}
                 </h2>
                 <p className="text-gray-400 text-xs md:text-sm tracking-[0.2em] uppercase font-bold">
                   {isZh ? '精确到毫米的严苛工况数据背书' : 'Precision engineering data backing'}
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
                 {isZh ? '尺寸、工时和容量等运行数据可能因测量方式及设备后续加装套件不同而存在细微误差或变动，此表仅作为原厂出厂标准核算参考。最终成交前，请与您的专属顾问连线并获取精准的实车视频或第三方（SGS）出具的实时核实报告。' : 'Dimensions, operating hours, and capacities may slightly vary due to continuous usage or aftermarket attachments. Please confirm with your dedicated advisor.'}
               </p>
             </div>

           </div>

        </div>
      </section>

      {/* ======================= 版块 3：硬核图文与场站实力 (Immersive Details & Factory) ======================= */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12 mb-24 lg:mb-32">
        <h2 className="text-sm font-black text-center uppercase tracking-[0.3em] text-gray-400 mb-12 flex items-center justify-center gap-4">
          <span className="w-12 h-px bg-gray-200"></span>
          KXTJ GLOBAL {isZh ? '交付实力保障' : 'DELIVERY EXCELLENCE'}
          <span className="w-12 h-px bg-gray-200"></span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
          
          {/* Card 1 */}
          <div className="group flex flex-col bg-white border border-gray-200 h-full rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 hover:border-transparent transition-all duration-500">
            <div className="w-full aspect-video bg-neutral-900 relative overflow-hidden">
               <Image src="/images/products/2.jpg" alt="Inspection" fill className="object-cover opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700" />
               <div className="absolute inset-0 flex items-center justify-center text-white/50 group-hover:scale-110 group-hover:text-[#D4AF37] transition-all duration-700 z-10">
                 <Target size={56} strokeWidth={1.5} />
               </div>
            </div>
            <div className="p-8 lg:p-10">
              <h3 className="text-lg font-black text-[#111111] mb-4 group-hover:text-[#D4AF37] transition-colors">{isZh ? '125 项底盘与液压深度检测' : '125-Point Hydraulic & Chassis Inspection'}</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
                {isZh ? '从冷机启动烟色、到液压大泵主阀的滴漏渗油排查，我们的场内工程师会对该设备出具近乎苛刻的验机报告。您将看到未经任何滤镜处理的高清细节。' : 'From cold-start smoke analysis to main pump leak detection, our engineers provide an uncompromising report. You will see raw, unfiltered high-definition footage.'}
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group flex flex-col bg-white border border-gray-200 h-full rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 hover:border-transparent transition-all duration-500">
            <div className="w-full aspect-video bg-neutral-900 relative overflow-hidden">
               <Image src="/images/products/4.jpg" alt="Warehouse" fill className="object-cover opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700" />
               <div className="absolute inset-0 flex items-center justify-center text-white/50 group-hover:scale-110 group-hover:text-[#D4AF37] transition-all duration-700 z-10">
                 <Factory size={56} strokeWidth={1.5} />
               </div>
            </div>
            <div className="p-8 lg:p-10">
              <h3 className="text-lg font-black text-[#111111] mb-4 group-hover:text-[#D4AF37] transition-colors">{isZh ? '3000+ 台场地现车集结结网' : '3,000+ Units Ready in Storage'}</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
                {isZh ? '上海综保区直发。我们不是“空手套白狼”的中介机构，每一台设备均在我们的全硬化地坪仓库中真实趴放，接受您的视频连线抽检或第三方登船验收。' : 'Shipped directly from Shanghai Bonded Zone. Every machine is physically sitting in our hardened yards, ready for your real-time video inspection or third-party (SGS) boarding verification.'}
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group flex flex-col bg-white border border-gray-200 h-full rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 hover:border-transparent transition-all duration-500">
            <div className="w-full aspect-video bg-neutral-900 relative overflow-hidden">
               <Image src="/images/products/5.jpg" alt="Shipping" fill className="object-cover opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700" />
               <div className="absolute inset-0 flex items-center justify-center text-white/50 group-hover:scale-110 group-hover:text-[#D4AF37] transition-all duration-700 z-10">
                 <Anchor size={56} strokeWidth={1.5} />
               </div>
            </div>
            <div className="p-8 lg:p-10">
              <h3 className="text-lg font-black text-[#111111] mb-4 group-hover:text-[#D4AF37] transition-colors">{isZh ? 'Ro-Ro 与 Flat Rack 深海装调' : 'Ro-Ro & Flat Rack Deep-Sea Rigging'}</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
                {isZh ? '针对 20 吨及以上的重型怪兽，我们具有长达十余年的特种集装箱绑扎与滚装船订舱护航经验。确保您的钢铁资产横跨经纬线，安全登陆母港。' : 'For 20-ton+ heavy monsters, we have over a decade of experience in special container lashing and Ro-Ro vessel booking. Ensuring your steel assets land safely across the oceans.'}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ======================= 版块 4：压盖级横向全宽黑底金线大表单 (Transverse CTA Form) ======================= */}
      <section id="inquiry-cta" className="w-full max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12 mb-24 lg:mb-32 scroll-mt-32">
        <div className="w-full bg-[#111111] text-white p-8 md:p-12 lg:p-16 xl:p-20 shadow-2xl relative overflow-hidden group flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 rounded-3xl">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37] transform origin-left scale-x-50 group-hover:scale-x-100 transition-transform duration-700 ease-out"></div>
          
          <div className="lg:w-[45%] xl:w-1/2">
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-black mb-6 tracking-tight leading-[1.15]">
              拿到这台怪兽的<br/>离岸真实底价
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium tracking-wide">
              请留下您的联系通道以及您的终局目的港。<br/>
              KXTJ 高阶售前工程师将在 10 分钟内向您直接对口发送 <span className="text-[#D4AF37]">4K机况实测长镜头</span> 与到港 CFR 最终清算清单。
            </p>
          </div>

          <div className="lg:w-[50%] xl:w-[45%] w-full">
            <form className="flex flex-col gap-6 w-full bg-white/5 p-8 border border-white/10 backdrop-blur-sm rounded-2xl" onSubmit={handleSubmit}>
              <input
                type="text"
                name="website"
                autoComplete="off"
                tabIndex={-1}
                className="hidden"
                aria-hidden="true"
              />
              <div className="flex flex-col relative group/input">
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3 group-focus-within/input:text-[#D4AF37] transition-colors">您的姓名或公司称呼</label>
                <input 
                  name="name"
                  required
                  type="text" 
                  placeholder="例如：Ahmed / ABC Construction" 
                  className="bg-transparent border-b border-gray-600 pb-3 text-white focus:outline-none focus:border-white transition-colors text-base placeholder:text-gray-500" 
                />
              </div>
              <div className="flex flex-col relative group/input mt-4">
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3 group-focus-within/input:text-[#D4AF37] transition-colors">全球极速通讯链路</label>
                <input 
                  name="contact"
                  required
                  type="text" 
                  placeholder="您的联系电话或邮箱" 
                  className="bg-transparent border-b border-gray-600 pb-3 text-white focus:outline-none focus:border-white transition-colors text-base placeholder:text-gray-500" 
                />
              </div>
              <div className="flex flex-col relative group/input mt-4">
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3 group-focus-within/input:text-[#D4AF37] transition-colors">具体需求描述</label>
                <textarea
                  name="message"
                  required
                  rows={3}
                  placeholder="请写明型号需求、预算范围、目的港等关键信息"
                  className="bg-transparent border-b border-gray-600 pb-3 text-white focus:outline-none focus:border-white transition-colors text-base placeholder:text-gray-500 resize-none"
                />
              </div>
              {submitMessage ? (
                <p className={`text-xs font-medium ${submitState === "success" ? "text-green-400" : "text-red-400"}`}>
                  {submitMessage}
                </p>
              ) : null}
              
              <button 
                type="submit"
                disabled={submitState === "loading"}
                className="mt-6 w-full bg-[#D4AF37] text-black font-black uppercase tracking-[0.15em] text-xs py-5 hover:bg-white transition-colors flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl"
              >
                {submitState === "loading" ? "提交中..." : "解锁验车绝密档案录"} <ArrowUpRight size={18} />
              </button>
            </form>
          </div>
          
        </div>
      </section>

      {/* ======================= 版块 5：同级段霸主推荐 (Related Products Array) ======================= */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12">
        <h3 className="text-xl md:text-2xl font-black text-[#111111] mb-10 tracking-tight flex items-center gap-4">
          如果您在犹豫，不妨看看同级猎手 <ArrowRight size={24} className="text-[#D4AF37]"/>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {relatedProducts.map(item => (
            <Link key={item.id} href={`/products/${item.slug}`} className="bg-white border border-gray-200 hover:border-[#111111] transition-colors group flex flex-col relative rounded-2xl overflow-hidden hover:shadow-xl">
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                 <Image src={item.image || '/images/products/1.jpg'} alt={item.title} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-[800ms] grayscale group-hover:grayscale-0" />
                 <div className="absolute top-4 left-4 bg-[#111111] text-white px-3 py-1 font-black text-[13px] tracking-widest uppercase rounded-lg">
                   {item.year}
                 </div>
              </div>
              <div className="p-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-2">{item.brand}</div>
                <h4 className="text-[15px] font-black text-[#111111] line-clamp-1 mb-4">{item.title}</h4>
                <div className="flex items-center justify-between text-xs font-black text-gray-500">
                  <span>{item.weight} 级</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{item.hours} 工时</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
