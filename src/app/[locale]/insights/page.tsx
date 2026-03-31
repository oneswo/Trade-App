'use client';
import { useEffect, useState } from 'react';
import { ArrowRight, FileText, LayoutGrid } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { usePageContent } from '@/hooks/usePageContent';
import type { ArticleRecord } from '@/lib/data/repository';

export default function InsightsPage() {
  const locale = useLocale();
  const isZh = locale === 'zh';
  const { get: c } = usePageContent('insights');
  
  const [articles, setArticles] = useState<ArticleRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles')
      .then(r => r.json())
      .then(res => {
        if (res.ok) setArticles(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="w-full bg-[#FAFAFA] pt-[72px]">
      
      {/* 1. 行业智库头图 (Typography Hero) */}
      <section className="relative w-full h-[450px] md:h-[500px] flex items-center justify-center bg-[#111111] overflow-hidden">
         {/* 背景代码极客感网格 */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
         <div className="absolute inset-0 opacity-60 bg-cover bg-center pointer-events-none scale-105 active:scale-100 transition-transform duration-[10s]" style={{ backgroundImage: `url('${c('hero.bgImage', '/images/hero/insights.png')}')` }}></div>
         <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-[#111111]/10 pointer-events-none"></div>
         
         {/* 琥珀色微光 (Radiant Glow) */}
         <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D4AF37] opacity-[0.05] blur-[120px] rounded-full pointer-events-none"></div>
         <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#D4AF37] opacity-[0.03] blur-[150px] rounded-full pointer-events-none"></div>

         <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-[1100px] mx-auto text-center mt-4">
            
             {/* 顶部分类小提示 */}
             <div className="flex items-center justify-center gap-3 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-8 border border-[#D4AF37]/20 rounded-full px-5 py-2 bg-[#D4AF37]/5 backdrop-blur-md shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span> 
                {c('hero.tag', isZh ? '重装出海行业内参' : 'HEAVY EQUIPMENT EXPORT INSIGHTS')}
             </div>

             <h1 className="hero-title">
               {c('hero.title1', isZh ? '穿透迷雾，' : 'Cut the Fog, ')}<span className="text-[#D4AF37]">{c('hero.titleGold', isZh ? '掌握底牌。' : 'Own the Deal.')}</span>
             </h1>

             {/* 副标题 (Height Locked) */}
             <div className="w-full flex items-center justify-center min-h-[60px] md:min-h-[80px]">
               {isZh ? (
                 <div className="w-full text-gray-400 text-lg md:text-[21px] font-medium flex justify-between items-center opacity-90 max-w-[900px]">
                    {c('hero.desc', "跳出信息不对称的陷阱。出海工程师每周为您深度拆解二手重装采购防坑逻辑、维护要略与真实市场走势。").split('').map((char, index) => (
                      <span key={index}>{char}</span>
                    ))}
                 </div>
               ) : (
                 <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-3xl text-center mx-auto">
                   {c('hero.desc', "Escape the trap of information asymmetry. Our senior engineers deliver weekly teardowns on used machinery export strategies, maintenance essentials, and real market trends.")}
                 </p>
               )}
             </div>
         </div>
      </section>

      {/* 2. 主流资讯分类栏 (Glassmorphism Sticky Bar) */}
      <section className="w-full bg-white/80 backdrop-blur-xl border-b border-gray-100/50 sticky top-[80px] z-40 transition-all shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
           
           <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden w-full md:w-auto">
             <button className="whitespace-nowrap px-8 py-2.5 rounded-full bg-[#111111] text-white text-[12px] font-bold tracking-widest uppercase shadow-md transition-all">
              {c('list.tabAll', isZh ? '全部内参' : 'ALL INSIGHTS')}
             </button>
             <button className="whitespace-nowrap px-8 py-2.5 rounded-full bg-gray-50 text-gray-500 border border-gray-100 text-[12px] font-bold tracking-widest uppercase hover:bg-white hover:text-[#111111] hover:border-gray-200 hover:shadow-sm transition-all text-center">
              {c('list.tabGuides', isZh ? '采购避坑' : 'GUIDES')}
             </button>
             <button className="whitespace-nowrap px-8 py-2.5 rounded-full bg-gray-50 text-gray-500 border border-gray-100 text-[12px] font-bold tracking-widest uppercase hover:bg-white hover:text-[#111111] hover:border-gray-200 hover:shadow-sm transition-all text-center">
              {c('list.tabMaintenance', isZh ? '出海维保' : 'MAINTENANCE')}
             </button>
             <button className="whitespace-nowrap px-8 py-2.5 rounded-full bg-gray-50 text-gray-500 border border-gray-100 text-[12px] font-bold tracking-widest uppercase hover:bg-white hover:text-[#111111] hover:border-gray-200 hover:shadow-sm transition-all text-center">
              {c('list.tabReports', isZh ? '港口实录' : 'REPORTS')}
             </button>
           </div>
           
           {/* 图标栏圆润化 */}
           <div className="hidden lg:flex items-center gap-3 bg-gray-50 p-1.5 rounded-full border border-gray-100">
             <div className="p-2 rounded-full cursor-pointer hover:bg-white hover:shadow-sm transition-all text-gray-400 hover:text-[#111111]"><LayoutGrid size={18} /></div>
             <div className="p-2 rounded-full cursor-pointer bg-white shadow-sm text-[#111111]"><FileText size={18} /></div>
           </div>

        </div>
      </section>

      {/* 3. 高端资讯瀑布流 (Masonry/Grid Article Feed & Rounded Edge UI) */}
      <section className="w-full py-24 bg-[#FAFAFA]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-400 text-sm">{c('list.loadingText', isZh ? '加载中...' : 'Loading...')}</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="text-gray-400 text-lg font-bold">{c('list.emptyText', isZh ? '暂无文章' : 'No articles yet')}</p>
              <p className="text-gray-300 text-sm">{c('list.emptySubtext', isZh ? '敲定期待，数据将由后台发布' : 'Stay tuned, articles will be published from admin panel')}</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
            {articles.map((article, idx) => {
              const title = isZh ? (article.titleZh || article.title) : article.title;
              const summary = isZh ? (article.summaryZh || article.summary) : article.summary;
              const dateStr = article.publishedAt 
                ? new Date(article.publishedAt).toLocaleDateString(isZh ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()
                : '';
              return (
              <Link key={idx} href={`/insights/${article.slug}`} className="group flex flex-col cursor-pointer bg-white border border-gray-100 hover:border-[#D4AF37]/30 hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-500 rounded-3xl overflow-hidden shadow-sm">
                {/* 封面缩略图 */}
                <div className="relative w-full aspect-[16/11] bg-[#111111] overflow-hidden rounded-t-3xl border-b border-gray-100/50">
                   <div className="absolute inset-0 bg-black/5 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                   <Image src={article.coverImageUrl || '/images/insights/1.jpg'} alt={title} fill unoptimized className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 group-hover:-rotate-1 transition-all duration-700 ease-out" />
                   
                   {/* 悬浮强圆角类目标签 */}
                   <div className="absolute top-5 left-5 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.1)] border border-white/50">
                       <span className="text-[#111111] text-[10px] font-black uppercase tracking-[0.2em]">{article.category}</span>
                   </div>
                </div>

                {/* 文字主体 */}
                <div className="p-8 lg:p-10 flex-1 flex flex-col relative bg-white">
                  <div className="flex items-center gap-4 text-[11px] font-bold text-gray-400 tracking-[0.2em] uppercase mb-6">
                     <span>{dateStr}</span>
                     {article.readTime && (
                       <>
                         <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></span>
                         <span>{article.readTime}</span>
                       </>
                     )}
                  </div>
                  
                  <h3 className="text-xl md:text-[22px] font-black text-[#111111] group-hover:text-[#D4AF37] leading-[1.4] mb-5 transition-colors duration-300">
                    {title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm font-medium line-clamp-3 leading-relaxed mb-8 flex-1">
                    {summary}
                  </p>
                  
                  <div className="inline-flex items-center gap-3 text-[12px] font-bold tracking-[0.2em] uppercase text-[#111111] group-hover:text-[#D4AF37] transition-all mt-auto pt-6 border-t border-gray-100 group-hover:border-[#D4AF37]/20 w-max">
                    {c('list.readMoreBtn', isZh ? '阅读专业内参' : 'Read Full Report')} <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
          )}

          {/* Load More Action Button */}
          <div className="mt-28 text-center flex justify-center">
            <button className="h-[64px] px-14 rounded-full bg-[#111111] text-white text-[13px] font-black tracking-[0.2em] hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-300 shadow-[0_20px_40px_rgba(17,17,17,0.15)] hover:shadow-[0_15px_30px_rgba(212,175,55,0.3)] hover:-translate-y-1 flex items-center gap-4 group">
               {c('list.viewMoreBtn', isZh ? '获取更多行业背书记录' : 'Load More Insights')}
               <ArrowRight size={16} className="group-hover:translate-y-1 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

        </div>
      </section>
      
    </main>
  );
}
