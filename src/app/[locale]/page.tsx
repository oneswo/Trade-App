"use client";
import React, { useState, useRef, useEffect, type ReactNode } from 'react';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, Settings, ShieldCheck, Globe, Wrench, Factory, PhoneCall, Send, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Link } from '@/i18n/routing';
import NumberTicker from '@/components/ui/number-ticker';
import AutoCarousel from '@/components/ui/auto-carousel';
import { useInquirySubmit } from '@/hooks/useInquirySubmit';
import { useLocale } from 'next-intl';
import { usePageContent } from '@/hooks/usePageContent';
import { useCategories } from '@/hooks/useCategories';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useCatalogProducts } from '@/hooks/useProductCatalog';

/* ── Scroll-reveal: IntersectionObserver 触发淡入 ── */
function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

function FadeUp({ children, delay = 0, duration = 800, className = '', style = {} }: {
  children: ReactNode; delay?: number; duration?: number; className?: string; style?: React.CSSProperties;
}) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// 交付卡片视频播放器组件
function DeliveryCard({ tag, date, location, title, videoUrl, posterUrl }: {
  tag: string; date: string; location: string; title: string;
  videoUrl?: string; posterUrl?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className="group cursor-pointer shrink-0 w-[82vw] sm:w-[420px] snap-center">
      <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden mb-6 border border-gray-200 bg-[#111111]">
        {videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              poster={posterUrl || undefined}
              muted={muted}
              loop
              playsInline
              className="w-full h-full object-cover"
              onEnded={() => setPlaying(false)}
            />
            {/* 播放/暂停遮罩 */}
            <div
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors"
            >
              {!playing && (
                <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <Play size={22} className="text-[#111111] fill-[#111111] ml-1" />
                </div>
              )}
            </div>
            {/* 静音切换 */}
            <button
              onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
              className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
            >
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </>
        ) : posterUrl ? (
          <Image src={posterUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
            <Play size={32} className="text-white/20" />
          </div>
        )}
        {/* 左下角标签 */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 text-[11px] font-black tracking-widest uppercase flex flex-col gap-1 shadow-lg border border-gray-100 pointer-events-none">
          <span className="text-[#D4AF37]">{tag}</span>
          {location && <span className="text-[#111111]">{location}</span>}
        </div>
      </div>
      <p className="text-gray-400 font-bold text-[10px] tracking-widest uppercase mb-3">{date}</p>
      <h4 className="text-[1.125rem] font-black leading-relaxed group-hover:text-gray-500 transition-colors text-[#111111]">{title}</h4>
    </div>
  );
}

export default function Home() {
  const locale = useLocale();
  const isZh = locale === 'zh';
  const { get: c, isLoaded: contentLoaded } = usePageContent('home');
  const { settings } = useSiteSettings();
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isFactoryVideoPlaying, setIsFactoryVideoPlaying] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const newsScrollRef = useRef<HTMLDivElement>(null);
  const { submitState, submitMessage, handleSubmit } = useInquirySubmit({
    source: "home-page-cta",
  });
  const { categories: catList, loading: catsLoading } = useCategories();
  const { products: catalogProducts, loading: productsLoading } = useCatalogProducts();

  // 从页面内容配置读取4张交付卡片数据
  const deliveryCards = [0, 1, 2, 3].map(i => ({
    tag: c(`delivery.${i}.tag`, ["SHIPMENT","DELIVERY","DISPATCH","UNBOXING"][i]),
    date: c(`delivery.${i}.date`, ["Oct 24, 2026","Oct 15, 2026","Oct 02, 2026","Sep 18, 2026"][i]),
    location: c(`delivery.${i}.location`, ["🇳🇬 Lagos, Nigeria","🇦🇪 Dubai, UAE","🇨🇱 Santiago, Chile","🇧🇷 São Paulo, Brazil"][i]),
    title: isZh
      ? c(`delivery.${i}.titleZh`, ["3 台 CAT 336 重型挖掘机翻新完毕，发往西非","沃尔沃三机组合验收完成，阿布扎比港口交割","首单南美洲！两台小松 D155 推土机完成安第斯清关","批量沃尔沃装载机抵达圣保罗，南美大区配送启动"][i])
      : c(`delivery.${i}.titleEn`, ["Three CAT 336 heavy excavators refurbished and shipped to West Africa.","Volvo three-unit assembly accepted and commissioned in Abu Dhabi port.","First South American order! Two Komatsu D155 dozers cleared customs for the Andes.","Batch of Volvo wheel loaders arrived in São Paulo for South American distribution."][i]),
    videoUrl: c(`delivery.${i}.videoUrl`, ""),
    posterUrl: c(`delivery.${i}.posterUrl`, ""),
  }));

  const scrollNews = (direction: 'left' | 'right') => {
    if (newsScrollRef.current) {
      newsScrollRef.current.scrollBy({ left: direction === 'left' ? -420 : 420, behavior: 'smooth' });
    }
  };

  const toggleHeroVideo = () => {
    if (heroVideoRef.current) {
      if (isPlayingVideo) {
        heroVideoRef.current.pause();
      } else {
        heroVideoRef.current.play();
      }
      setIsPlayingVideo(!isPlayingVideo);
    }
  };

  return (
    <main className="w-full flex-1">
      {/* =========================================
          Step 1: 黄金首屏 (Hero Pure Video) 
      ============================================= */}
      <section className="relative w-full h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-[#111111]">
        
        {/* 背景层：有视频时用 video，否则用纯图片 */}
        <div className="absolute inset-0 z-0">
          {(c('hero.videoUrl', '') || '') ? (
            <video
              ref={heroVideoRef}
              loop
              muted
              playsInline
              poster={c('hero.posterUrl', '') || '/hero.png'}
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            >
              <source src={c('hero.videoUrl', '')} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={c('hero.posterUrl', '') || '/hero.png'}
              alt="Hero"
              fill
              priority
              className="object-cover opacity-90"
            />
          )}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-90"></div>
        </div>

        {/* 永远不换行的内容区 — contentLoaded 后一次性触发 landing-animate */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 flex flex-col items-center text-center pt-20"
             style={{ visibility: contentLoaded ? 'visible' : 'hidden' }}>
          <div className={`inline-flex items-center gap-3 px-5 py-2.5 border border-white/20 backdrop-blur-md mb-8 ${contentLoaded ? 'landing-animate' : ''}`}
               style={{ animationDelay: '0ms' }}>
             <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
             <span className="text-white text-xs font-bold uppercase tracking-[0.2em]">{c('hero.tag', isZh ? '面向国际市场的高端二手工程机械' : 'PREMIUM USED HEAVY EQUIPMENT FOR GLOBAL MARKETS')}</span>
          </div>

          <h1 className={`hero-title-home ${isZh ? '' : 'tracking-tight'} relative min-h-[90px] ${contentLoaded ? 'landing-animate' : ''}`}
              style={{ animationDelay: '50ms' }}>
            <span className={isZh ? '' : 'block xl:inline leading-tight'}>{c('hero.title1', isZh ? '铸塑未来的' : 'Built to Power')}</span>
            {isZh ? ' ' : <span className="hidden xl:inline"> </span>}
            <span className={`text-transparent bg-clip-text bg-gradient-to-b from-[#D4AF37] via-[#F3E5AB] to-[#8C7322] drop-shadow-2xl ${isZh ? 'px-2' : 'block xl:inline px-2 xl:px-0 leading-tight'}`}>{c('hero.titleGold', isZh ? '重工力量' : "the World's Work")}</span>
            {isZh ? '' : <br className="hidden xl:block" />}
          </h1>
          <div className={`mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 ${contentLoaded ? 'landing-animate' : ''}`}
               style={{ animationDelay: '200ms' }}>
             <a href="#categories" className="w-full sm:w-[230px] h-[56px] rounded-full border border-transparent bg-[#D4AF37] text-white text-[14px] font-bold tracking-widest hover:bg-white hover:text-[#111111] transition-all duration-300 shadow-xl flex items-center justify-center gap-3 group">
               {c('hero.btn1', isZh ? '探索核心机械' : 'Browse Equipment')}
               <ArrowRight size={18} className="rotate-90 sm:rotate-0 group-hover:translate-x-1 transition-transform" />
             </a>
             {(c('hero.videoUrl', '') || '') && (
               <button
                  onClick={toggleHeroVideo}
                  className={`w-full sm:w-[230px] h-[56px] rounded-full border border-white/30 text-[14px] font-bold tracking-widest transition-all duration-500 backdrop-blur-md flex items-center justify-center gap-3 group shadow-xl ${isPlayingVideo ? 'bg-white text-[#111111]' : 'bg-black/40 text-white hover:bg-white hover:text-[#111111]'}`}
               >
                 {isPlayingVideo ? (
                   <>
                     <Pause size={18} className="text-current fill-current relative left-0.5" />
                     {c('hero.btn2', isZh ? '暂停实景视频' : 'Pause Video')}
                   </>
                 ) : (
                   <>
                     <Play size={18} className="text-current fill-current relative left-0.5" />
                     {c('hero.btn2', isZh ? '播放实景视频' : 'Play Video')}
                   </>
                 )}
               </button>
             )}
          </div>
        </div>
      </section>

      {/* =========================================
          Step 2: 极速匹配品类画廊 (Auto Carousel)
      ============================================= */}
      <section id="categories" className="w-full pt-28 pb-0 bg-white overflow-hidden relative">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <FadeUp className="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-12 gap-6 lg:gap-12">
            <div className={`lg:flex-1 ${isZh ? 'max-w-4xl' : 'max-w-md xl:max-w-lg'}`}>
              <h2 className={`font-black tracking-tighter text-[#111111] text-balance ${isZh ? 'text-5xl md:text-6xl' : 'text-4xl lg:text-[2.75rem] leading-tight'}`}>{c('categories.title', isZh ? '全矩阵设备覆盖' : 'Full-Spectrum Equipment Coverage')}</h2>
            </div>
            <div className="border-l-4 border-[#D4AF37] pl-6 hidden lg:block shrink-0 lg:w-[380px]">
              <p className="text-gray-500 text-sm leading-relaxed font-medium">{c('categories.desc', isZh ? '无论您的工程面临何种极端挑战，我们都能为您提供从强力挖掘、重型装载到路面打造的全场景、无死角的高端重装解决方案。' : 'Whatever your project demands, we deliver high-performance heavy equipment solutions across the full spectrum.')}</p>
            </div>
          </FadeUp>
        </div>
        
        {/* 品类画廊：loading 中显示骨架，加载完降级到真实数据或空状态 */}
        {catsLoading ? (
          <div className="flex gap-6 px-8 pb-16 overflow-hidden">
            {[0,1,2,3,4].map(i => (
              <div key={i} className="shrink-0 w-[260px] h-[340px] rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : catList.length > 0 ? (
          <AutoCarousel categories={catList.map((cat) => ({
            name: isZh ? cat.nameZh : cat.nameEn,
            type: cat.slug,
            img:  cat.imageUrl || '/hero.png',
          }))} />
        ) : (
          <div className="px-8 pb-16 text-center text-gray-400 text-sm py-20">
            {isZh ? '暂无分类，请在后台「分类管理」中添加' : 'No categories yet. Add them in the admin panel.'}
          </div>
        )}
      </section>

      {/* =========================================
          Step 3: 严选热销机械 (6-Grid Featured)
      ============================================= */}
      <section className="w-full py-16 md:py-32 bg-[#FAFAFA] border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <FadeUp className="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-16 gap-6 lg:gap-12">
            <div className={`lg:flex-1 ${isZh ? 'max-w-4xl' : 'max-w-md xl:max-w-lg'}`}>
              <h2 className={`font-black tracking-tighter text-[#111111] text-balance ${isZh ? 'text-5xl md:text-6xl' : 'text-4xl lg:text-[2.75rem] leading-tight'}`}>{c('hot.title', isZh ? '严选热销机皇' : 'Top-Rated Machines, Handpicked')}</h2>
            </div>
            <div className="border-l-4 border-[#D4AF37] pl-6 hidden lg:block shrink-0 lg:w-[380px]">
              <p className="text-gray-500 text-sm leading-relaxed font-medium">{c('hot.desc', isZh ? '全系通过100项核心排查。以更低故障率与极速回本周期，成为跨国基建抢单的绝对主力。' : 'Rigorously 100-point inspected. These high-ROI units offer peak performance and serve as the trusted backbone for infrastructure worldwide.')}</p>
            </div>
          </FadeUp>

          <FadeUp delay={150} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* loading 时显示骨架，加载完显示真实产品，无产品时提示 */}
            {productsLoading ? (
              Array.from({length: 6}).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                  <div className="w-full aspect-[4/3] bg-gray-100 animate-pulse" />
                  <div className="px-8 mt-6 pb-8 space-y-3">
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-24" />
                    <div className="h-6 bg-gray-100 rounded animate-pulse w-3/4" />
                  </div>
                </div>
              ))
            ) : catalogProducts.length > 0 ? catalogProducts.slice(0, 6).map((item, index) => (
              <Link href={item.slug ? `/products/${item.slug}` as `/${string}` : '/products'} key={index} className="group bg-white flex flex-col cursor-pointer hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden pb-8 border border-gray-200">
                <div className="relative w-full aspect-[4/3] bg-[#F5F5F5] rounded-t-2xl overflow-hidden">
                  <Image src={item.image || '/hero.png'} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                  <div className="absolute top-4 left-4 text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest shadow-lg z-10 bg-[#D4AF37]">
                    {isZh ? '现货就绪' : 'In Stock'}
                  </div>
                </div>
                <div className="px-8 mt-6">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
                    {item.brand}
                  </span>
                  <div className="flex items-center justify-between group-hover:text-[#D4AF37] transition-colors">
                    <h4 className="text-2xl font-black text-[#111111] leading-tight text-inherit">
                      {item.title}
                    </h4>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#111111] group-hover:text-white transition-all transform group-hover:translate-x-1 border border-gray-100">
                      <ArrowRight size={18} className="text-gray-400 group-hover:text-[#D4AF37] transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-3 text-center text-gray-400 text-sm py-20">
                {isZh ? '暂无在售产品，请在后台「产品列表」中添加' : 'No products yet. Add them in the admin panel.'}
              </div>
            )}
          </FadeUp>

          <FadeUp delay={300} className="mt-16 text-center">
            <Link href="/products" className="h-14 px-10 rounded-full bg-[#111111] text-white text-[13px] font-bold tracking-[0.2em] hover:bg-[#D4AF37] hover:text-white transition-all shadow-xl inline-flex items-center justify-center gap-3 group">
              {c('hot.btnText', isZh ? '游览所有 300+ 在线设备' : 'View All 300+ Listed Machines')}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* =========================================
          Step 4: 终极信任破冰 (Company & Stats) 
      ============================================= */}
      <section className="w-full bg-[#111111] text-white relative border-b border-gray-800">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* 左侧：实力宣告与动态数字 */}
          <FadeUp className="p-14 md:p-20 lg:p-24 flex flex-col justify-center relative z-10 border-r border-white/10">
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-8 drop-shadow-lg">
              {c('depth.title1', isZh ? '二十载深耕专注' : 'Two Decades of Expertise.')}<br/>{c('depth.title2', isZh ? '构筑起坚实底盘。' : 'A Foundation You Can Trust.')}
            </h2>
            <p className="text-gray-400 leading-relaxed max-w-sm mb-12 text-sm">
              {c('depth.desc', isZh ? '绝非单纯倒买。我们经营自有整备库，所有出海重卡均由资深工程师亲测排雷。绝不拼凑废铁，只输送能即刻下矿的巅峰运转力。' : 'More than a broker, we operate deep-inspection and refurbishment hubs. Every export unit is stress-tested by certified engineers. We deliver real heavy-duty power—not scrap iron.')}
            </p>
            
            {/* 合并：紧凑化的高能数据组 */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-10">
               <div>
                  <h4 className="text-3xl lg:text-4xl font-black mb-1 text-white"><NumberTicker value={parseInt(c('depth.stat.0.num', '3000')) || 3000} /><span className="text-[#D4AF37]">+</span></h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{c('depth.stat.0.label', isZh ? '全球成功交付设备' : 'Machines Delivered Globally')}</p>
               </div>
               <div>
                  <h4 className="text-3xl lg:text-4xl font-black mb-1 text-white"><NumberTicker value={parseInt(c('depth.stat.1.num', '50')) || 50} /><span className="text-[#D4AF37]">+</span></h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{c('depth.stat.1.label', isZh ? '无缝海运覆盖国家' : 'Countries Served by Sea')}</p>
               </div>
               <div>
                  <h4 className="text-3xl lg:text-4xl font-black mb-1 text-white"><NumberTicker value={parseInt(c('depth.stat.2.num', '2000')) || 2000} /><span className="text-[#D4AF37]">+</span></h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{c('depth.stat.2.label', isZh ? '平米超级仓储展区' : 'm² Warehousing & Prep Yard')}</p>
               </div>
               <div>
                  <h4 className="text-3xl lg:text-4xl font-black mb-1 text-white"><NumberTicker value={parseInt(c('depth.stat.3.num', '100')) || 100} /><span className="text-[#D4AF37]">%</span></h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{c('depth.stat.3.label', isZh ? '全节点拆机复检率' : 'Full-Teardown Inspection Rate')}</p>
               </div>
            </div>
          </FadeUp>

          {/* 右侧：回到极致规整的 5:5 画报与播放器切换区域 */}
          <div className="relative min-h-[400px] lg:min-h-full flex items-center justify-center group overflow-hidden bg-black">
            {isFactoryVideoPlaying ? (
              <video autoPlay controls className="absolute inset-0 w-full h-full object-cover z-20 animate-in fade-in duration-1000">
                <source src={c('depth.videoUrl', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4')} type="video/mp4" />
              </video>
            ) : (
              <>
                 <Image src={c('depth.posterUrl', '/hero.png')} alt="KXTJ Global Factory Base" fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" />
                 {/* 超酷的左侧黑色渐变滤镜，让两色完美融合 */}
                 <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-transparent to-transparent z-0"></div>
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 z-10"></div>
                 
                 {/* 居中悬浮的播放按钮，直接触发同比例原位播放 */}
                 <button onClick={() => setIsFactoryVideoPlaying(true)} className="relative z-20 w-24 h-24 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center hover:scale-110 transition-all duration-300 group/play shadow-2xl">
                   <div className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-30"></div>
                   <Play size={32} className="text-white ml-2 group-hover/play:text-[#D4AF37] transition-colors" />
                 </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* =========================================
          Step 5: 打消出海痛点 (Core Services)
      ============================================= */}
      <section className="w-full py-16 md:py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <FadeUp className="text-center mb-24">
            <h2 className="text-5xl font-black tracking-tighter text-[#111111] mb-4">{c('s5.title', isZh ? '世界级的交付与服务标准' : 'World-Class Delivery & Service')}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{c('s5.desc', isZh ? '在跨国重装采购中，物流与售后往往是最大的阻碍。我们将为您彻底铲除这些摩擦力，提供真正的端到端出海服务体系。' : 'In cross-border heavy equipment procurement, logistics and after-sales support are often the greatest barriers. We eliminate that friction entirely, delivering a true end-to-end export service.')}</p>
          </FadeUp>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[
              { icon: ShieldCheck, title: c('s5.card.0.title', isZh ? "无死角动点实测" : "Certified Operational Status"), desc: c('s5.card.0.desc', isZh ? "深测发动机、液压主泵与回转马达等逾百处关键中枢。拒绝只看表面，订船前为您出具最原生的干活重载实录视频。" : "We verify the engine, main pump, and hydraulics under real stress. We provide unedited, full-load operational footage prior to shipment to guarantee zero unpleasant surprises.") },
              { icon: Factory, title: c('s5.card.1.title', isZh ? "去油漆底薪级整备" : "Core Refurbishment & Paint"), desc: c('s5.card.1.desc', isZh ? "拒绝仅掩盖浮锈的“表面遮瑕喷漆法”。我们主动剔除底盘疲劳件与隐蔽处隐患，全车重喷，让二手机重回原厂巅峰态。" : "No cosmetic cover-ups here. We proactively replace internally fatigued parts and restore the physical body using OEM-standard coating, making a used machine look and run like new.") },
              { icon: Wrench, title: c('s5.card.2.title', isZh ? "易损备件海运大礼包" : "Critical Spares Included"), desc: c('s5.card.2.desc', isZh ? "二手设备下矿最怕停工等小配件。出海发柜即直接带足全车必须的滤芯、皮带大礼包，从源头切断海外耗材断绝危机。" : "Used machines need vital maintenance. We pack free core wear parts (filters, belts, seals) intimately with your shipment, saving you from disastrous downtime at remote sites.") },
              { icon: Settings, title: c('s5.card.3.title', isZh ? "恶劣工况特调防护" : "Harsh Environment Preps"), desc: c('s5.card.3.desc', isZh ? "海外极端特种矿区极度挑剔老设备底子。我们会主动为发往非洲高热区、南美高湿区的整机加厚管线、装甲与强制散热。" : "Mining abroad tests used equipment limits. We pre-modify cooling pipelines and reinforce undercarriages specifically combatting Africa's blazing heat or South America's humidity.") },
              { icon: PhoneCall, title: c('s5.card.4.title', isZh ? "跨洋连线技术问诊" : "Remote Diagnostic Support"), desc: c('s5.card.4.desc', isZh ? "海外工地找不到正规挖掘机修理工？我们的双语大拿随时响应您的 WhatsApp 视频，手把手看图纸带您老外排解疑难杂症。" : "No authorized dealers nearby? Our bilingual engineers provide 24/7 video guidance via WhatsApp, walking your local mechanics directly through any complex repair breakdowns.") },
              { icon: Globe, title: c('s5.card.5.title', isZh ? "全包免虑门到港运输" : "Streamlined Export Logistics"), desc: c('s5.card.5.desc', isZh ? "全权包办拆机塞框架箱、重金抢锁特种滚装舱位及报关批文。海外买手只需在目的港安全坐等，无须操心半点复杂手续。" : "We completely handle Flat Rack structural loading, RO-RO booking, and all export permits. You just comfortably wait at the destination port bypassing all complex cross-border documentation.") }
            ].map((feature, i) => (
              <FadeUp key={i} delay={i * 100} className="flex flex-col items-center text-center p-8 bg-gray-50 border border-gray-100 rounded-3xl hover:border-black transition-colors duration-500 shadow-sm hover:shadow-xl group">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-[#111111] transition-all duration-500">
                  <feature.icon strokeWidth={1.5} size={32} className="text-[#111111] group-hover:text-[#D4AF37] transition-colors" />
                </div>
                <h5 className="text-xl font-black text-[#111111] mb-4">{feature.title}</h5>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </FadeUp>
            ))}
          </div>
          
          <div className="text-center">
             <Link href="/services" className="h-16 px-12 rounded-full bg-[#111111] text-white text-[13px] font-bold tracking-[0.2em] hover:bg-[#D4AF37] hover:text-black transition-all shadow-xl inline-flex items-center gap-4">
                 {c('s5.btnText', isZh ? '探索完整增值出海体系' : 'Explore Full Export Services')}
                 <ArrowRight size={16} />
             </Link>
          </div>
        </div>
      </section>

      {/* =========================================
          Step 6: 最新出海动态瀑布流 (Latest Delivery) 🌟NEW🌟
      ============================================= */}
      <section className="w-full py-16 md:py-32 bg-[#FAFAFA] border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <FadeUp className="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-16 gap-6 lg:gap-12">
            <div className={`lg:flex-1 ${isZh ? 'max-w-4xl' : 'max-w-[360px] md:max-w-md xl:max-w-lg'}`}>
              <h2 className={`font-black tracking-tighter text-[#111111] text-balance ${isZh ? 'text-5xl md:text-6xl' : 'text-4xl lg:text-[2.75rem] leading-tight'}`}>{c('news.title', isZh ? '交机实录与动态' : 'Live Delivery Updates')}</h2>
            </div>
            <div className="border-l-4 border-[#D4AF37] pl-6 hidden lg:block shrink-0 lg:w-[380px]">
              <p className="text-gray-500 text-sm leading-relaxed font-medium">{c('news.desc', isZh ? '从实景发车到跨洋拆箱。实时共享一线的发运视频与物流动态，让透明高效的硬核实力亲见于天下。' : 'Experience our end-to-end delivery capability. Watch live dispatch footage and international shipping updates directly from port to site.')}</p>
            </div>
          </FadeUp>
          
          <div className="relative w-full group/news">
            <div ref={newsScrollRef} className="flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {deliveryCards.map((card, i) => (
                <DeliveryCard key={i} {...card} />
              ))}
            </div>
            
            {/* 左右精准拨动的按钮控件 */}
            <div className="flex items-center justify-center gap-6 mt-4 md:mt-12">
               <button onClick={() => scrollNews('left')} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-[#111111] bg-white hover:bg-black hover:text-white transition-all shadow-sm hover:shadow-lg hover:-translate-x-1">
                 <ArrowLeft size={18}/>
               </button>
               <button onClick={() => scrollNews('right')} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-[#111111] bg-white hover:bg-black hover:text-white transition-all shadow-sm hover:shadow-lg hover:translate-x-1">
                 <ArrowRight size={18}/>
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          Step 7: 终极收网联络池 (Rapid Inquiry)
      ============================================= */}
      <section className="relative w-full py-10 lg:py-16 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[#FAFAFA] h-1/2"></div>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10">
          <FadeUp className="bg-[#111111] p-10 md:p-16 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2rem] md:rounded-[3rem]">
            <div>
               <h2 className="text-3xl md:text-4xl xl:text-5xl font-black text-white mb-6 leading-tight whitespace-nowrap overflow-hidden">
                 {c('cta.title1', isZh ? '未找到心仪的' : "Can't Find the")} <span className="text-[#D4AF37]">{c('cta.titleGold', isZh ? '特定机型？' : 'Right Machine?')}</span>
               </h2>
               <p className="text-gray-400 mb-10 leading-relaxed max-w-md">{c('cta.desc', isZh ? '提供您的工况需求和采买预算，我们的海外专属采购代表将在 12 小时内为您在全球自有仓储网络中匹配最佳的替代品方案。' : 'Share your operating requirements and target budget, and our dedicated sourcing representative will identify the best-matched alternatives from our global inventory network within 12 hours.')}</p>
               <div className="flex flex-col sm:flex-row gap-8 pt-8 border-t border-gray-800">
                  <div className="flex gap-4">
                     <div className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center flex-shrink-0">
                        <PhoneCall size={20} className="text-[#D4AF37]" />
                     </div>
                     <div>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{isZh ? '专属直联' : 'Direct Contact'}</p>
                        <a href={`tel:${c('cta.phone', '+8617321077956').replace(/\s/g,'')}`} className="text-white font-bold tracking-wider hover:text-[#D4AF37] transition-colors block">{c('cta.phone', '+86 1732 107 7956')}</a>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center flex-shrink-0">
                        <Globe size={20} className="text-[#D4AF37]" />
                     </div>
                     <div>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{c('cta.hqLabel', isZh ? '总部寻址' : 'Headquarters')}</p>
                        <p className="text-white font-bold tracking-wider">{c('cta.hqAddr', isZh ? '中国上海市青浦区重型机械工业园 88 号' : 'No. 88 Heavy Machinery Park, Qingpu, Shanghai, China')}</p>
                     </div>
                  </div>
               </div>
             </div>
            
            <form className="space-y-6 bg-white p-8 md:p-12 shadow-2xl rounded-3xl" onSubmit={handleSubmit}>
               <input
                 type="text"
                 name="website"
                 autoComplete="off"
                 tabIndex={-1}
                 className="hidden"
                 aria-hidden="true"
               />
               <h3 className="text-2xl font-black text-[#111111] mb-8">{c('cta.formTitle', isZh ? '即刻获取定制报价' : 'Get Your Custom Quote Now')}</h3>
               <div className="grid grid-cols-1 gap-6">
                 {/* 精简为最高转化的纯正 3 字段收网节点 */}
                 <div className="border-b border-gray-300 focus-within:border-[#111111] transition-colors group">
                   <input name="name" required type="text" placeholder={isZh ? '您的称呼 *' : 'Your Name *'} className="w-full py-3 text-sm focus:outline-none bg-transparent font-medium group-focus-within:placeholder:text-gray-400" />
                 </div>
                 <div className="border-b border-gray-300 focus-within:border-[#111111] transition-colors group">
                   <input name="contact" required type="text" placeholder={isZh ? 'WhatsApp / 邮箱 *' : 'WhatsApp / Email *'} className="w-full py-3 text-sm focus:outline-none bg-transparent font-medium group-focus-within:placeholder:text-gray-400" />
                 </div>
                 <div className="border-b border-gray-300 focus-within:border-[#111111] transition-colors group pt-2">
                   <textarea name="message" required placeholder={c('cta.formPlaceholder', isZh ? '意向机械与特定工况需求 (必填)' : 'Machine of interest & specific operating requirements (required)')} rows={3} className="w-full py-3 text-sm focus:outline-none bg-transparent resize-none font-medium group-focus-within:placeholder:text-gray-400"></textarea>
                 </div>
               </div>
               {submitMessage ? (
                 <p className={`text-xs font-medium ${submitState === "success" ? "text-green-600" : "text-red-500"}`}>
                   {submitMessage}
                 </p>
               ) : null}
               <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                 <div className="flex items-center gap-3 shrink-0 lg:mr-4">
                     {settings?.contactWhatsApp && (
                        <a href={`https://wa.me/${settings.contactWhatsApp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full border border-gray-200 text-gray-400 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all duration-300 group" title="WhatsApp">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" className="group-hover:scale-110 transition-transform"><path d="M11.996 0a11.965 11.965 0 00-10.23 18.238L.044 24l6.012-1.632A11.968 11.968 0 1011.996 0zm6.657 17.244c-.266.75-1.523 1.455-2.107 1.517-.5.061-1.144.15-3.333-.762-2.646-1.096-4.35-3.805-4.48-4.004-.13-.198-1.071-1.423-1.071-2.716 0-1.291.674-1.924.912-2.19.239-.265.518-.33.69-.33.17 0 .343 0 .493.007.158.007.368-.06.574.4.215.474.721 1.777.786 1.909.066.133.111.288.026.467-.085.18-.129.294-.258.438-.13.14-.268.309-.387.433-.13.13-.264.276-.115.539.148.261.662 1.11 1.402 1.874.953.985 1.79 1.285 2.052 1.405.263.12.417.098.572-.078.155-.175.67-1.02.85-1.371.18-.35.358-.291.597-.197.24.093 1.517.714 1.776.843.256.13.43.193.493.302.062.108.062.631-.205 1.38z"/></svg>
                        </a>
                     )}
                     {settings?.socialLinkedin && (
                        <a href={settings.socialLinkedin} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full border border-gray-200 text-gray-400 hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-all duration-300 group" title="LinkedIn">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" className="group-hover:scale-110 transition-transform"><path d="M22.23 0H1.77C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.008zM7.12 20.452H3.558V9h3.562v11.452zm-1.78-13.02c-1.144 0-2.065-.925-2.065-2.064 0-1.139.92-2.064 2.065-2.064 1.14 0 2.064.925 2.064 2.064 0 1.139-.924 2.064-2.064 2.064zm15.11 13.02h-3.553v-5.569c0-1.328-.027-3.037-1.852-3.037-1.854 0-2.136 1.445-2.136 2.939v5.667H9.354V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z"/></svg>
                        </a>
                     )}
                     {settings?.socialFacebook && (
                        <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full border border-gray-200 text-gray-400 hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-300 group" title="Facebook">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" className="group-hover:scale-110 transition-transform"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                     )}
                 </div>
                 
                 <button
                   type="submit"
                   disabled={submitState === "loading"}
                   className="flex-1 w-full h-14 rounded-full bg-[#111111] text-white text-[13px] font-bold tracking-[0.2em] hover:bg-[#D4AF37] hover:text-black transition-colors flex items-center justify-center gap-3 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                 >
                   {submitState === "loading" ? (isZh ? '提交中...' : 'Submitting...') : c('cta.submitBtn', isZh ? '获取专属定制报价' : 'Get Custom Quote')} <Send size={16} />
                 </button>
               </div>
            </form>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
