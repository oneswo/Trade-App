"use client";
import React, { useState, useRef, useEffect, type ReactNode } from 'react';
import { ArrowRight, ArrowLeft, Settings, ShieldCheck, Globe, Wrench, Factory, PhoneCall, Play, Volume2, VolumeX } from 'lucide-react';
import { Link } from '@/i18n/routing';
import NumberTicker from '@/components/ui/number-ticker';
import AutoCarousel from '@/components/ui/auto-carousel';
import { useLocale } from 'next-intl';
import { usePageContent } from '@/hooks/usePageContent';
import { useCategories } from '@/hooks/useCategories';
import { useCatalogProducts } from '@/hooks/useProductCatalog';
import { ProductCardMedia } from '@/components/products/ProductCardMedia';

type PageContentProps = {
  initialContent?: Record<string, string> | null;
};

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
    <div 
      ref={ref} 
      className={`${className} ${inView ? 'fade-up-visible' : 'fade-up-hidden'}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// 交付卡片视频播放器组件
function DeliveryCard({ tag, date, location, title, videoUrl }: {
  tag: string; date: string; location: string; title: string;
  videoUrl?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
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
      <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden mb-6 border border-[#D8D6CF] bg-[#111110]">
        {videoUrl && !videoError ? (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              muted={muted}
              loop
              playsInline
              className="w-full h-full object-cover"
              onEnded={() => setPlaying(false)}
              onError={() => setVideoError(true)}
            />
            {/* 播放/暂停遮罩 */}
            <div
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors"
            >
              {!playing && (
                <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <Play size={22} className="text-[#111110] fill-[#111110] ml-1" />
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
        ) : (
          <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
            <Play size={32} className="text-white/20" />
          </div>
        )}
        {/* 左下角标签 */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 text-[11px] font-black tracking-widest uppercase flex flex-col gap-1 shadow-lg border border-[#D8D6CF] pointer-events-none">
          <span className="text-[#C8960A]">{tag}</span>
          {location && <span className="text-[#111110]">{location}</span>}
        </div>
      </div>
      <span className="inline-block bg-[#EDECEA] text-[#3A3A38] font-bold text-[11px] tracking-widest uppercase mb-4 px-3 py-1.5 rounded-full">{date}</span>
      <h4 className="text-[1.125rem] font-black leading-relaxed text-[#111110] border-l-[3px] border-[#C8960A] pl-4">{title}</h4>
    </div>
  );
}

export default function HomePageClient({ initialContent }: PageContentProps) {
  const locale = useLocale();
  const isZh = locale === 'zh';
  const { get: c } = usePageContent('home', initialContent);
  const newsScrollRef = useRef<HTMLDivElement>(null);
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
  }));

  const scrollNews = (direction: 'left' | 'right') => {
    if (newsScrollRef.current) {
      newsScrollRef.current.scrollBy({ left: direction === 'left' ? -420 : 420, behavior: 'smooth' });
    }
  };

  return (
    <main className="w-full flex-1">
      {/* =========================================
          Step 1: 英雄区 (Reference Design — Light BG)
      ============================================= */}
      <section className="bg-[#F9F8F5]">
        <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center px-6 sm:px-[60px] py-20 max-w-[1100px] mx-auto">

          {/* 两行大标题 */}
          <div className="hero-fade-2 hero-title-home mb-3">
            {c('hero.title1', isZh ? '铸塑未来的' : 'Built to Power')}
          </div>
          <div className={`hero-fade-2 hero-title-home hero-gold ${isZh ? 'hero-zh' : ''} mb-16`}>
            {c('hero.titleGold', isZh ? '重工力量' : "the World's Work.")}
          </div>

          {/* 分隔线 */}
          <div className="hero-fade-4 w-full h-px bg-[#D8D6CF] mb-12" />

          {/* 4列统计 */}
          <div className="hero-fade-5 w-full grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
            {[
              { numKey: 'hero.stat1.num', numDefault: '3000', suffix: '+', labelKey: 'hero.stat1.label', labelZh: '全球交付设备', labelEn: 'Machines Delivered' },
              { numKey: 'hero.stat2.num', numDefault: '50',   suffix: '+', labelKey: 'hero.stat2.label', labelZh: '覆盖国家', labelEn: 'Countries Served' },
              { numKey: 'hero.stat3.num', numDefault: '20',   suffix: '+', labelKey: 'hero.stat3.label', labelZh: '年行业经验', labelEn: 'Years Experience' },
              { numKey: 'hero.stat4.num', numDefault: '100',  suffix: '%', labelKey: 'hero.stat4.label', labelZh: '全检率', labelEn: 'Full Inspection Rate' },
            ].map((stat, i) => (
              <div key={i} className={`${i > 0 ? 'md:pl-10 md:border-l md:border-[#D8D6CF]' : ''} ${i < 3 ? 'md:pr-10' : ''}`}>
                <div className="flex items-baseline gap-0.5" style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" }}>
                  <span className="text-[clamp(40px,5vw,60px)] leading-none text-[#111110] tracking-[0.02em]">
                    <NumberTicker value={parseInt(c(stat.numKey, stat.numDefault)) || parseInt(stat.numDefault)} />
                  </span>
                  <span className="text-[clamp(28px,3.5vw,42px)] text-[#C8960A]" style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" }}>
                    {stat.suffix}
                  </span>
                </div>
                <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#888780] mt-2.5 leading-snug">
                  {c(stat.labelKey, isZh ? stat.labelZh : stat.labelEn)}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================
          Step 2: 极速匹配品类画廊 (Auto Carousel)
      ============================================= */}
      <section id="categories" className="w-full pt-28 pb-0 bg-[#FAFAF8] overflow-hidden relative border-t border-[#EDECEA]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <FadeUp className="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-12 gap-6 lg:gap-12">
            <div className={`lg:flex-1 ${isZh ? 'max-w-4xl' : 'max-w-md xl:max-w-lg'}`}>
              <h2 className={`font-black tracking-tighter text-[#111110] text-balance ${isZh ? 'text-5xl md:text-6xl' : 'text-4xl lg:text-[2.75rem] leading-tight'}`}>{c('categories.title', isZh ? '全矩阵设备覆盖' : 'Full-Spectrum Equipment Coverage')}</h2>
            </div>
            <div className="border-l-4 border-[#C8960A] pl-6 hidden lg:block shrink-0 lg:w-[380px]">
              <p className="text-[#888780] text-sm leading-relaxed font-medium">{c('categories.desc', isZh ? '无论您的工程面临何种极端挑战，我们都能为您提供从强力挖掘、重型装载到路面打造的全场景、无死角的高端重装解决方案。' : 'Whatever your project demands, we deliver high-performance heavy equipment solutions across the full spectrum.')}</p>
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
            img: cat.imageUrl || null,
          }))} />
        ) : (
          <div className="px-8 pb-16 text-center text-[#888780] text-sm py-20">
            {c('categories.emptyText', isZh ? '暂无分类，请在后台「分类管理」中添加' : 'No categories yet. Add them in the admin panel.')}
          </div>
        )}
      </section>

      {/* =========================================
          Step 3: 严选热销机械 (6-Grid Featured)
      ============================================= */}
      <section className="w-full py-16 md:py-32 bg-[#F9F8F5] border-t border-[#EDECEA]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <FadeUp className="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-16 gap-6 lg:gap-12">
            <div className={`lg:flex-1 ${isZh ? 'max-w-4xl' : 'max-w-md xl:max-w-lg'}`}>
              <h2 className={`font-black tracking-tighter text-[#111110] text-balance ${isZh ? 'text-5xl md:text-6xl' : 'text-4xl lg:text-[2.75rem] leading-tight'}`}>{c('hot.title', isZh ? '严选热销机皇' : 'Top-Rated Machines, Handpicked')}</h2>
            </div>
            <div className="border-l-4 border-[#C8960A] pl-6 hidden lg:block shrink-0 lg:w-[380px]">
              <p className="text-[#888780] text-sm leading-relaxed font-medium">{c('hot.desc', isZh ? '这些顶级现货机型经过 100 项全案严苛过滤，代表着本月极低的故障率和极高的投资回报比，是全球大型基建的首选制胜装备。' : 'Every unit has passed a rigorous 100-point inspection — the lowest failure rates and highest ROI of the month.')}</p>
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
              <Link href={item.slug ? `/products/${item.slug}` as `/${string}` : '/products'} key={index} className="group bg-[#FFFFFF] flex flex-col cursor-pointer hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden pb-8 border border-[#D8D6CF]">
                <div className="relative w-full aspect-[4/3] bg-[#F6F4F0] rounded-t-2xl overflow-hidden">
                  <ProductCardMedia
                    src={item.coverMediaUrl}
                    type={item.coverMediaType}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute top-4 left-4 text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest shadow-lg z-10 bg-[#C8960A]">
                    {c('hot.inStockLabel', isZh ? '现货就绪' : 'In Stock')}
                  </div>
                </div>
                <div className="px-8 mt-6">
                  <span className="text-xs font-bold text-[#888780] uppercase tracking-widest block mb-1">
                    {item.brand}
                  </span>
                  <div className="flex items-center justify-between group-hover:text-[#C8960A] transition-colors">
                    <h4 className="text-2xl font-black text-[#111110] leading-tight text-inherit">
                      {item.title}
                    </h4>
                    <div className="w-10 h-10 rounded-full bg-[#F6F4F0] flex items-center justify-center flex-shrink-0 group-hover:bg-[#111110] group-hover:text-white transition-all transform group-hover:translate-x-1 border border-[#D8D6CF]">
                      <ArrowRight size={18} className="text-[#888780] group-hover:text-[#C8960A] transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-3 text-center text-[#888780] text-sm py-20">
                {c('hot.emptyText', isZh ? '暂无在售产品，请在后台「产品列表」中添加' : 'No products yet. Add them in the admin panel.')}
              </div>
            )}
          </FadeUp>

          <FadeUp delay={300} className="mt-16 text-center">
            <Link href="/products" className="h-14 px-10 rounded-full bg-[#111110] text-white text-[13px] font-bold tracking-[0.2em] hover:bg-[#C8960A] hover:text-white transition-all shadow-xl inline-flex items-center justify-center gap-3 group">
              {c('hot.btnText', isZh ? '游览所有 300+ 在线设备' : 'View All 300+ Listed Machines')}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* =========================================
          Step 4: 打消出海痛点 (Core Services)
      ============================================= */}
      <section className="w-full py-16 md:py-32 bg-[#FAFAF8]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <FadeUp className="text-center mb-24">
            <h2 className="text-5xl font-black tracking-tighter text-[#111110] mb-4">{c('s5.title', isZh ? '世界级的交付与服务标准' : 'World-Class Delivery & After-Sales Standards')}</h2>
            <p className="text-[#888780] max-w-2xl mx-auto">{c('s5.desc', isZh ? '在跨国重装采购中，物流与售后往往是最大的阻碍。我们将为您彻底铲除这些摩擦力，提供真正的端到端出海服务体系。' : 'In cross-border heavy equipment procurement, logistics and after-sales are often the greatest barriers. We eliminate that friction entirely.')}</p>
          </FadeUp>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[
              { icon: ShieldCheck, title: c('s5.card.0.title', isZh ? "100项隐患全排查" : "100-Point Pre-Export Inspection"), desc: c('s5.card.0.desc', isZh ? "从发动机、液压主泵到外观履带，严格执行原厂级全案检测体系，出具全流程权威视频报告。" : "From the engine and hydraulic main pump to undercarriage, every unit undergoes a factory-grade inspection with video report.") },
              { icon: Factory, title: c('s5.card.1.title', isZh ? "全自管翻新与喷漆" : "In-House Overhaul & Refinishing"), desc: c('s5.card.1.desc', isZh ? "我们在国内拥有一流的数控机床与原厂喷漆房阵列，支持机器的动力总成大修与原厂化翻新装配。" : "Our facility houses CNC machinery and OEM-standard paint booths for full powertrain overhauls and factory-grade refinishing.") },
              { icon: Wrench, title: c('s5.card.2.title', isZh ? "原厂级易损件直供" : "OEM-Grade Wear Parts Supply"), desc: c('s5.card.2.desc', isZh ? "为海外发盘一次性备齐各类核心易损件打包（如滤芯、皮带、销轴），大幅延长基建区作业生命。" : "Critical wear parts packed with every overseas shipment to maximize uptime in remote jobsite environments.") },
              { icon: Settings, title: c('s5.card.3.title', isZh ? "工况重度改装调校" : "Heavy-Duty Site Adaptation"), desc: c('s5.card.3.desc', isZh ? "针对非洲极端高温和南美高湿度恶劣矿区，针对性地加强液压散热管线和冷媒，保障高温不沸腾。" : "For extreme heat in Africa and high-humidity South American mines, we reinforce hydraulic cooling lines and upgrade coolants.") },
              { icon: PhoneCall, title: c('s5.card.4.title', isZh ? "7×24 终身技术指导" : "24/7 Lifetime Technical Support"), desc: c('s5.card.4.desc', isZh ? "拥有双语专家护航的紧急技术支援小队，提供无延迟的长途排错、图纸指引与跨国连线辅导。" : "Our bilingual technical team provides zero-delay remote diagnostics and live cross-border troubleshooting 24/7.") },
              { icon: Globe, title: c('s5.card.5.title', isZh ? "跨洋海运零盲区清关" : "Door-to-Port Shipping & Customs"), desc: c('s5.card.5.desc', isZh ? "凭借深耕非洲、南美的高能航运合作伙伴，打磨出包税清关、滚装直航一体化的极简提货路线。" : "Backed by partners across Africa and South America, we provide all-inclusive customs clearance and RO-RO shipping.") }
            ].map((feature, i) => (
              <FadeUp key={i} delay={i * 100} className="flex flex-col items-center text-center p-8 bg-[#F6F4F0] border border-[#D8D6CF] rounded-3xl hover:border-[#111110] transition-colors duration-500 shadow-sm hover:shadow-xl group">
                <div className="w-20 h-20 bg-[#FFFFFF] rounded-full flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-[#C8960A] transition-all duration-500">
                  <feature.icon strokeWidth={1.5} size={32} className="text-[#C8960A] group-hover:text-white transition-colors" />
                </div>
                <h5 className="text-xl font-black text-[#111110] mb-4">{feature.title}</h5>
                <p className="text-sm text-[#888780] leading-relaxed">{feature.desc}</p>
              </FadeUp>
            ))}
          </div>
          
          <div className="text-center">
             <Link href="/services" className="h-16 px-12 rounded-full bg-[#111110] text-white text-[13px] font-bold tracking-[0.2em] hover:bg-[#C8960A] hover:text-[#111110] transition-all shadow-xl inline-flex items-center gap-4">
                 {c('s5.btnText', isZh ? '探索完整增值出海体系' : 'Explore Our Full Export Service Suite')}
                 <ArrowRight size={16} />
             </Link>
          </div>
        </div>
      </section>

      {/* =========================================
          Step 6: 最新出海动态瀑布流 (Latest Delivery) 🌟NEW🌟
      ============================================= */}
      <section className="w-full py-16 md:py-32 bg-[#F9F8F5] border-t border-[#EDECEA]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <FadeUp className="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-16 gap-6 lg:gap-12">
            <div className={`lg:flex-1 ${isZh ? 'max-w-4xl' : 'max-w-[360px] md:max-w-md xl:max-w-lg'}`}>
              <h2 className={`font-black tracking-tighter text-[#111110] text-balance ${isZh ? 'text-5xl md:text-6xl' : 'text-4xl lg:text-[2.75rem] leading-tight'}`}>{c('news.title', isZh ? '交机实录与动态' : 'Live Delivery Updates')}</h2>
            </div>
            <div className="border-l-4 border-[#C8960A] pl-6 hidden lg:block shrink-0 lg:w-[380px]">
              <p className="text-[#888780] text-sm leading-relaxed font-medium">{c('news.desc', isZh ? '真实发盘、跨国海运、开箱验收。我们为您展示实时的设备全球周转录像与物流快讯，亲眼见证我们的端到端跨国履约与重装交付能力。' : 'Real shipments. International ocean freight. On-site unboxing. We share live footage and logistics updates from active global dispatches.')}</p>
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
               <button onClick={() => scrollNews('left')} className="w-12 h-12 rounded-full border border-[#D8D6CF] flex items-center justify-center text-[#111110] bg-[#FFFFFF] hover:bg-[#111110] hover:text-white transition-all shadow-sm hover:shadow-lg hover:-translate-x-1">
                 <ArrowLeft size={18}/>
               </button>
               <button onClick={() => scrollNews('right')} className="w-12 h-12 rounded-full border border-[#D8D6CF] flex items-center justify-center text-[#111110] bg-[#FFFFFF] hover:bg-[#111110] hover:text-white transition-all shadow-sm hover:shadow-lg hover:translate-x-1">
                 <ArrowRight size={18}/>
               </button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
