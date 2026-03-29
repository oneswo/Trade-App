'use client';
import Image from 'next/image';
import { MapPin, Mail, Clock, Send, HeadphonesIcon } from 'lucide-react';
import { useInquirySubmit } from "@/hooks/useInquirySubmit";
import { useLocale } from 'next-intl';
import { usePageContent } from '@/hooks/usePageContent';

export default function ContactPage() {
  const locale = useLocale();
  const isZh = locale === 'zh';
  const { get: c } = usePageContent('contact');
  const { submitState, submitMessage, handleSubmit } = useInquirySubmit({
    source: "contact-page-form",
  });

  return (
    <main className="w-full bg-[#FAFAFA] pt-[72px]">
      
      {/* 0. 沉浸式企业愿景大图 (Contact Hero Banner) */}
      <section className="relative w-full h-[450px] md:h-[500px] flex items-center justify-center bg-[#111111] overflow-hidden">
         {/* 背景暗纹蒙版与网格 */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
         <div className="absolute inset-0 opacity-60 bg-cover bg-center pointer-events-none scale-105 active:scale-100 transition-transform duration-[10s]" style={{ backgroundImage: `url('${c('hero.bgImage', '/images/hero/contact.png')}')` }}></div>
         <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-[#111111]/10 pointer-events-none"></div>
         
         {/* 琥珀色微光 (Radiant Glow) */}
         <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D4AF37] opacity-[0.05] blur-[120px] rounded-full pointer-events-none"></div>
         <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#D4AF37] opacity-[0.03] blur-[150px] rounded-full pointer-events-none"></div>

         <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-[1100px] mx-auto text-center mt-4">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs font-bold tracking-[0.2em] text-[#D4AF37] mb-8 uppercase">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span> 
              {c('hero.tag', isZh ? '全球二手重装直发中心' : 'GLOBAL SALES & DISPATCH CENTER')}
            </div>

            <h1 className="hero-title">
              {c('hero.title1', isZh ? '全球联络，' : 'Global Reach, ')}<span className="text-[#D4AF37]">{c('hero.titleGold', isZh ? '极速调度。' : 'Swift Dispatch.')}</span>
            </h1>

            {/* 副标题 (Height Locked) */}
            <div className="w-full flex items-center justify-center min-h-[60px] md:min-h-[80px]">
              <p className="text-gray-400 text-base sm:text-lg md:text-[21px] font-medium opacity-90 max-w-[900px] text-center leading-relaxed">
                {isZh
                  ? c('hero.desc', '无论您身处哪一大洲的矿场机位，我们的特派工程师将提供 24 小时跨洋直连，为您敲定源头底价与专属航运配额。')
                  : c('hero.desc', 'Wherever your mining operation is located, our dedicated engineers provide 24/7 cross-border support to secure factory pricing and exclusive shipping allocations.')}
              </p>
            </div>
         </div>
      </section>

      {/* 1. 总部航点与核心联络网 (Headquarters & Direct Lines) */}
      <section className="w-full py-16 md:py-32 bg-[#FAFAFA] relative">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row min-h-[600px] rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-gray-200">
            
            {/* Left: Info Center */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center p-12 md:p-20 bg-[#111111] text-white">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 leading-tight pt-4">
                {c('info.hqTitle', isZh ? '全域出海调度中心' : 'Global Dispatch Center')}
              </h1>
              <p className="text-gray-400 text-[15px] font-medium leading-relaxed max-w-md mb-12">
                 {c('info.hqDesc', isZh ? '无视时区差与洲际屏障。我们的国际贸易工程师将在 12 小时内为您响应跨洋货单、极致型号垂询与实机验车请求。' : 'We transcend time zones and continental barriers. Our international trade engineers respond within 12 hours to cross-border orders, specification inquiries, and live machine inspection requests.')}
              </p>

              <div className="flex flex-col gap-10">
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-[#1A1A1A] border border-white/5 flex items-center justify-center rounded-2xl shrink-0 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all duration-300">
                    <MapPin className="text-[#D4AF37] group-hover:text-[#111111] transition-colors" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-white">{isZh ? '上海总部与调度中枢' : 'Shanghai HQ & Dispatch Hub'}</h4>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                      {isZh ? c('info.addrZh', '中国上海市奉贤区金海公路6055号') : c('info.addrEn', 'No. 6055 Jinhai Road, Fengxian District')}<br/>
                      {isZh ? '(紧邻重载特大型滚装海运枢纽)' : 'Shanghai, China (Adjacent to RO-RO Port)'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-[#1A1A1A] border border-white/5 flex items-center justify-center rounded-2xl shrink-0 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all duration-300">
                    <Mail className="text-[#D4AF37] group-hover:text-[#111111] transition-colors" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-white">{isZh ? '全系底库报价专线' : 'Quotation Hotline'}</h4>
                    <a href="mailto:15156888267@163.com" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm font-bold tracking-widest uppercase block mb-1">
                      {c('info.email', '15156888267@163.com')}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-[#1A1A1A] border border-white/5 flex items-center justify-center rounded-2xl shrink-0 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all duration-300">
                    <HeadphonesIcon className="text-[#D4AF37] group-hover:text-[#111111] transition-colors" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-white">{isZh ? '24小时全球技术抢修部' : '24/7 Technical Support'}</h4>
                    <a href="tel:+8617321077956" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm font-bold tracking-widest uppercase block mb-1">
                      {c('info.phone', '+86 17321077956')}
                    </a>
                    <p className="text-[#D4AF37]/60 text-[10px] font-bold uppercase tracking-widest mt-1">{isZh ? '支持全时区实时连线 / 视频排障' : 'Live Video Support Across All Time Zones'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-[#1A1A1A] border border-white/5 flex items-center justify-center rounded-2xl shrink-0 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all duration-300">
                    <Clock className="text-[#D4AF37] group-hover:text-[#111111] transition-colors" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-white">{isZh ? '营业时间' : 'Business Hours'}</h4>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-md">
                      {c('info.hours', isZh ? '周一至周六 09:00 - 18:00 (UTC+8)，紧急询盘 24小时响应' : 'Mon–Sat 09:00–18:00 UTC+8, emergency inquiries answered 24/7')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 实景真实交互地图 (锁定上海宏观视角以避开丑陋原生弹窗，加上自定悬浮气泡) */}
            <div className="w-full lg:w-[55%] relative group min-h-[400px] lg:min-h-full bg-gray-100 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none group-hover:opacity-0 transition-opacity duration-500 bg-black/5 z-10"></div>
              
              <iframe 
                src="https://maps.google.com/maps?q=上海市&t=&z=10&ie=UTF8&iwloc=near&output=embed&hl=zh-CN" 
                width="100%" 
                height="100%" 
                style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[40%] contrast-[110%] group-hover:grayscale-0 transition-all duration-[1500ms] pointer-events-none"
              ></iframe>

              {/* 中央自定义高端定位气泡 (替代谷歌原生白框的纯净展现) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[130%] z-20 pointer-events-none flex flex-col items-center">
                 <div className="bg-[#111111] text-white px-6 py-4 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/5 flex flex-col items-center relative z-10">
                    <span className="text-[#D4AF37] text-sm font-black tracking-widest mb-1">{isZh ? '中国机械 亚太调度中枢' : 'KXTJ Machinery HQ'}</span>
                    <span className="text-gray-400 text-[10px] tracking-[0.15em] uppercase">Shanghai Global Base</span>
                 </div>
                 {/* 向下的指示尖角 */}
                 <div className="w-5 h-5 bg-[#111111] rotate-45 -mt-2.5 border-b border-r border-white/5 shadow-xl"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. 全球大区执行特派员 (Executive Connect Reps) */}
      <section id="sales-team" className="w-full py-16 md:py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[#111111] tracking-tighter mb-6">{isZh ? '直连大洲业务总控' : 'Direct Regional Contacts'}</h2>
            <div className="w-12 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-gray-500 text-sm font-medium">{isZh ? '跳过漫长的转接等待。我们根据全球大洲划分了独立的业务战区，随时接管您的专线询盘。' : 'Skip the long waiting queue. Our regional teams are divided by continent, ready to handle your inquiries directly.'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {([
              { photo: '/images/avatars/yin.png',  zh_name: '尹世兵',  en_name: 'Steven Yin', zh_title: '亚太区执行董事',  en_title: 'APAC Executive Director', defaultPhone: '+8615156888267' },
              { photo: '/images/avatars/hong.png', zh_name: '尹洪峰',  en_name: 'Frank Yin',  zh_title: '拉非高级代办',    en_title: 'LATAM & Africa Lead',      defaultPhone: '+8619159103568' },
              { photo: '/images/avatars/anna.png', zh_name: '安娜·李', en_name: 'Anna Li',    zh_title: '欧亚中东总监',    en_title: 'EU & MENA Director',       defaultPhone: '+8617321077956' },
              { photo: '/images/avatars/annie.png',zh_name: '安妮',    en_name: 'Annie',      zh_title: '泛西非大区专员',  en_title: 'West Africa Specialist',   defaultPhone: '+8617317763969' },
            ] as const).map((m, i) => {
              const phone = c(`team.${i}.phone`, m.defaultPhone).replace(/\s/g, '');
              const displayPhone = c(`team.${i}.phone`, m.defaultPhone);
              return (
                <div key={i} className="bg-[#FAFAFA] p-8 rounded-3xl border border-gray-100 hover:border-[#D4AF37] hover:shadow-[0_20px_40px_rgba(212,175,55,0.08)] hover:-translate-y-2 transition-all duration-500 group flex flex-col items-center text-center relative overflow-hidden">
                  <div className="w-24 h-24 rounded-[32px] bg-white border border-gray-100 flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500 relative z-10 overflow-hidden ring-4 ring-white">
                    <Image fill unoptimized src={c(`team.${i}.photo`, m.photo)} alt={c(`team.${i}.name`, isZh ? m.zh_name : m.en_name)} className="object-cover" />
                  </div>
                  <h3 className="text-3xl font-black text-[#111111] mb-3 relative z-10 tracking-tight">{c(`team.${i}.name`, isZh ? m.zh_name : m.en_name)}</h3>
                  <p className="text-[#D4AF37] text-sm font-bold uppercase tracking-[0.1em] mb-8 relative z-10">{c(`team.${i}.title`, isZh ? m.zh_title : m.en_title)}</p>

                  <div className="w-full space-y-4 text-left border-t border-gray-200 pt-6 relative z-10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">{isZh ? '专线直驳' : 'Direct Line'}</span>
                      <a href={`tel:${phone}`} className="text-[#111111] font-black hover:text-[#D4AF37] transition-colors">{displayPhone}</a>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">WhatsApp</span>
                      <a href={`https://wa.me/${phone.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="text-[#111111] font-black hover:text-[#D4AF37] transition-colors">{displayPhone}</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. 底部终极收网表单 (Direct Inquiry Line) */}
      <section className="w-full py-24 bg-[#111111] border-t border-white/5 relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
        
        <div className="max-w-[900px] mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6">{isZh ? '即刻开启您的' : 'Start Your'} <span className="text-[#D4AF37]">{isZh ? '重装之行' : 'Heavy Equipment Journey'}</span></h2>
            <p className="text-gray-400 text-sm font-medium">{isZh ? '只需在联系表格中留下您的电子件或电话，我们即可向您发送各大厂牌机皇底价和私密库存表。' : 'Simply leave your email or phone number, and we will send you the best prices on top brands and exclusive inventory lists.'}</p>
          </div>

          <div className="bg-[#1A1A1A] p-10 md:p-14 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 mx-auto rounded-[32px] relative overflow-hidden">
             
             {/* 琥珀色高级氛围光晕 */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-[0.07] blur-[80px] rounded-full pointer-events-none"></div>

             <form className="flex flex-col gap-6 relative z-10" onSubmit={handleSubmit}>
                 <input
                   type="text"
                   name="website"
                   autoComplete="off"
                   tabIndex={-1}
                   className="hidden"
                   aria-hidden="true"
                 />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-[#111111] rounded-2xl px-6 py-2 border border-white/5 focus-within:border-[#D4AF37]/40 focus-within:bg-[#000000] transition-all group">
                     <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mt-2 block">{isZh ? '您的称谓' : 'YOUR NAME'}</label>
                     <input name="name" required type="text" placeholder={isZh ? '您的姓名 *' : 'Full Name *'} className="w-full py-2 text-sm focus:outline-none bg-transparent font-medium text-white placeholder:text-gray-600" />
                   </div>
                   <div className="bg-[#111111] rounded-2xl px-6 py-2 border border-white/5 focus-within:border-[#D4AF37]/40 focus-within:bg-[#000000] transition-all group">
                     <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mt-2 block">{isZh ? '联系方式 (WhatsApp / 邮箱)' : 'CONTACT (WHATSAPP/EMAIL)'}</label>
                     <input name="contact" required type="text" placeholder={isZh ? '电子邮箱或 WhatsApp *' : 'Email or WhatsApp *'} className="w-full py-2 text-sm focus:outline-none bg-transparent font-medium text-white placeholder:text-gray-600" />
                   </div>
                 </div>
                 
                 <div className="bg-[#111111] rounded-2xl px-6 py-4 border border-white/5 focus-within:border-[#D4AF37]/40 focus-within:bg-[#000000] transition-all group">
                   <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2 block">{isZh ? '所需机型的极限工况与型号' : 'REQUIREMENTS'}</label>
                   <textarea name="message" required placeholder={isZh ? '您需要哪些型号的重装机械报价? (例如: 需要三一 36C 挖掘机发往西非) *' : 'Which models do you need quotes for? (e.g. SANY 36C excavator to West Africa) *'} rows={4} className="w-full py-2 text-sm focus:outline-none bg-transparent resize-none font-medium text-white placeholder:text-gray-600"></textarea>
                 </div>

                 {submitMessage && (
                   <p className={`text-[13px] font-bold tracking-wide mt-2 px-2 ${submitState === "success" ? "text-[#D4AF37]" : "text-red-400"}`}>
                     {submitMessage}
                   </p>
                 )}
                 
                 <div className="flex flex-col sm:flex-row items-center gap-6 mt-6">
                   <div className="flex items-center gap-3 shrink-0 lg:mr-4">
                      <a href="https://wa.me/8615156888267" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-[#111111] border border-white/10 text-gray-500 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all duration-300 group shadow-sm" title="WhatsApp">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" className="group-hover:scale-110 transition-transform"><path d="M11.996 0a11.965 11.965 0 00-10.23 18.238L.044 24l6.012-1.632A11.968 11.968 0 1011.996 0zm6.657 17.244c-.266.75-1.523 1.455-2.107 1.517-.5.061-1.144.15-3.333-.762-2.646-1.096-4.35-3.805-4.48-4.004-.13-.198-1.071-1.423-1.071-2.716 0-1.291.674-1.924.912-2.19.239-.265.518-.33.69-.33.17 0 .343 0 .493.007.158.007.368-.06.574.4.215.474.721 1.777.786 1.909.066.133.111.288.026.467-.085.18-.129.294-.258.438-.13.14-.268.309-.387.433-.13.13-.264.276-.115.539.148.261.662 1.11 1.402 1.874.953.985 1.79 1.285 2.052 1.405.263.12.417.098.572-.078.155-.175.67-1.02.85-1.371.18-.35.358-.291.597-.197.24.093 1.517.714 1.776.843.256.13.43.193.493.302.062.108.062.631-.205 1.38z"/></svg>
                      </a>
                      <a href="#" className="w-14 h-14 rounded-full bg-[#111111] border border-white/10 text-gray-500 hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-all duration-300 group shadow-sm" title="LinkedIn">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" className="group-hover:scale-110 transition-transform"><path d="M22.23 0H1.77C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.008zM7.12 20.452H3.558V9h3.562v11.452zm-1.78-13.02c-1.144 0-2.065-.925-2.065-2.064 0-1.139.92-2.064 2.065-2.064 1.14 0 2.064.925 2.064 2.064 0 1.139-.924 2.064-2.064 2.064zm15.11 13.02h-3.553v-5.569c0-1.328-.027-3.037-1.852-3.037-1.854 0-2.136 1.445-2.136 2.939v5.667H9.354V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z"/></svg>
                      </a>
                      <a href="#" className="w-14 h-14 rounded-full bg-[#111111] border border-white/10 text-gray-500 hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-300 group shadow-sm" title="Facebook">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" className="group-hover:scale-110 transition-transform"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </a>
                   </div>
                   
                   <button
                     type="submit"
                     disabled={submitState === "loading"}
                     className="flex-1 w-full h-[60px] bg-[#D4AF37] text-[#111111] text-[13px] font-black tracking-[0.2em] uppercase hover:bg-white hover:text-black hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed"
                   >
                     {submitState === "loading" ? (isZh ? '提 交 中 ...' : 'SUBMITTING...') : (isZh ? '立即获取 CIF 底价' : 'GET CIF PRICE NOW')} <Send size={16} />
                   </button>
                 </div>
              </form>
          </div>
        </div>
      </section>

    </main>
  );
}
