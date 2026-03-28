'use client';
import { Send, CheckCircle2, ShieldCheck, Globe, Trophy, Award } from "lucide-react";
import { useLocale } from 'next-intl';
import { useInquirySubmit } from "@/hooks/useInquirySubmit";
import { usePageContent } from '@/hooks/usePageContent';

export default function AboutPage() {
  const locale = useLocale();
  const isZh = locale === 'zh';
  const { get: c } = usePageContent('about');
  const { submitState, submitMessage, handleSubmit } = useInquirySubmit({ source: "about-page-cta" });

  return (
    <main className="w-full bg-[#FAFAFA] pt-[72px]">
      {/* 1. 沉浸式企业愿景大图 (Corporate Hero Banner) */}
      <section className="relative w-full h-[450px] md:h-[500px] flex items-center justify-center bg-[#111111] overflow-hidden">
         {/* 背景暗纹蒙版与网格 */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
         <div className="absolute inset-0 opacity-60 bg-[url('/images/hero/about.png')] bg-cover bg-center pointer-events-none scale-105 active:scale-100 transition-transform duration-[10s]"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-[#111111]/10 pointer-events-none"></div>
         
         {/* 琥珀色微光 (Radiant Glow) */}
         <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D4AF37] opacity-[0.05] blur-[120px] rounded-full pointer-events-none"></div>
         <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#D4AF37] opacity-[0.03] blur-[150px] rounded-full pointer-events-none"></div>

         <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-[1100px] mx-auto text-center mt-4">
            
            {/* 顶部分类小提示 */}
            <div className="flex items-center justify-center gap-3 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-8 border border-[#D4AF37]/20 rounded-full px-5 py-2 bg-[#D4AF37]/5 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span> 
              {isZh ? c('hero.tag', '全球工程机械发运枢纽') : c('hero.tag', 'GLOBAL MACHINERY HUB')}
            </div>

            <h1 className="hero-title">
              {isZh ? c('hero.title1', '扎根上海，') : c('hero.title1', 'Rooted in Shanghai, ')}<span className="text-[#D4AF37]">{isZh ? c('hero.titleGold', '驱动全球。') : c('hero.titleGold', 'Global Reach.')}</span>
            </h1>

            {/* 副标题 (Height Locked) */}
            <div className="w-full flex items-center justify-center min-h-[60px] md:min-h-[80px]">
              {isZh ? (
                 <div className="w-full text-gray-400 text-lg md:text-[21px] font-medium flex justify-between items-center opacity-90 max-w-[900px]">
                    {c('hero.desc', '重塑二手工程机械出海领域的绝对信任标杆，严苛重金整备与出境质检，确保全球买家拿到顶尖实机。').split('').map((char: string, index: number) => (
                      <span key={index}>{char}</span>
                    ))}
                 </div>
              ) : (
                 <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-3xl text-center mx-auto">
                   {c('hero.desc', 'Reshaping the absolute trust benchmark in the global used heavy equipment supply chain, ensuring every buyer receives top-tier machines.')}
                 </p>
              )}
            </div>

         </div>
      </section>

      {/* 2. 实力档案 (The Scale & Story) */}
      <section className="w-full py-32 bg-[#FAFAFA] relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          
          <div className="flex flex-col gap-32">
            {/* Block A: 左图右文 - 现代化总库 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between group">
              <div className="w-full md:w-1/2 relative aspect-[4/3] rounded-3xl shadow-[-20px_20px_0_#EEEEEE] group-hover:shadow-[-20px_20px_0_#D4AF37] transition-all duration-500 overflow-hidden border border-gray-200">
                <img src="/images/about/office.jpg" alt="上海现代化总库" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
              <div className="w-full md:w-5/12 text-left mt-16 md:mt-0 relative md:pl-16">
                <h2 className="text-4xl md:text-5xl font-black text-[#111111] leading-tight tracking-tighter mb-8 pt-4">
                  {isZh ? c('blockA.title', '长三角核心 源头底库基地') : c('blockA.title', 'Core Yangtze Delta Base of Operations')}
                </h2>
                <p className="text-gray-500 leading-relaxed font-medium text-[15px] mb-6">
                  {c('blockA.p1', '自2003年起，我们深度扎根于具有全球航运统治力的上海港腹地。打造了拥有逾 2000平米 的现代化重装整备急库区，绝不倒买倒卖，坚持全仓纯实体现车。')}
                </p>
                <p className="text-gray-500 leading-relaxed font-medium text-[15px]">
                  {c('blockA.p2', '基地内置独立无尘液压车间与动力测试线。我们斥资汇聚业内尖端检测仪与退役资深工程师，确保所有经我们出海的卡特彼勒、小松、日立等重卡，拥有硬核的原厂级运转能力。')}
                </p>
                
                <ul className="mt-10 space-y-5">
                  <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 transition-colors hover:border-[#D4AF37]/30">
                     <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center shrink-0">
                        <CheckCircle2 className="text-[#D4AF37]" size={18} />
                     </div>
                     <span className="text-[#111111] font-black text-[15px]">{isZh ? c('blockA.check1', '全驱自营机械整备流水线') : c('blockA.check1', 'Fully self-operated overhaul assembly line')}</span>
                  </div>
                  <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 transition-colors hover:border-[#D4AF37]/30">
                     <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center shrink-0">
                        <CheckCircle2 className="text-[#D4AF37]" size={18} />
                     </div>
                     <span className="text-[#111111] font-black text-[15px]">{isZh ? c('blockA.check2', '深链大干线专属海运特权') : c('blockA.check2', 'Dedicated mainline shipping privileges')}</span>
                  </div>
                </ul>
              </div>
            </div>

            {/* Block B: 右图左文 - 全球声誉 */}
            <div className="relative flex flex-col md:flex-row-reverse items-center justify-between group">
              <div className="w-full md:w-1/2 relative aspect-[4/3] rounded-3xl shadow-[20px_20px_0_#EEEEEE] group-hover:shadow-[20px_20px_0_#111111] transition-all duration-500 overflow-hidden border border-gray-200">
                <img src="/images/about/yard.jpg" alt="全球机械停放阵列" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
              <div className="w-full md:w-5/12 text-left mt-16 md:mt-0 relative md:pr-16">
                <h2 className="text-4xl md:text-5xl font-black text-[#111111] leading-tight tracking-tighter mb-8 pt-4">
                  {isZh ? c('blockB.title', '跨越极限工况的 重载交付力') : c('blockB.title', 'Heavy-Duty Delivery Beyond Extreme Conditions')}
                </h2>
                <p className="text-gray-500 leading-relaxed font-medium text-[15px] mb-6">
                  {c('blockB.p1', '重载机械漂洋过海不是终点，矿山实操才是！我们的海外业务不仅仅是"卖单机器"，更是全生命周期的工业护航。')}
                </p>
                <p className="text-gray-500 leading-relaxed font-medium text-[15px]">
                  {c('blockB.p2', '至今，我们高密度地将成套编队级工程机械成功投送至印尼镍矿、秘鲁铜矿区、以及肯尼亚基建一线。以严苛的拒售翻新组装机的红线铁律，建立起跨国老客的绝对信任壁垒。')}
                </p>

                <div className="mt-10 grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all group/card overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#FAFAFA] rounded-bl-full -mr-4 -mt-4 transition-transform group-hover/card:scale-150"></div>
                    <h4 className="text-[#111111] font-black tracking-widest text-[13px] mb-3 uppercase relative z-10">{isZh ? c('blockB.card1.title', '绝不妥协的品控') : c('blockB.card1.title', 'Integrity & Mutual Benefit')}</h4>
                    <p className="text-gray-500 text-xs font-medium leading-relaxed relative z-10">{isZh ? c('blockB.card1.desc', '一票否决事故框架与火烧水淹，从物理源头捍卫商誉。') : c('blockB.card1.desc', 'We never trade in accident-damaged or rebuilt machines — our foundation is built on long-term partnerships worldwide.')}</p>
                  </div>
                  <div className="bg-[#111111] rounded-2xl border border-gray-800 p-6 hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)] transition-all group/card overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#1A1A1A] rounded-bl-full -mr-4 -mt-4 transition-transform group-hover/card:scale-150"></div>
                    <h4 className="text-[#D4AF37] font-black tracking-widest text-[13px] mb-3 uppercase relative z-10">{isZh ? c('blockB.card2.title', '云端穿洲排障') : c('blockB.card2.title', 'Service First')}</h4>
                    <p className="text-gray-400 text-xs font-medium leading-relaxed relative z-10">{isZh ? c('blockB.card2.desc', '首席技师无视时区差，跨洋视频连线硬核拆解指导。') : c('blockB.card2.desc', 'Dedicated engineers provide seamless maintenance support across all time zones.')}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. 核心硬实力数据条 (Milestone Data Strip) */}
      <section className="w-full py-24 bg-[#111111] relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
        <div className="max-w-[1440px] w-full px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center">
            
            <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
              <span className="text-5xl md:text-6xl font-black text-white mb-3">{c('stats.0.num', '20')}<span className="text-[#D4AF37]">+</span></span>
              <span className="text-gray-400 text-sm font-black tracking-widest uppercase">{isZh ? c('stats.0.label', '年出海行业深耕') : c('stats.0.label', 'Years in the Industry')}</span>
            </div>

            <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
              <span className="text-5xl md:text-6xl font-black text-white mb-3">{c('stats.1.num', '30')}<span className="text-[#D4AF37]">+</span></span>
              <span className="text-gray-400 text-sm font-black tracking-widest uppercase">{isZh ? c('stats.1.label', '支特派抢修梯队') : c('stats.1.label', 'Field Engineers Deployed')}</span>
            </div>

            <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
              <span className="text-5xl md:text-6xl font-black text-white mb-3">{c('stats.2.num', '50')}<span className="text-[#D4AF37]">+</span></span>
              <span className="text-gray-400 text-sm font-black tracking-widest uppercase">{isZh ? c('stats.2.label', '个矿建出海国家') : c('stats.2.label', 'Countries Reached')}</span>
            </div>

            <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
              <span className="text-5xl md:text-6xl font-black text-white mb-3">{c('stats.3.num', '3000')}<span className="text-[#D4AF37]">+</span></span>
              <span className="text-gray-400 text-sm font-black tracking-widest uppercase">{isZh ? c('stats.3.label', '台实体现车交付') : c('stats.3.label', 'Machines Safely Delivered')}</span>
            </div>

          </div>
        </div>
      </section>

      {/* 4. 全球准入资质墙 (Certification Grid) */}
      <section className="w-full py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-[#111111] tracking-tighter mb-6">{isZh ? '全球通行的重金属底气' : 'Our Industry Certifications'}</h2>
            <div className="w-12 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-gray-500 text-[15px] font-medium max-w-2xl mx-auto">{isZh ? '我们配备了最苛刻的第三方驻场验机标准与源产地报关资质矩阵，以强悍的官方背书秒杀清关屏障。' : 'We continually advance our production capabilities and quality control systems, supported by accredited inspection institutions and a globally recognized sales and service network.'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Cert 1 */}
            <div className="bg-[#FAFAFA] p-6 rounded-3xl border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[#D4AF37]/30 hover:-translate-y-2 transition-all duration-500 overflow-hidden relative group">
              <div className="w-14 h-14 bg-[#111111] rounded-2xl text-[#D4AF37] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <div className="w-full aspect-[4/3] rounded-2xl relative bg-white border border-gray-50 flex items-center justify-center overflow-hidden mb-6">
                <img src="/images/about/cert.jpg" alt="Verified Supplier Certificate" className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              </div>
              <div>
                <h4 className="text-[#111111] font-black text-lg tracking-wide mb-1">{isZh ? '重工溯源认证' : 'Verified Supplier'}</h4>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{isZh ? 'VERIFIED SUPPLIER' : 'TRADE ASSURANCE'}</p>
              </div>
            </div>

            {/* Cert 2 */}
            <div className="bg-[#FAFAFA] p-6 rounded-3xl border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[#D4AF37]/30 hover:-translate-y-2 transition-all duration-500 overflow-hidden relative group">
               <div className="w-14 h-14 bg-[#111111] rounded-2xl text-[#D4AF37] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe size={24} />
              </div>
              <div className="w-full aspect-[4/3] rounded-2xl relative bg-white border border-gray-50 flex items-center justify-center overflow-hidden mb-6">
                <img src="/images/about/cert.jpg" alt="CE Conformity Certificate" className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              </div>
              <div>
                <h4 className="text-[#111111] font-black text-lg tracking-wide mb-1">{isZh ? '欧盟通行准入' : 'CE Conformity'}</h4>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{isZh ? 'CE CONFORMITY' : 'EU MARKET ACCESS'}</p>
              </div>
            </div>

            {/* Cert 3 */}
            <div className="bg-[#FAFAFA] p-6 rounded-3xl border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[#D4AF37]/30 hover:-translate-y-2 transition-all duration-500 overflow-hidden relative group">
               <div className="w-14 h-14 bg-[#111111] rounded-2xl text-[#D4AF37] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy size={24} />
              </div>
              <div className="w-full aspect-[4/3] rounded-2xl relative bg-white border border-gray-50 flex items-center justify-center overflow-hidden mb-6">
                <img src="/images/about/cert.jpg" alt="ISO 9001 Certificate" className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              </div>
              <div>
                <h4 className="text-[#111111] font-black text-lg tracking-wide mb-1">{isZh ? '国际质控标准' : 'ISO 9001:2015'}</h4>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{isZh ? 'ISO 9001:2015' : 'QUALITY MANAGEMENT'}</p>
              </div>
            </div>

            {/* Cert 4 */}
            <div className="bg-[#FAFAFA] p-6 rounded-3xl border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[#D4AF37]/30 hover:-translate-y-2 transition-all duration-500 overflow-hidden relative group">
               <div className="w-14 h-14 bg-[#111111] rounded-2xl text-[#D4AF37] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award size={24} />
              </div>
              <div className="w-full aspect-[4/3] rounded-2xl relative bg-white border border-gray-50 flex items-center justify-center overflow-hidden mb-6">
                <img src="/images/about/cert.jpg" alt="SGS Inspection Report" className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              </div>
              <div>
                <h4 className="text-[#111111] font-black text-lg tracking-wide mb-1">{isZh ? '第三方驻场终检' : 'SGS Inspection'}</h4>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{isZh ? 'SGS INSPECTION' : 'THIRD-PARTY VERIFIED'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 底部统一步伐的询单区 (Identical Direct Conversion Layout - Dark Premium) */}
      <section className="w-full py-24 bg-[#111111] border-t border-white/5 relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
        
        <div className="max-w-[900px] mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6">
              {isZh ? '期待未来与您' : 'Looking Forward to'} <span className="text-[#D4AF37]">{isZh ? '极度密切联运' : 'Working With You'}</span>
            </h2>
            <p className="text-gray-400 text-sm font-medium">{isZh ? '填写需求型号与目标港口，12小时内获取极致竞争力的 CIF 出海到岸底价。' : 'Share your required model and operating conditions, and receive a highly competitive FOB / CIF ex-works price within 12 hours.'}</p>
          </div>

          <div className="bg-[#1A1A1A] p-10 md:p-14 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 mx-auto rounded-[32px] relative overflow-hidden">
             
             {/* 琥珀色高级氛围光晕 */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-[0.07] blur-[80px] rounded-full pointer-events-none"></div>

             <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-[#111111] rounded-2xl px-6 py-2 border border-white/5 focus-within:border-[#D4AF37]/40 focus-within:bg-[#000000] transition-all group">
                     <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mt-2 block">{isZh ? '您的称谓' : 'YOUR NAME'}</label>
                     <input name="name" type="text" placeholder={isZh ? '您的称呼' : 'Your Name'} className="w-full py-2 text-sm focus:outline-none bg-transparent font-medium text-white placeholder:text-gray-600" />
                   </div>
                   <div className="bg-[#111111] rounded-2xl px-6 py-2 border border-white/5 focus-within:border-[#D4AF37]/40 focus-within:bg-[#000000] transition-all group">
                     <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mt-2 block">{isZh ? '联系方式 (WhatsApp / 邮箱)' : 'CONTACT (WHATSAPP/EMAIL)'}</label>
                     <input name="contact" type="text" placeholder={isZh ? '联系方式' : 'Contact Details'} className="w-full py-2 text-sm focus:outline-none bg-transparent font-medium text-white placeholder:text-gray-600" />
                   </div>
                 </div>

                 <div className="bg-[#111111] rounded-2xl px-6 py-4 border border-white/5 focus-within:border-[#D4AF37]/40 focus-within:bg-[#000000] transition-all group">
                   <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2 block">{isZh ? '所需机型的极限工况与型号' : 'REQUIREMENTS'}</label>
                   <textarea name="message" placeholder={isZh ? '请描述您的意向厂矿机械型号与特殊发运需求...' : 'Message details (e.g., machine model required or company enquiry) *'} rows={4} className="w-full py-2 text-sm focus:outline-none bg-transparent resize-none font-medium text-white placeholder:text-gray-600"></textarea>
                 </div>

                 {submitMessage && (
                   <p className={`text-sm font-medium ${submitState === "success" ? "text-[#D4AF37]" : "text-red-400"}`}>
                     {submitMessage}
                   </p>
                 )}

                 <div className="flex flex-col sm:flex-row items-center gap-6 mt-6">
                   <div className="flex items-center gap-3 shrink-0 lg:mr-4">
                      <a href="https://wa.me/8615375319246" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-[#111111] border border-white/10 text-gray-500 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all duration-300 group shadow-sm" title="WhatsApp">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" className="group-hover:scale-110 transition-transform"><path d="M11.996 0a11.965 11.965 0 00-10.23 18.238L.044 24l6.012-1.632A11.968 11.968 0 1011.996 0zm6.657 17.244c-.266.75-1.523 1.455-2.107 1.517-.5.061-1.144.15-3.333-.762-2.646-1.096-4.35-3.805-4.48-4.004-.13-.198-1.071-1.423-1.071-2.716 0-1.291.674-1.924.912-2.19.239-.265.518-.33.69-.33.17 0 .343 0 .493.007.158.007.368-.06.574.4.215.474.721 1.777.786 1.909.066.133.111.288.026.467-.085.18-.129.294-.258.438-.13.14-.268.309-.387.433-.13.13-.264.276-.115.539.148.261.662 1.11 1.402 1.874.953.985 1.79 1.285 2.052 1.405.263.12.417.098.572-.078.155-.175.67-1.02.85-1.371.18-.35.358-.291.597-.197.24.093 1.517.714 1.776.843.256.13.43.193.493.302.062.108.062.631-.205 1.38z"/></svg>
                      </a>
                      <a href="#" className="w-14 h-14 rounded-full bg-[#111111] border border-white/10 text-gray-500 hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-all duration-300 group shadow-sm" title="LinkedIn">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" className="group-hover:scale-110 transition-transform"><path d="M22.23 0H1.77C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.008zM7.12 20.452H3.558V9h3.562v11.452zm-1.78-13.02c-1.144 0-2.065-.925-2.065-2.064 0-1.139.92-2.064 2.065-2.064 1.14 0 2.064.925 2.064 2.064 0 1.139-.924 2.064-2.064 2.064zm15.11 13.02h-3.553v-5.569c0-1.328-.027-3.037-1.852-3.037-1.854 0-2.136 1.445-2.136 2.939v5.667H9.354V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z"/></svg>
                      </a>
                      <a href="#" className="w-14 h-14 rounded-full bg-[#111111] border border-white/10 text-gray-500 hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-300 group shadow-sm" title="Facebook">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" className="group-hover:scale-110 transition-transform"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </a>
                   </div>

                   <button type="submit" disabled={submitState === "loading"} className="flex-1 w-full h-[60px] bg-[#D4AF37] text-[#111111] text-[13px] font-black tracking-[0.2em] uppercase hover:bg-white hover:text-black hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                     {submitState === "loading" ? (isZh ? '发送中...' : 'Sending...') : (isZh ? '立即获取 CIF 底价' : 'Send Enquiry Now')} <Send size={16} />
                   </button>
                 </div>
              </form>
          </div>
        </div>
      </section>

    </main>
  );
}
