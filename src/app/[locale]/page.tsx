"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, Settings, ShieldCheck, Globe, Wrench, Factory, PhoneCall, Send, ChevronRight, X, Play, Pause } from 'lucide-react';
import { Link } from '@/i18n/routing';
import NumberTicker from '@/components/ui/number-ticker';
import AutoCarousel from '@/components/ui/auto-carousel';
import { useInquirySubmit } from '@/hooks/useInquirySubmit';
import { useLocale } from 'next-intl';
import type { ArticleRecord } from '@/lib/data/repository';

interface NewsItem {
  tag: string;
  date: string;
  country: string;
  title: string;
  img: string;
  slug?: string;
}

const FALLBACK_NEWS: NewsItem[] = [
  {tag: "装船实况", date: "Oct 24, 2026", country: "🇳🇬 Lagos, Nigeria", title: "Three CAT 336 heavy excavators refurbished and shipped to West Africa.", img: "/hero.png"},
  {tag: "交机签收", date: "Oct 15, 2026", country: "🇦🇪 Dubai, UAE", title: "Volvo three-unit assembly accepted and commissioned in Abu Dhabi port heat.", img: "/loader.png"},
  {tag: "发车纪实", date: "Oct 02, 2026", country: "🇨🇱 Santiago, Chile", title: "First South American order! Two Komatsu D155 dozers cleared customs for the Andes.", img: "/hero.png"},
  {tag: "开箱验车", date: "Sep 18, 2026", country: "🇧🇷 São Paulo, Brazil", title: "Batch of Volvo wheel loaders arrived in São Paulo for South American distribution.", img: "/loader.png"},
];

