'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { 
  ChevronRight, Share2, Printer, Play, 
  CheckCircle2, ShieldCheck, Ship,
  Download, ArrowUpRight, Anchor, Target, Factory, ArrowRight
} from 'lucide-react';
import { useInquirySubmit } from "@/hooks/useInquirySubmit";
import { useCatalogProductDetail } from '@/hooks/useProductCatalog';

export default function ProductDetailPage() {
  const params = useParams<{ slug: string | string[] }>();
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
            正在加载产品详情...
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
            未找到该产品，请返回列表查看其他设备。
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
        
        <div className="hidden md:flex items-center gap-6">
          <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#111111] transition-colors group">
            <Share2 size={16} className="group-hover:scale-110 transition-transform" /> 分享图鉴
          </button>
          <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#111111] transition-colors group">
            <Printer size={16} className="group-hover:scale-110 transition-transform" /> 打印验车单
          </button>
        </div>
      </div>

      {/* ======================= 版块 1：首屏二分栏极速验机 (The Hero Overview) ======================= */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12 flex flex-col lg:flex-row gap-10 xl:gap-16 items-stretch relative mb-24 lg:mb-32">
        
        {/* ---- 左侧：高清吸顶画廊 (Sticky Vision Gallery) ---- */}
        <div className="w-full lg:w-[55%] shrink-0 lg:sticky lg:top-[120px]">
          
          <div className="relative w-full aspect-[16/10] bg-gray-100 border border-gray-200 overflow-hidden mb-4 group cursor-crosshair shrink-0">
            {normalizedMediaIndex >= 0 ? (
              <Image 
                src={product.images[normalizedMediaIndex] || product.image || '/images/products/1.jpg'} 
                alt={product.title} 
                fill 
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
            
            <div className="absolute top-4 left-4 bg-[#111111] text-white px-3 py-1.5 font-black text-xs tracking-widest uppercase flex items-center shadow-lg pointer-events-none z-20">
              {product.year} 款
            </div>
            
            <div className="absolute top-4 right-4 pointer-events-none gap-3 items-center flex z-20">
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 flex items-center gap-2 border border-gray-200 shadow-sm">
                <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse"></span>
                <span className="text-[#111111] font-black text-[10px] uppercase tracking-widest">在库随时可看</span>
              </span>
            </div>
          </div>

          <div className="w-full flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] shrink-0 select-none">
            
            {product.videoUrl ? (
              <button 
                onClick={() => setActiveMedia(-1)}
                className={`relative min-w-[100px] md:min-w-[120px] aspect-[4/3] flex flex-col items-center justify-center bg-[#111111] text-white border transition-all shrink-0 ${normalizedMediaIndex === -1 ? 'border-[#D4AF37] shadow-[0_0_0_2px_rgba(212,175,55,0.4)]' : 'border-transparent hover:border-gray-500'}`}
              >
                <Play size={20} className="mb-2" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37]">实况视频</span>
              </button>
            ) : null}

            {product.images.map((img, index) => (
              <button 
                key={index}
                onClick={() => setActiveMedia(index)}
                className={`relative min-w-[100px] md:min-w-[120px] aspect-[4/3] border transition-all overflow-hidden shrink-0 ${normalizedMediaIndex === index ? 'border-[#D4AF37] shadow-[0_0_0_2px_rgba(212,175,55,0.4)]' : 'border-gray-200 hover:border-black'}`}
              >
                <Image src={img} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                <div className={`absolute inset-0 bg-black/40 transition-opacity ${normalizedMediaIndex === index ? 'opacity-0' : 'opacity-100 hover:opacity-0'}`}></div>
              </button>
            ))}
          </div>
          
        </div>

        {/* ---- 右侧：核心速览区 (Quick Summary) ---- */}
        <div className="flex-1 w-full flex flex-col justify-between h-full lg:pt-2 mt-8 lg:mt-0">
          
          <div className="w-full">
            <div className="mb-6"> 
              <h1 className="text-2xl md:text-3xl lg:text-[38px] xl:text-[42px] font-black text-[#111111] leading-[1.15] mb-5 tracking-tight">
                {product.title}
              </h1>
              
              {/* 三个标签放一排 */}
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
                <div className="flex shrink-0 items-center gap-1.5 bg-white px-2.5 py-1.5 border border-gray-200 shadow-sm">
                  <CheckCircle2 size={13} className="text-[#25D366]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]">第三方 SGS 检测</span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 bg-white px-2.5 py-1.5 border border-gray-200 shadow-sm">
                  <ShieldCheck size={13} className="text-[#111111]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]">100% 性能满载实测</span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 bg-[#111111] px-2.5 py-1.5 text-white shadow-md">
                  <Ship size={13} className="text-[#D4AF37]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">准现车滚装发运</span>
                </div>
              </div>
            </div>

            {/* 绝对对齐的核心参数 (Top 4 Params) */}
            <div className="w-full bg-white border border-gray-200 p-6 xl:p-8 mb-8 lg:mb-0 shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-5 flex items-center justify-between">
                <span>机皇核心指标</span>
              </h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-6">
                {product.coreSpecs.map((spec, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[9px] xl:text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{spec.label}</span>
                    <span className="text-sm xl:text-base font-black text-[#111111]">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 压迫感重力转化按钮 (Anchor CTA) */}
          <button 
             onClick={() => scrollToAnchor('inquiry-cta')}
             className="w-full bg-[#111111] text-white p-5 xl:p-6 border border-[#111111] relative overflow-hidden group flex items-center justify-between mt-6 lg:mt-0 shadow-lg"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[#D4AF37] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out z-0"></div>
            
            <div className="relative z-10 flex flex-col items-start text-left">
              <span className="text-lg md:text-xl xl:text-2xl font-black mb-1 group-hover:text-black transition-colors">获取私密底价与实车视频</span>
              <span className="text-[11px] xl:text-[12px] font-bold tracking-widest text-gray-400 group-hover:text-black/70 transition-colors">10 分钟内连线售前工程师</span>
            </div>
            <ArrowUpRight size={28} className="relative z-10 text-[#D4AF37] group-hover:text-black transition-colors" />
          </button>
          
        </div>

      </section>

      {/* ======================= 版块 2：专业总成全宽参数墙 (Full-Width Tech Specs Wall) ======================= */}
      <section className="w-full bg-[#F5F5F7] border-y border-gray-200 py-16 lg:py-24 mb-24 lg:mb-32">
        <div className="w-full max-w-[1000px] mx-auto px-4 md:px-8 xl:px-12">
           
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
             <h2 className="text-2xl md:text-3xl lg:text-[34px] font-black text-[#111111] tracking-tight">完整机械参数档案单</h2>
             <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#111111] hover:text-[#D4AF37] bg-white border border-gray-300 px-5 py-2.5 transition-colors shadow-sm shrink-0">
               <Download size={15} /> 下载 PDF 报告
             </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0">
             {product.detailedSpecs.map((spec, index) => (
               <div key={index} className="group flex items-center justify-between py-6 border-b border-gray-200 hover:border-[#111111] transition-colors">
                 <span className="text-[13px] md:text-[14px] font-bold text-gray-500 tracking-wider w-[45%]">{spec.label}</span>
                 <span className="text-[15px] md:text-[17px] font-black text-[#111111] w-[55%] text-right">{spec.value}</span>
               </div>
             ))}
           </div>
           
           <p className="mt-8 text-[12px] text-gray-400 tracking-widest font-medium leading-relaxed">
             * 尺寸和容量信息可能因测量方式存在细微误差，请与您的专属机械工程师连线获取精准核实。
           </p>

        </div>
      </section>

      {/* ======================= 版块 3：硬核图文与场站实力 (Immersive Details & Factory) ======================= */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12 mb-24 lg:mb-32">
        <h2 className="text-sm font-black text-center uppercase tracking-[0.3em] text-gray-400 mb-12 flex items-center justify-center gap-4">
          <span className="w-12 h-px bg-gray-200"></span>
          KXTJ GLOBAL 交付实力保障
          <span className="w-12 h-px bg-gray-200"></span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="flex flex-col bg-white border border-gray-200 h-full">
            <div className="w-full aspect-video bg-gray-100 relative overflow-hidden">
               {/* Note: In real app use actual factory images. Placeholder fallback below */}
               <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center text-white/50"><Target size={48}/></div>
            </div>
            <div className="p-8">
              <h3 className="text-base font-black text-[#111111] mb-3">125 项底盘与液压深度检测</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
                从冷机启动烟色、到液压大泵主阀的滴漏渗油排查，我们的场内工程师会对该设备出具近乎苛刻的验机报告。您将看到未经任何滤镜处理的高清细节。
              </p>
            </div>
          </div>

          <div className="flex flex-col bg-white border border-gray-200 h-full">
            <div className="w-full aspect-video bg-gray-100 relative overflow-hidden">
               <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center text-white/50"><Factory size={48}/></div>
            </div>
            <div className="p-8">
              <h3 className="text-base font-black text-[#111111] mb-3">3000+ 台场地现车集结结网</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
                上海综保区直发。我们不是“空手套白狼”的中介机构，每一台设备均在我们的全硬化地坪仓库中真实趴放，接受您的视频连线抽检或第三方登船验收。
              </p>
            </div>
          </div>

          <div className="flex flex-col bg-white border border-gray-200 h-full">
            <div className="w-full aspect-video bg-gray-100 relative overflow-hidden">
               <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center text-white/50"><Anchor size={48}/></div>
            </div>
            <div className="p-8">
              <h3 className="text-base font-black text-[#111111] mb-3">Ro-Ro 与 Flat Rack 深海装调</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
                针对 20 吨及以上的重型怪兽，我们具有长达十余年的特种集装箱绑扎与滚装船订舱护航经验。确保您的钢铁资产横跨经纬线，安全登陆母港。
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ======================= 版块 4：压盖级横向全宽黑底金线大表单 (Transverse CTA Form) ======================= */}
      <section id="inquiry-cta" className="w-full max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12 mb-24 lg:mb-32 scroll-mt-32">
        <div className="w-full bg-[#111111] text-white p-8 md:p-12 lg:p-16 xl:p-20 shadow-2xl relative overflow-hidden group flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
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
            <form className="flex flex-col gap-6 w-full bg-white/5 p-8 border border-white/10 backdrop-blur-sm" onSubmit={handleSubmit}>
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
                className="mt-6 w-full bg-[#D4AF37] text-black font-black uppercase tracking-[0.15em] text-xs py-5 hover:bg-white transition-colors flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
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
            <Link key={item.id} href={`/products/${item.slug}`} className="bg-white border border-gray-200 hover:border-[#111111] transition-colors group flex flex-col relative">
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                 <Image src={item.image || '/images/products/1.jpg'} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-[800ms] grayscale group-hover:grayscale-0" />
                 <div className="absolute top-3 left-3 bg-[#111111] text-white px-3 py-1 font-black text-[13px] tracking-widest uppercase">
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
