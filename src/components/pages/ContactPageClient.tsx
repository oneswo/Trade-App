'use client';
import Image from 'next/image';
import { MapPin, Mail, Clock, HeadphonesIcon } from 'lucide-react';
import { useLocale } from 'next-intl';
import { usePageContent } from '@/hooks/usePageContent';

export default function ContactPageClient({
  initialContent,
}: {
  initialContent?: Record<string, string> | null;
}) {
  const locale = useLocale();
  const isZh = locale === 'zh';
  const { get: c } = usePageContent('contact', initialContent);
  const contactEmail = c('info.email', '15156888267@163.com');
  const contactPhone = c('info.phone', '+86 17321077956');
  const contactPhoneForTel = contactPhone.replace(/\s/g, '');
  const heroBgImage = c('hero.bgImage', '');

  return (
    <main className="w-full bg-[#FAFAFA] pt-[72px]">
      
      {/* 0. 沉浸式企业愿景大图 (Contact Hero Banner) */}
      <section className="relative w-full h-[450px] md:h-[500px] flex items-center justify-center bg-[#111111] overflow-hidden">
         {/* 背景暗纹蒙版与网格 */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
         <div className="absolute inset-0 opacity-60 bg-cover bg-center pointer-events-none scale-105 active:scale-100 transition-transform duration-[10s]" style={heroBgImage ? { backgroundImage: `url('${heroBgImage}')` } : undefined}></div>
         <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-[#111111]/10 pointer-events-none"></div>
         
         {/* 琥珀色微光 (Radiant Glow) */}
         <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D4AF37] opacity-[0.05] blur-[120px] rounded-full pointer-events-none"></div>
         <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#D4AF37] opacity-[0.03] blur-[150px] rounded-full pointer-events-none"></div>

         <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-[1100px] mx-auto text-center mt-4">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs font-bold tracking-[0.2em] text-[#D4AF37] mb-8 uppercase">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span> 
              {c('hero.tag', isZh ? '全球二手重装直发中心' : 'GLOBAL SALES & DISPATCH CENTER')}
            </div>

            <h1 className={`hero-title ${isZh ? 'hero-zh' : 'hero-en'}`}>
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
                    <h4 className="font-bold text-lg mb-2 text-white">{c('info.addrTitle', isZh ? '上海总部与调度中枢' : 'Shanghai HQ & Dispatch Hub')}</h4>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                      {isZh ? c('info.addrZh', '中国上海市奉贤区金海公路6055号') : c('info.addrEn', 'No. 6055 Jinhai Road, Fengxian District')}<br/>
                      {c('info.addrNote', isZh ? '(紧邻重载特大型滚装海运枢纽)' : 'Shanghai, China (Adjacent to RO-RO Port)')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-[#1A1A1A] border border-white/5 flex items-center justify-center rounded-2xl shrink-0 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all duration-300">
                    <Mail className="text-[#D4AF37] group-hover:text-[#111111] transition-colors" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-white">{c('info.emailTitle', isZh ? '全系底库报价专线' : 'Quotation Hotline')}</h4>
                    <a href={`mailto:${contactEmail}`} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm font-bold tracking-widest uppercase block mb-1">
                      {contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-[#1A1A1A] border border-white/5 flex items-center justify-center rounded-2xl shrink-0 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all duration-300">
                    <HeadphonesIcon className="text-[#D4AF37] group-hover:text-[#111111] transition-colors" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-white">{c('info.phoneTitle', isZh ? '24小时全球技术抢修部' : '24/7 Technical Support')}</h4>
                    <a href={`tel:${contactPhoneForTel}`} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm font-bold tracking-widest uppercase block mb-1">
                      {contactPhone}
                    </a>
                    <p className="text-[#D4AF37]/60 text-[10px] font-bold uppercase tracking-widest mt-1">{c('info.supportNote', isZh ? '支持全时区实时连线 / 视频排障' : 'Live Video Support Across All Time Zones')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-[#1A1A1A] border border-white/5 flex items-center justify-center rounded-2xl shrink-0 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all duration-300">
                    <Clock className="text-[#D4AF37] group-hover:text-[#111111] transition-colors" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-white">{c('info.hoursTitle', isZh ? '营业时间' : 'Business Hours')}</h4>
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
                    <span className="text-[#D4AF37] text-sm font-black tracking-widest mb-1">{c('map.bubbleTitle', isZh ? '中国机械 亚太调度中枢' : 'KXTJ Machinery HQ')}</span>
                    <span className="text-gray-400 text-[10px] tracking-[0.15em] uppercase">{c('map.bubbleSubtitle', 'Shanghai Global Base')}</span>
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
            <h2 className="text-4xl md:text-5xl font-black text-[#111111] tracking-tighter mb-6">{c('team.sectionTitle', isZh ? '直连大洲业务总控' : 'Direct Regional Contacts')}</h2>
            <div className="w-12 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-gray-500 text-sm font-medium">{c('team.sectionDesc', isZh ? '跳过漫长的转接等待。我们根据全球大洲划分了独立的业务战区，随时接管您的专线询盘。' : 'Skip the long waiting queue. Our regional teams are divided by continent, ready to handle your inquiries directly.')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {([
              { photo: '', zh_name: '尹世兵',  en_name: 'Steven Yin', zh_title: '亚太区执行董事',  en_title: 'APAC Executive Director', defaultPhone: '+8615156888267' },
              { photo: '', zh_name: '尹洪峰',  en_name: 'Frank Yin',  zh_title: '拉非高级代办',    en_title: 'LATAM & Africa Lead',      defaultPhone: '+8619159103568' },
              { photo: '', zh_name: '安娜·李', en_name: 'Anna Li',    zh_title: '欧亚中东总监',    en_title: 'EU & MENA Director',       defaultPhone: '+8617321077956' },
              { photo: '', zh_name: '安妮',    en_name: 'Annie',      zh_title: '泛西非大区专员',  en_title: 'West Africa Specialist',   defaultPhone: '+8617317763969' },
            ] as const).map((m, i) => {
              const phone = c(`team.${i}.phone`, m.defaultPhone).replace(/\s/g, '');
              const displayPhone = c(`team.${i}.phone`, m.defaultPhone);
              const photo = c(`team.${i}.photo`, '');
              const displayName = c(`team.${i}.name`, isZh ? m.zh_name : m.en_name);
              return (
                <div key={i} className="bg-[#FAFAFA] p-8 rounded-3xl border border-gray-100 hover:border-[#D4AF37] hover:shadow-[0_20px_40px_rgba(212,175,55,0.08)] hover:-translate-y-2 transition-all duration-500 group flex flex-col items-center text-center relative overflow-hidden">
                  <div className="w-24 h-24 rounded-[32px] bg-white border border-gray-100 flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500 relative z-10 overflow-hidden ring-4 ring-white">
                    {photo ? (
                      <Image fill unoptimized src={photo} alt={displayName} className="object-cover" />
                    ) : (
                      <span className="text-xl font-black text-[#111111]">{displayName.slice(0, 1)}</span>
                    )}
                  </div>
                  <h3 className="text-3xl font-black text-[#111111] mb-3 relative z-10 tracking-tight">{displayName}</h3>
                  <p className="text-[#D4AF37] text-sm font-bold uppercase tracking-[0.1em] mb-8 relative z-10">{c(`team.${i}.title`, isZh ? m.zh_title : m.en_title)}</p>

                  <div className="w-full space-y-4 text-left border-t border-gray-200 pt-6 relative z-10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">{c('team.directLineLabel', isZh ? '专线直驳' : 'Direct Line')}</span>
                      <a href={`tel:${phone}`} className="text-[#111111] font-black hover:text-[#D4AF37] transition-colors">{displayPhone}</a>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">{c('team.whatsappLabel', 'WhatsApp')}</span>
                      <a href={`https://wa.me/${phone.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="text-[#111111] font-black hover:text-[#D4AF37] transition-colors">{displayPhone}</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </main>
  );
}