export default function Home() {
  const locale = useLocale();
  const isZh = locale === 'zh';
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isFactoryVideoPlaying, setIsFactoryVideoPlaying] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const newsScrollRef = useRef<HTMLDivElement>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(FALLBACK_NEWS);
  const { submitState, submitMessage, handleSubmit } = useInquirySubmit({
    source: "home-page-cta",
  });

  useEffect(() => {
    fetch('/api/articles')
      .then((r) => r.json())
      .then((res: { ok: boolean; data: ArticleRecord[] }) => {
        if (!res.ok || !res.data.length) return;
        const mapped: NewsItem[] = res.data.slice(0, 4).map((a) => ({
          tag: a.category,
          date: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
          country: '',
          title: isZh ? (a.titleZh ?? a.title) : a.title,
          img: a.coverImageUrl ?? '/hero.png',
          slug: a.slug,
        }));
        setNewsItems(mapped);
      })
      .catch(() => {});
  }, [isZh]);

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
        
        {/* 单一真实的底层视频，无控制栏，完全作为背景 */}
        <div className="absolute inset-0 z-0">
          <video 
            ref={heroVideoRef}
            loop 
            muted 
            playsInline
            poster="/hero.png" /* 视频加载前，默认显示的封面，您可以换成任何照片 */
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          >
             {/* 届时换成您上传的真实工业视频 MP4 链接即可 */}
             <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" type="video/mp4" />
          </video>
          {/* 轻量滤镜，确保能看清后方机械细节，同时保证白色大标题清晰可读 */}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-90"></div>
        </div>

        {/* 永远不换行的内容区 */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 flex flex-col items-center text-center pt-20">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 border border-white/20 backdrop-blur-md mb-8">
             <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
             <span className="text-white text-xs font-bold uppercase tracking-[0.2em]">{isZh ? '面向国际市场的高端二手工程机械' : 'PREMIUM USED HEAVY EQUIPMENT FOR GLOBAL MARKETS'}</span>
          </div>

          <h1 className={`text-[10vw] sm:text-[8vw] md:text-7xl lg:text-[7vw] xl:text-[110px] font-black tracking-tight text-white leading-tight uppercase drop-shadow-2xl w-full ${isZh ? 'whitespace-nowrap' : 'whitespace-normal'}`}>
            {isZh ? '铸塑未来的' : 'Built to Power'} <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#D4AF37] via-[#F3E5AB] to-[#8C7322] drop-shadow-2xl px-2">{isZh ? '重工力量' : "the World's Work"}</span>
          </h1>
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
             <Link href="/products" className="w-full sm:w-[230px] h-[56px] rounded-full border border-transparent bg-[#D4AF37] text-white text-[14px] font-bold tracking-widest uppercase hover:bg-white hover:text-[#111111] transition-all duration-300 shadow-xl flex items-center justify-center gap-3 group">
               {isZh ? '探索核心机械' : 'Browse Equipment'}
               <ArrowRight size={18} className="rotate-90 sm:rotate-0 group-hover:translate-x-1 transition-transform" />
             </Link>
             <button 
                onClick={toggleHeroVideo} 
                className={`w-full sm:w-[230px] h-[56px] rounded-full border border-white/30 text-[14px] font-bold tracking-widest uppercase transition-all duration-500 backdrop-blur-md flex items-center justify-center gap-3 group shadow-xl ${isPlayingVideo ? 'bg-white text-[#111111]' : 'bg-black/40 text-white hover:bg-white hover:text-[#111111]'}`}
             >
               {isPlayingVideo ? (
                 <>
                   <Pause size={18} className="text-current fill-current relative left-0.5" />
                   {isZh ? '暂停实景视频' : 'Pause Video'}
                 </>
               ) : (
                 <>
                   <Play size={18} className="text-current fill-current relative left-0.5" />
                   {isZh ? '播放实景视频' : 'Play Video'}
                 </>
               )}
             </button>
          </div>
        </div>
      </section>

      {/* =========================================
          Step 2: 极速匹配品类画廊 (Auto Carousel)
      ============================================= */}
      <section id="categories" className="w-full pt-28 pb-0 bg-white overflow-hidden relative">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] lg:items-end mb-12 gap-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-[#111111] uppercase">{isZh ? '全矩阵设备覆盖' : 'Full-Spectrum Equipment Coverage'}</h2>
            </div>
            <div className="border-l-4 border-[#D4AF37] pl-6 hidden lg:block">
              <p className="text-gray-500 text-sm leading-relaxed font-medium">{isZh ? '无论您的工程面临何种极端挑战，我们都能为您提供从强力挖掘、重型装载到路面打造的全场景、无死角的高端重装解决方案。' : 'Whatever your project demands, we deliver high-performance heavy equipment solutions across the full spectrum — from mass excavation and heavy loading to precision grading and compaction.'}</p>
            </div>
          </div>
        </div>
        
        {/* 注入刚才写好的轮播组件 */}
        <AutoCarousel categories={[
            {name: '大型挖掘机', type: 'Excavators', img: '/hero.png'}, 
            {name: '轮式装载机', type: 'Wheel Loaders', img: '/loader.png'}, 
            {name: '重型推土机', type: 'Bulldozers', img: '/hero.png'}, 
            {name: '平地机与压路机', type: 'Graders & Rollers', img: '/loader.png'},
            {name: '工业叉车', type: 'Forklifts', img: '/hero.png'}
        ]} />
      </section>

      {/* =========================================
          Step 3: 严选热销机械 (6-Grid Featured)
      ============================================= */}
      <section className="w-full py-32 bg-[#FAFAFA] border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] lg:items-end mb-16 gap-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-[#111111] uppercase">{isZh ? '严选热销机皇' : 'Top-Rated Machines, Handpicked'}</h2>
            </div>
            <div className="border-l-4 border-[#D4AF37] pl-6 hidden lg:block">
              <p className="text-gray-500 text-sm leading-relaxed font-medium">{isZh ? '这些顶级现货机型经过 100 项全案严苛过滤，代表着本月极低的故障率和极高的投资回报比，是全球大型基建的首选制胜装备。' : 'Every unit in this selection has passed a rigorous 100-point inspection. These machines represent the lowest failure rates and highest return on investment of the month — the preferred choice for major infrastructure projects worldwide.'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 扩容为 6 图高密度阵列展示 */}
            {[
              {brand: "VOLVO", title:"L350H 巨型装载机", tag:"现货就绪", tagBg:"#D4AF37", bgImg:"/loader.png"},
              {brand: "CATERPILLAR", title:"320D 履带挖掘机", tag:"仅剩 2 台", tagBg:"#ef4444", bgImg:"/hero.png"},
              {brand: "KOMATSU", title:"D155A 履带推土机", tag:"现货就绪", tagBg:"#D4AF37", bgImg:"/hero.png"},
              {brand: "CATERPILLAR", title:"140H 轮式平地机", tag:"近3日发往拉各斯", tagBg:"#374151", bgImg:"/loader.png"},
              {brand: "VOLVO", title:"EC380D 重型挖掘机", tag:"现货就绪", tagBg:"#D4AF37", bgImg:"/hero.png"},
              {brand: "XCMG", title:"LW500KV 装载机", tag:"仅剩 1 台", tagBg:"#ef4444", bgImg:"/loader.png"}
            ].map((item, index) => (
              <Link href="/products" key={index} className="group bg-white flex flex-col cursor-pointer hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden pb-8 border border-gray-200">
                <div className="relative w-full aspect-[4/3] bg-[#F5F5F5] rounded-t-2xl overflow-hidden">
                  <Image src={item.bgImg} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                  {/* 稀缺营销标签直接取代死板的 HOT SALE */}
                  <div 
                    className="absolute top-4 left-4 text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest shadow-lg z-10"
                    style={{ backgroundColor: item.tagBg }}
                  >
                    {item.tag}
                  </div>
                </div>
                <div className="px-8 mt-6">
                  {/* 品牌名称 */}
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
                    {isZh 
                      ? (item.brand === 'VOLVO' ? '沃尔沃' 
                         : item.brand === 'CATERPILLAR' ? '卡特彼勒'
                         : item.brand === 'KOMATSU' ? '小松'
                         : item.brand === 'XCMG' ? '徐工' : item.brand)
                      : item.brand
                    }
                  </span>
                  {/* 大字号名称与右向箭头同行对齐 */}
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
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/products" className="h-14 px-10 rounded-full bg-[#111111] text-white text-[13px] font-bold uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-white transition-all shadow-xl inline-flex items-center justify-center gap-3 group">
              {isZh ? '游览所有 300+ 在线设备' : 'View All 300+ Listed Machines'}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* =========================================
          Step 4: 终极信任破冰 (Company & Stats) 
      ============================================= */}
      <section className="w-full bg-[#111111] text-white relative border-b border-gray-800">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* 左侧：实力宣告与动态数字 */}
          <div className="p-14 md:p-20 lg:p-24 flex flex-col justify-center relative z-10 border-r border-white/10">
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-8 drop-shadow-lg">
              {isZh ? '二十载深耕专注' : 'Two Decades of Expertise.'}<br/>{isZh ? '构筑起坚实底盘。' : 'A Foundation You Can Trust.'}
            </h2>
            <p className="text-gray-400 leading-relaxed max-w-sm mb-12 text-sm">
              {isZh ? '中国机械不仅仅是一家贸易商。我们在全球拥有自建的大型存放仓储与检测翻新基地。所有出海设备均由原厂级资深工程师亲手拆解、保养与极端测试，拒绝铁疙瘩，只发真战力。' : 'China Machinery is more than a trading company. We operate our own large-scale warehousing, inspection, and refurbishment facilities. Every machine destined for export is disassembled, serviced, and stress-tested by OEM-certified senior engineers. We ship real capability — not scrap iron.'}
            </p>
            
            {/* 合并：紧凑化的高能数据组 */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-10">
               <div>
                  <h4 className="text-3xl lg:text-4xl font-black mb-1 text-white"><NumberTicker value={3000} /><span className="text-[#D4AF37]">+</span></h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{isZh ? '全球成功交付设备' : 'Machines Delivered Globally'}</p>
               </div>
               <div>
                  <h4 className="text-3xl lg:text-4xl font-black mb-1 text-white"><NumberTicker value={50} /><span className="text-[#D4AF37]">+</span></h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{isZh ? '无缝海运覆盖国家' : 'Countries Served by Sea'}</p>
               </div>
               <div>
                  <h4 className="text-3xl lg:text-4xl font-black mb-1 text-white"><NumberTicker value={2000} /><span className="text-[#D4AF37]">+</span></h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{isZh ? '平米超级仓储展区' : 'm² Warehousing & Prep Yard'}</p>
               </div>
               <div>
                  <h4 className="text-3xl lg:text-4xl font-black mb-1 text-white"><NumberTicker value={100} /><span className="text-[#D4AF37]">%</span></h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{isZh ? '全节点拆机复检率' : 'Full-Teardown Inspection Rate'}</p>
               </div>
            </div>
          </div>
          
          {/* 右侧：回到极致规整的 5:5 画报与播放器切换区域 */}
          <div className="relative min-h-[400px] lg:min-h-full flex items-center justify-center group overflow-hidden bg-black">
            {isFactoryVideoPlaying ? (
              <video autoPlay controls className="absolute inset-0 w-full h-full object-cover z-20 animate-in fade-in duration-1000">
                <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
              </video>
            ) : (
              <>
                 <Image src="/hero.png" alt="KXTJ Global Factory Base" fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" />
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
      <section className="w-full py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black tracking-tighter text-[#111111] uppercase mb-4">{isZh ? '世界级的交付与服务标准' : 'World-Class Delivery & After-Sales Standards'}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{isZh ? '在跨国重装采购中，物流与售后往往是最大的阻碍。我们将为您彻底铲除这些摩擦力，提供真正的端到端出海服务体系。' : 'In cross-border heavy equipment procurement, logistics and after-sales support are often the greatest barriers. We eliminate that friction entirely, delivering a true end-to-end export service.'}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[
              { icon: ShieldCheck, title: isZh ? "100项隐患全排查" : "100-Point Pre-Export Inspection", desc: isZh ? "从发动机、液压主泵到外观履带，严格执行原厂级全案检测体系，出具全流程权威视频报告。" : "From the engine and hydraulic main pump to undercarriage and bodywork, every unit undergoes a factory-grade full-system inspection, with a comprehensive video report issued upon completion." },
              { icon: Factory, title: isZh ? "全自管翻新与喷漆" : "In-House Overhaul & Refinishing", desc: isZh ? "我们在国内拥有一流的数控机床与原厂喷漆房阵列，支持机器的动力总成大修与原厂化翻新装配。" : "Our facility houses precision CNC machinery and dedicated OEM-standard paint booths, capable of full powertrain overhauls and factory-grade refinishing to original specifications." },
              { icon: Wrench, title: isZh ? "原厂级易损件直供" : "OEM-Grade Wear Parts Supply", desc: isZh ? "为海外发盘一次性备齐各类核心易损件打包（如滤芯、皮带、销轴），大幅延长基建区作业生命。" : "We supply a comprehensive set of critical wear parts — including filters, belts, and pin assemblies — packed with every overseas shipment to maximize uptime in remote jobsite environments." },
              { icon: Settings, title: isZh ? "工况重度改装调校" : "Heavy-Duty Site Adaptation", desc: isZh ? "针对非洲极端高温和南美高湿度恶劣矿区，针对性地加强液压散热管线和冷媒，保障高温不沸腾。" : "For extreme heat in Africa and high-humidity mining sites in South America, we reinforce hydraulic cooling lines and upgrade coolant systems to prevent overheating under the most demanding conditions." },
              { icon: PhoneCall, title: isZh ? "7x24 终身技术指导" : "24/7 Lifetime Technical Support", desc: isZh ? "拥有双语专家护航的紧急技术支援小队，提供无延迟的长途排错、图纸指引与跨国连线辅导。" : "Our bilingual technical response team provides zero-delay remote diagnostics, technical drawings, and live cross-border troubleshooting assistance around the clock." },
              { icon: Globe, title: isZh ? "跨洋海运零盲区清关" : "Door-to-Port Shipping & Customs Clearance", desc: isZh ? "凭借深耕非洲、南美的高能航运合作伙伴，打磨出包税清关、滚装直航一体化的极简提货路线。" : "Backed by established shipping partners across Africa and South America, we provide a streamlined, all-inclusive solution covering duties, RO-RO direct sailing, and hassle-free port pickup." }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-8 bg-gray-50 border border-gray-100 rounded-3xl hover:border-black transition-colors duration-500 shadow-sm hover:shadow-xl group">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-[#111111] transition-all duration-500">
                  <feature.icon strokeWidth={1.5} size={32} className="text-[#111111] group-hover:text-[#D4AF37] transition-colors" />
                </div>
                <h5 className="text-xl font-black text-[#111111] mb-4">{feature.title}</h5>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
             <Link href="/services" className="h-16 px-12 rounded-full bg-[#111111] text-white text-[13px] font-bold tracking-[0.2em] uppercase hover:bg-[#D4AF37] hover:text-black transition-all shadow-xl inline-flex items-center gap-4">
                 {isZh ? '探索完整增值出海体系' : 'Explore Our Full Export Service Suite'}
                 <ArrowRight size={16} />
             </Link>
          </div>
        </div>
      </section>

      {/* =========================================
          Step 6: 最新出海动态瀑布流 (Latest Delivery) 🌟NEW🌟
      ============================================= */}
      <section className="w-full py-32 bg-[#FAFAFA] border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] lg:items-end mb-16 gap-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-[#111111] uppercase">{isZh ? '交机实录与动态' : 'Live Delivery Updates'}</h2>
            </div>
            <div className="border-l-4 border-[#D4AF37] pl-6 hidden lg:block">
              <p className="text-gray-500 text-sm leading-relaxed font-medium">{isZh ? '真实发盘、跨国海运、开箱验收。我们为您展示实时的设备全球周转录像与物流快讯，亲眼见证我们的端到端跨国履约与重装交付能力。' : 'Real shipments. International ocean freight. On-site unboxing verification. We share live footage and logistics updates from active global dispatches so you can see our end-to-end delivery capability firsthand.'}</p>
            </div>
          </div>
          
          <div className="relative w-full group/news">
            <div ref={newsScrollRef} className="flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {/* 画册流：支持点击滑动与原生的手机/PC直接拖拽与横向滚动 */}
              {newsItems.map((news, i) => (
                 <Link key={i} href={news.slug ? `/insights/${news.slug}` : '/insights'} className="group cursor-pointer shrink-0 w-[82vw] sm:w-[420px] snap-center">
                    <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden mb-6 border border-gray-200">
                      <Image src={news.img} alt={news.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 text-[11px] font-black tracking-widest uppercase flex flex-col gap-1 shadow-lg border border-gray-100">
                         <span className="text-[#D4AF37]">{news.tag}</span>
                         {news.country && <span className="text-[#111111]">{news.country}</span>}
                      </div>
                    </div>
                    <p className="text-gray-400 font-bold text-[10px] tracking-widest uppercase mb-3">{news.date}</p>
                    <h4 className="text-[1.125rem] font-black leading-relaxed group-hover:text-gray-500 transition-colors text-[#111111]">{news.title}</h4>
                 </Link>
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
          <div className="bg-[#111111] p-10 md:p-16 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2rem] md:rounded-[3rem]">
            <div>
               <h2 className="text-3xl md:text-4xl xl:text-5xl font-black text-white mb-6 leading-tight whitespace-nowrap overflow-hidden">
                 {isZh ? '未找到心仪的' : "Can't Find the"} <span className="text-[#D4AF37]">{isZh ? '特定机型？' : 'Right Machine?'}</span>
               </h2>
               <p className="text-gray-400 mb-10 leading-relaxed max-w-md">{isZh ? '提供您的工况需求和采买预算，我们的海外专属采购代表将在 12 小时内为您在全球自有仓储网络中匹配最佳的替代品方案。' : 'Share your operating requirements and target budget, and our dedicated sourcing representative will identify the best-matched alternatives from our global inventory network within 12 hours.'}</p>
               <div className="flex flex-col sm:flex-row gap-8 pt-8 border-t border-gray-800">
                  <div className="flex gap-4">
                     <div className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center flex-shrink-0">
                        <PhoneCall size={20} className="text-[#D4AF37]" />
                     </div>
                     <div>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{isZh ? '专属直联' : 'Direct Contact'}</p>
                        <a href="tel:+8617321077956" className="text-white font-bold tracking-wider hover:text-[#D4AF37] transition-colors block">+86 1732 107 7956</a>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center flex-shrink-0">
                        <Globe size={20} className="text-[#D4AF37]" />
                     </div>
                     <div>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{isZh ? '总部寻址' : 'Headquarters'}</p>
                        <p className="text-white font-bold tracking-wider">{isZh ? '中国，上海' : 'Shanghai, China'}</p>
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
               <h3 className="text-2xl font-black text-[#111111] mb-8">{isZh ? '即刻获取定制报价' : 'Get Your Custom Quote Now'}</h3>
               <div className="grid grid-cols-1 gap-6">
                 {/* 精简为最高转化的纯正 3 字段收网节点 */}
                 <div className="border-b border-gray-300 focus-within:border-[#111111] transition-colors group">
                   <input name="name" required type="text" placeholder={isZh ? '您的称呼 *' : 'Your Name *'} className="w-full py-3 text-sm focus:outline-none bg-transparent font-medium group-focus-within:placeholder:text-gray-400" />
                 </div>
                 <div className="border-b border-gray-300 focus-within:border-[#111111] transition-colors group">
                   <input name="contact" required type="text" placeholder={isZh ? 'WhatsApp / 邮箱 *' : 'WhatsApp / Email *'} className="w-full py-3 text-sm focus:outline-none bg-transparent font-medium group-focus-within:placeholder:text-gray-400" />
                 </div>
                 <div className="border-b border-gray-300 focus-within:border-[#111111] transition-colors group pt-2">
                   <textarea name="message" required placeholder={isZh ? '意向机械与特定工况需求 (必填)' : 'Machine of interest & specific operating requirements (required)'} rows={3} className="w-full py-3 text-sm focus:outline-none bg-transparent resize-none font-medium group-focus-within:placeholder:text-gray-400"></textarea>
                 </div>
               </div>
               {submitMessage ? (
                 <p className={`text-xs font-medium ${submitState === "success" ? "text-green-600" : "text-red-500"}`}>
                   {submitMessage}
                 </p>
               ) : null}
               <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                 <div className="flex items-center gap-3 shrink-0 lg:mr-4">
                    <a href="https://wa.me/8615375319246" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full border border-gray-200 text-gray-400 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all duration-300 group" title="WhatsApp">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" className="group-hover:scale-110 transition-transform"><path d="M11.996 0a11.965 11.965 0 00-10.23 18.238L.044 24l6.012-1.632A11.968 11.968 0 1011.996 0zm6.657 17.244c-.266.75-1.523 1.455-2.107 1.517-.5.061-1.144.15-3.333-.762-2.646-1.096-4.35-3.805-4.48-4.004-.13-.198-1.071-1.423-1.071-2.716 0-1.291.674-1.924.912-2.19.239-.265.518-.33.69-.33.17 0 .343 0 .493.007.158.007.368-.06.574.4.215.474.721 1.777.786 1.909.066.133.111.288.026.467-.085.18-.129.294-.258.438-.13.14-.268.309-.387.433-.13.13-.264.276-.115.539.148.261.662 1.11 1.402 1.874.953.985 1.79 1.285 2.052 1.405.263.12.417.098.572-.078.155-.175.67-1.02.85-1.371.18-.35.358-.291.597-.197.24.093 1.517.714 1.776.843.256.13.43.193.493.302.062.108.062.631-.205 1.38z"/></svg>
                    </a>
                    <a href="#" className="w-14 h-14 rounded-full border border-gray-200 text-gray-400 hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-all duration-300 group" title="LinkedIn">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" className="group-hover:scale-110 transition-transform"><path d="M22.23 0H1.77C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.008zM7.12 20.452H3.558V9h3.562v11.452zm-1.78-13.02c-1.144 0-2.065-.925-2.065-2.064 0-1.139.92-2.064 2.065-2.064 1.14 0 2.064.925 2.064 2.064 0 1.139-.924 2.064-2.064 2.064zm15.11 13.02h-3.553v-5.569c0-1.328-.027-3.037-1.852-3.037-1.854 0-2.136 1.445-2.136 2.939v5.667H9.354V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z"/></svg>
                    </a>
                    <a href="#" className="w-14 h-14 rounded-full border border-gray-200 text-gray-400 hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-300 group" title="Facebook">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" className="group-hover:scale-110 transition-transform"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                 </div>
                 
                 <button
                   type="submit"
                   disabled={submitState === "loading"}
                   className="flex-1 w-full h-14 rounded-full bg-[#111111] text-white text-[13px] font-bold tracking-[0.2em] uppercase hover:bg-[#D4AF37] hover:text-black transition-colors flex items-center justify-center gap-3 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                 >
                   {submitState === "loading" ? (isZh ? '提交中...' : 'Submitting...') : (isZh ? '获取专属定制报价' : 'Request My Custom Quote')} <Send size={16} />
                 </button>
               </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
