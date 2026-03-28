'use client';
import { ArrowRight, FileText, LayoutGrid } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

export default function InsightsPage() {
  
  const articles = [
    { 
      title: "从中国购买二手挖掘机的全面避坑指南与跨国交割总结", 
      category: "采购指南", 
      date: "Oct 24, 2026", 
      readTime: "8 MIN READ", 
      intro: "挑选一台中国制造的二手挖掘机，却不知从何入手？从查验回转马达到审查底盘件盲区，这篇详尽的出海提货指南将帮你避免损失数万美金的暗坑...",
      img: "/images/insights/1.jpg" 
    },
    { 
      title: "挖掘机投资效益最大化：延长使用寿命和极简化维保策略", 
      category: "维修保养", 
      date: "Sep 18, 2026", 
      readTime: "5 MIN READ", 
      intro: "恶劣的高温工况下液压主泵为什么会频发过热？本文由资深工程师亲自拆解沃尔沃 EC210D 的冷却系统，带您掌握核心液压部件的长效存活指标。",
      img: "/images/insights/2.jpg" 
    },
    { 
      title: "许许多多买家在购买二手设备时会认为它们一定存在质量暗病？", 
      category: "行业观察", 
      date: "Aug 30, 2026", 
      readTime: "12 MIN READ", 
      intro: "由于黄牛车和组装翻新车的泛滥，跨国二手工程机械行业充斥着严重的不信任感。本文深入分析如何通过合规的第三方检测机构 (SGS) 验证设备的真实工时。",
      img: "/images/insights/3.jpg" 
    },
    { 
      title: "提高作业效率：了解推土机进场前的50项维护检查清单", 
      category: "采购指南", 
      date: "Jul 15, 2026", 
      readTime: "6 MIN READ", 
      intro: "停机等于烧钱。一份标准的预防性维护检查清单，能帮助矿区管理者在工程启动前排除发动机黑烟、履带跑偏等高频隐患，本文附赠打印版清单表...",
      img: "/images/insights/1.jpg"
    },
    { 
      title: "南美高田区作业重器：小松 D155A 性能全评测与海运周期须知", 
      category: "交付实况", 
      date: "Jun 22, 2026", 
      readTime: "4 MIN READ", 
      intro: "安第斯山脉的采石场需要巨大的掘地推力。我们跟单记录了五台全翻新状态的小松推土机跨越 1.5 万公里的完整交付实录与性能极值评测。",
      img: "/images/insights/2.jpg" 
    },
    { 
      title: "柴油发电机异常震动逻辑：即使不打开上盖，该如何听出毛病？", 
      category: "技术专栏", 
      date: "May 11, 2026", 
      readTime: "9 MIN READ", 
      intro: "有经验的师傅可以通过倾听柴油泵的共振频率，粗略判断发动机缸体老化的程度。本期技术解码教你听懂设备的“悲鸣警告”。",
      img: "/images/insights/3.jpg" 
    }
  ];

  return (
    <main className="w-full bg-[#FAFAFA] pt-20">
      
      {/* 1. 行业智库头图 (Typography Hero) */}
      <section className="w-full bg-[#111111] border-b border-gray-800 text-center py-32 px-4 relative overflow-hidden">
         {/* 背景代码极客感网格 */}
         <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
         <div className="relative z-10 max-w-4xl mx-auto">
             <span className="text-[#D4AF37] text-sm font-bold tracking-[0.4em] uppercase mb-6 block">KXTJ Insights & Guides</span>
             <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-tight">
               穿透行业迷雾，<br/>掌握<span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">采购绝对底牌。</span>
             </h1>
             <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                跳出信息不对称的陷阱。我们的高级工程师与出海贸易专家每周为您深度拆解二手重装机械的采购防坑逻辑、维护要略与第一手行业走势。
             </p>
         </div>
      </section>

      {/* 2. 主流资讯分类栏 (Category Toggles) */}
      <section className="w-full bg-white border-b border-gray-200 sticky top-[80px] z-40">
        <div className="max-w-[1440px] mx-auto px-8 py-4 flex flex-wrp items-center justify-between gap-4">
           
           <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden w-full md:w-auto">
             <button className="whitespace-nowrap px-6 py-2 bg-[#111111] text-white text-[12px] font-bold tracking-widest uppercase hover:opacity-90 transition-opacity">全部资讯 (All)</button>
             <button className="whitespace-nowrap px-6 py-2 bg-gray-100 text-[#111111] text-[12px] font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors">采购指南 (Guides)</button>
             <button className="whitespace-nowrap px-6 py-2 bg-gray-100 text-[#111111] text-[12px] font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors">维修保养 (Maintenance)</button>
             <button className="whitespace-nowrap px-6 py-2 bg-gray-100 text-[#111111] text-[12px] font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors">交付实况 (Records)</button>
           </div>
           
           <div className="hidden lg:flex items-center gap-2 text-gray-400">
             <LayoutGrid size={20} className="hover:text-[#111111] cursor-pointer" />
             <FileText size={20} className="text-[#111111] cursor-pointer" />
           </div>

        </div>
      </section>

      {/* 3. 高端资讯瀑布流 (Masonry/Grid Article Feed) */}
      <section className="w-full py-24 bg-[#FAFAFA]">
        <div className="max-w-[1440px] mx-auto px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
            {articles.map((article, idx) => (
              <article key={idx} className="group flex flex-col cursor-pointer bg-white border border-transparent hover:border-gray-200 hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] transition-all duration-500 rounded-sm overflow-hidden">
                {/* 封面缩略图 */}
                <div className="relative w-full aspect-[16/10] bg-[#111111] overflow-hidden">
                   <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                   <Image src={article.img} alt={article.title} fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 font-medium" />
                   
                   {/* 悬浮标签 */}
                   <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 shadow-md border border-gray-100">
                       <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">{article.category}</span>
                   </div>
                </div>

                {/* 文字主体 */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">
                     <span>{article.date}</span>
                     <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                     <span>{article.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-black text-[#111111] group-hover:text-[#D4AF37] leading-tight mb-4 transition-colors duration-300">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-500 font-medium line-clamp-3 leading-relaxed mb-8 flex-1">
                    {article.intro}
                  </p>
                  
                  <div className="inline-flex items-center gap-2 text-[12px] font-bold tracking-widest uppercase text-[#111111] group-hover:text-[#D4AF37] transition-colors mt-auto pt-6 border-t border-gray-100">
                    阅读全篇 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="mt-24 text-center">
            <button className="h-16 px-16 border-2 border-[#111111] bg-transparent text-[#111111] font-bold text-sm tracking-[0.2em] uppercase hover:bg-[#111111] hover:text-white transition-all">
               加载更多行业洞察
            </button>
          </div>

        </div>
      </section>
      
    </main>
  );
}
