'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { MapPin, Mail, Clock, HeadphonesIcon, Pause, Play, Volume2, VolumeX } from 'lucide-react';
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
  const companyVideoUrl = c('media.videoUrl', '');
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !companyVideoUrl) return;

    const playPromise = video.play();
    if (playPromise) {
      playPromise
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  }, [companyVideoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
  }, [muted]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
      return;
    }

    video.pause();
    setPlaying(false);
  };

  const toggleMuted = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !muted;
    video.muted = nextMuted;
    setMuted(nextMuted);
  };

  return (
    <main className="w-full bg-[#FAFAFA] pt-[72px]">

      {/* 1. 总部航点与核心联络网 (Headquarters & Direct Lines) */}
      <section className="w-full py-6 md:py-24 bg-[#FAFAFA] relative">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:min-h-[600px] rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.08)] md:shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-gray-200">

            {/* Left: Info Center */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center p-6 md:p-20 bg-[#111111] text-white">
              <h1 className="text-2xl md:text-5xl font-black tracking-tighter mb-4 md:mb-8 leading-tight pt-0 md:pt-4">
                {c('info.hqTitle', isZh ? '全域出海调度中心' : 'Global Dispatch Center')}
              </h1>
              <p className="text-gray-400 text-[13px] md:text-[15px] font-medium leading-relaxed max-w-md mb-6 md:mb-12">
                 {c('info.hqDesc', isZh ? '无视时区差与洲际屏障。我们的国际贸易工程师将在 12 小时内为您响应跨洋货单、极致型号垂询与实机验车请求。' : 'We transcend time zones and continental barriers. Our international trade engineers respond within 12 hours to cross-border orders, specification inquiries, and live machine inspection requests.')}
              </p>

              <div className="flex flex-col gap-5 md:gap-10">
                <div className="flex items-start gap-4 md:gap-6 group">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1A1A1A] border border-white/5 flex items-center justify-center rounded-xl md:rounded-2xl shrink-0 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all duration-300">
                    <MapPin className="text-[#D4AF37] group-hover:text-[#111111] transition-colors w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm md:text-lg mb-1 md:mb-2 text-white">{c('info.addrTitle', isZh ? '上海总部与调度中枢' : 'Shanghai HQ & Dispatch Hub')}</h4>
                    <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed">
                      {isZh ? c('info.addrZh', '中国上海市奉贤区金海公路6055号') : c('info.addrEn', 'No. 6055 Jinhai Road, Fengxian District')}<br/>
                      {c('info.addrNote', isZh ? '(紧邻重载特大型滚装海运枢纽)' : 'Shanghai, China (Adjacent to RO-RO Port)')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 md:gap-6 group">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1A1A1A] border border-white/5 flex items-center justify-center rounded-xl md:rounded-2xl shrink-0 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all duration-300">
                    <Mail className="text-[#D4AF37] group-hover:text-[#111111] transition-colors w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm md:text-lg mb-1 md:mb-2 text-white">{c('info.emailTitle', isZh ? '全系底库报价专线' : 'Quotation Hotline')}</h4>
                    <a href={`mailto:${contactEmail}`} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-xs md:text-sm font-bold tracking-widest uppercase block mb-1">
                      {contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 md:gap-6 group">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1A1A1A] border border-white/5 flex items-center justify-center rounded-xl md:rounded-2xl shrink-0 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all duration-300">
                    <HeadphonesIcon className="text-[#D4AF37] group-hover:text-[#111111] transition-colors w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm md:text-lg mb-1 md:mb-2 text-white">{c('info.phoneTitle', isZh ? '24小时全球技术抢修部' : '24/7 Technical Support')}</h4>
                    <a href={`tel:${contactPhoneForTel}`} className="text-gray-400 hover:text-[#D4AF37] transition-colors text-xs md:text-sm font-bold tracking-widest uppercase block mb-1">
                      {contactPhone}
                    </a>
                    <p className="text-[#D4AF37]/60 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-1">{c('info.supportNote', isZh ? '支持全时区实时连线 / 视频排障' : 'Live Video Support Across All Time Zones')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 md:gap-6 group">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1A1A1A] border border-white/5 flex items-center justify-center rounded-xl md:rounded-2xl shrink-0 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all duration-300">
                    <Clock className="text-[#D4AF37] group-hover:text-[#111111] transition-colors w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm md:text-lg mb-1 md:mb-2 text-white">{c('info.hoursTitle', isZh ? '营业时间' : 'Business Hours')}</h4>
                    <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed max-w-md">
                      {c('info.hours', isZh ? '周一至周六 09:00 - 18:00 (UTC+8)，紧急询盘 24小时响应' : 'Mon–Sat 09:00–18:00 UTC+8, emergency inquiries answered 24/7')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 公司介绍视频 */}
            <div className="w-full lg:w-[55%] relative min-h-[260px] lg:min-h-full bg-[#0B0B0B] overflow-hidden">
              {companyVideoUrl ? (
                <>
                  <video
                    ref={videoRef}
                    src={companyVideoUrl}
                    autoPlay
                    muted={muted}
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover"
                    aria-label={isZh ? '公司介绍视频' : 'Company introduction video'}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                  >
                    {isZh ? '当前浏览器不支持视频播放。' : 'Your browser does not support video playback.'}
                  </video>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute bottom-4 right-4 md:bottom-5 md:right-5 z-10 flex items-center gap-2 md:gap-3">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
                      aria-label={playing ? (isZh ? '暂停视频' : 'Pause video') : (isZh ? '播放视频' : 'Play video')}
                    >
                      {playing ? <Pause size={16} className="fill-white md:[&]:w-[18px] md:[&]:h-[18px]" /> : <Play size={16} className="fill-white ml-0.5 md:[&]:w-[18px] md:[&]:h-[18px]" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMuted}
                      className="flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
                      aria-label={muted ? (isZh ? '开启声音' : 'Unmute video') : (isZh ? '静音视频' : 'Mute video')}
                    >
                      {muted ? <VolumeX size={16} className="md:[&]:w-[18px] md:[&]:h-[18px]" /> : <Volume2 size={16} className="md:[&]:w-[18px] md:[&]:h-[18px]" />}
                    </button>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.18),_transparent_45%),linear-gradient(180deg,_#151515_0%,_#090909_100%)] px-6 md:px-8 text-center">
                  <div className="max-w-md">
                    <span className="mb-3 md:mb-4 inline-flex rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1.5 md:px-4 md:py-2 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
                      {isZh ? 'Company Video' : 'Company Video'}
                    </span>
                    <h3 className="mb-2 md:mb-3 text-xl md:text-3xl font-black tracking-tight text-white">
                      {isZh ? '企业介绍视频待上传' : 'Company Video Coming Soon'}
                    </h3>
                    <p className="text-xs md:text-sm font-medium leading-relaxed text-gray-400">
                      {isZh
                        ? '后台上传公司介绍视频后，这里会自动替换为最新内容。'
                        : 'Upload a company introduction video in the CMS and it will appear here automatically.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 2. 全球大区执行特派员 (Executive Connect Reps) */}
      <section id="sales-team" className="w-full py-10 md:py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-8 md:mb-20">
            <h2 className="text-2xl md:text-5xl font-black text-[#111111] tracking-tighter mb-4 md:mb-6">{c('team.sectionTitle', isZh ? '直连大洲业务总控' : 'Direct Regional Contacts')}</h2>
            <div className="w-12 h-1 bg-[#D4AF37] mx-auto mb-4 md:mb-6"></div>
            <p className="text-gray-500 text-xs md:text-sm font-medium">{c('team.sectionDesc', isZh ? '跳过漫长的转接等待。我们根据全球大洲划分了独立的业务战区，随时接管您的专线询盘。' : 'Skip the long waiting queue. Our regional teams are divided by continent, ready to handle your inquiries directly.')}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
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
                <div key={i} className="bg-[#FAFAFA] p-4 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 hover:border-[#D4AF37] hover:shadow-[0_20px_40px_rgba(212,175,55,0.08)] hover:-translate-y-2 transition-all duration-500 group flex flex-col items-center text-center relative overflow-hidden">
                  <div className="w-14 h-14 md:w-24 md:h-24 rounded-2xl md:rounded-[32px] bg-white border border-gray-100 flex items-center justify-center mb-3 md:mb-6 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500 relative z-10 overflow-hidden ring-2 md:ring-4 ring-white">
                    {photo ? (
                      <Image fill unoptimized src={photo} alt={displayName} className="object-cover" />
                    ) : (
                      <span className="text-base md:text-xl font-black text-[#111111]">{displayName.slice(0, 1)}</span>
                    )}
                  </div>
                  <h3 className="text-lg md:text-3xl font-black text-[#111111] mb-1 md:mb-3 relative z-10 tracking-tight">{displayName}</h3>
                  <p className="text-[#D4AF37] text-[10px] md:text-sm font-bold uppercase tracking-[0.05em] md:tracking-[0.1em] mb-4 md:mb-8 relative z-10">{c(`team.${i}.title`, isZh ? m.zh_title : m.en_title)}</p>

                  <div className="w-full space-y-2 md:space-y-4 text-left border-t border-gray-200 pt-3 md:pt-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between text-xs md:text-sm">
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">{isZh ? '专线电话' : 'Direct Line'}</span>
                      <a href={`tel:${phone}`} className="text-[#111111] font-black hover:text-[#D4AF37] transition-colors text-[11px] md:text-sm">{displayPhone}</a>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between text-xs md:text-sm">
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">WhatsApp</span>
                      <a href={`https://wa.me/${phone.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="text-[#111111] font-black hover:text-[#D4AF37] transition-colors text-[11px] md:text-sm">{displayPhone}</a>
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
