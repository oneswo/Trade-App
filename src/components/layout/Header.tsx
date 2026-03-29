'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Link, usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { Search, Globe, ChevronDown, Home, Package, ShieldCheck, Lightbulb, Info, PhoneCall, X, Factory } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export default function Header() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const pathname = usePathname();
  const isZh = locale === 'zh';
  const { settings } = useSiteSettings();

  // 获取 Logo 文字
  const logoText = isZh ? settings.logoText : settings.logoTextEn;
  // 拆分 Logo 文字（中文前两字高亮，英文第一个单词高亮）
  const logoMain = isZh ? logoText.slice(0, 2) : logoText.split(' ')[0];
  const logoAccent = isZh ? logoText.slice(2) : logoText.split(' ').slice(1).join(' ');

  const navItems = [
    { label: isZh ? '首页' : 'Home', href: '/', icon: Home },
    { label: isZh ? '产品' : 'Equipment', href: '/products', icon: Package },
    { label: isZh ? '服务' : 'Services', href: '/services', icon: ShieldCheck },
    { label: isZh ? '智库' : 'Insights', href: '/insights', icon: Lightbulb },
    { label: isZh ? '关于' : 'About', href: '/about', icon: Info },
    { label: isZh ? '联系' : 'Contact', href: '/contact', icon: PhoneCall }
  ];

  // 监听点击外部关闭大区语言面板
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-2xl border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-8 h-[72px] flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#111111] to-[#2A2A2A] shadow-md transition-transform group-hover:scale-105 overflow-hidden">
            {settings.logoImageUrl ? (
              <Image width={36} height={36} unoptimized src={settings.logoImageUrl} alt={logoText} className="h-full w-full object-contain" />
            ) : (
              <Factory size={20} className="text-[#D4AF37]" strokeWidth={2.5} />
            )}
          </div>
          <span className="text-[22px] font-bold tracking-widest text-[#111111]">
            {logoMain}<span className="text-[#D4AF37]">{logoAccent}</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.label} 
                href={item.href as `/${string}`} 
                className="group flex items-center gap-2 rounded-full px-4 py-2 text-[15px] font-medium text-[#2D333A] transition-all duration-300 hover:bg-[#D4AF37] hover:text-white hover:shadow-lg hover:shadow-[#D4AF37]/30"
              >
                <Icon size={17} strokeWidth={2} className="text-[#9CA3AF] transition-colors group-hover:text-white" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Tools & Socials */}
        <div className="flex items-center gap-6">


          <button className="text-[#111111] hover:text-[#D4AF37] transition-colors">
            <Search size={18} strokeWidth={2.5} />
          </button>
          
          <div 
            onClick={() => setIsLangOpen(true)}
            className="flex items-center gap-1.5 cursor-pointer text-[#111111] hover:text-[#D4AF37] transition-colors drop-shadow-sm"
          >
            <Globe size={18} strokeWidth={2} />
            <span className="text-[14px] font-semibold tracking-wider">{locale.toUpperCase()}</span>
            <ChevronDown size={14} strokeWidth={2} />
          </div>

          <button 
             onClick={() => window.dispatchEvent(new Event('open-inquiry-modal'))}
             className="hidden md:block bg-[#111111] text-white text-[14px] font-semibold tracking-widest px-7 py-2.5 rounded-full hover:bg-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300"
          >
            {isZh ? '立即询价' : 'Get a Quote'}
          </button>
        </div>
      </div>
    </header>

      {/* 居中全屏多语言弹窗 (Centered Global Language Modal - Moved outside header to escape backdrop-filter containing block constraint) */}
      <div className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300 ${isLangOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* 背景模糊遮罩 */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsLangOpen(false)}></div>
        
        {/* 弹窗主体 */}
        <div className={`relative w-[95vw] max-w-[850px] bg-[#FAFAFA] rounded-md shadow-[0_40px_80px_rgba(0,0,0,0.5)] transition-all duration-500 transform ${isLangOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
           
           {/* Modal Header */}
           <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between bg-white rounded-t-md relative z-10">
              <div>
               <h3 className="text-xl md:text-2xl font-black text-[#111111] tracking-tighter flex items-center gap-2">
                  <Globe size={24} className="text-[#D4AF37] hidden md:block"/> 
                  {isZh ? '选择您的语言与地区' : 'Select language / region'}
                </h3>
              </div>
              <button 
                onClick={() => setIsLangOpen(false)} 
                className="w-10 h-10 bg-gray-50 border border-gray-200 hover:border-[#111111] hover:bg-[#111111] hover:text-white text-[#111111] rounded-full flex items-center justify-center transition-colors"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
           </div>
           
           {/* Modal Body: Flag Grid */}
           <div className="p-4 md:p-6 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 max-h-[75vh] overflow-y-auto">
             {[
               { flag: "🇨🇳", lang: "简体中文", code: "zh", active: true },
               { flag: "🇬🇧", lang: "English", code: "en", active: true },
               { flag: "🇪🇸", lang: "Español", code: "es", active: false },
               { flag: "🇫🇷", lang: "Français", code: "fr", active: false },
               { flag: "🇷🇺", lang: "Русский", code: "ru", active: false },
               { flag: "🇩🇪", lang: "Deutsch", code: "de", active: false },
               { flag: "🇵🇹", lang: "Português", code: "pt", active: false },
               { flag: "🇸🇦", lang: "العربية", code: "ar", active: false },
               { flag: "🇮🇹", lang: "Italiano", code: "it", active: false },
               { flag: "🇮🇩", lang: "Indonesia", code: "id", active: false },
               { flag: "🇻🇳", lang: "Tiếng Việt", code: "vi", active: false },
               { flag: "🇹🇭", lang: "ภาษาไทย", code: "th", active: false },
               { flag: "🇿🇦", lang: "Afrikaans", code: "af", active: false },
               { flag: "🇯🇵", lang: "日本語", code: "ja", active: false },
               { flag: "🇰🇷", lang: "한국어", code: "ko", active: false },
             ].map((item, idx) => {
               const isCurrent = item.code === locale;
               return (
                 <Link 
                   key={idx} 
                   href={item.active ? pathname : "#"}
                   locale={item.active ? (item.code as "en" | "zh") : undefined}
                   onClick={(e) => {
                     if (!item.active) { e.preventDefault(); return; }
                     setIsLangOpen(false);
                   }}
                   className={`
                     p-4 flex flex-col items-center justify-center gap-3 rounded-md relative overflow-hidden transition-all duration-300
                     ${item.active 
                        ? 'bg-white border border-gray-200 hover:border-[#111111] hover:shadow-[0_10px_20px_rgba(0,0,0,0.05)] group' 
                        : 'bg-white border border-gray-200 cursor-not-allowed'
                     }
                   `}
                 >
                   {/* 维护中 Tag */}
                   {!item.active && (
                     <div className="absolute top-2 right-2 flex items-center">
                       <span className="text-[9px] font-bold bg-amber-50 text-[#D4AF37] border border-[#D4AF37]/30 px-1.5 py-0.5 rounded-sm tracking-widest shadow-sm">
                         {isZh ? '更新中' : 'UPDATING'}
                       </span>
                     </div>
                   )}

                   {/* Active Status Indicator */}
                   {isCurrent && (
                     <div className="absolute top-0 left-0 w-full h-[3px] bg-[#D4AF37]"></div>
                   )}

                   <span className={`text-3xl md:text-4xl drop-shadow-sm transition-transform ${item.active ? 'group-hover:scale-110' : 'opacity-40 grayscale-[60%]'}`}>
                     {item.flag}
                   </span>
                   <span className={`text-[11px] md:text-[13px] font-bold transition-colors 
                     ${isCurrent ? 'text-[#D4AF37]' : item.active ? 'text-gray-500 group-hover:text-[#111111]' : 'text-gray-300'}
                   `}>
                     {item.lang}
                   </span>
                 </Link>
               );
             })}
           </div>

        </div>
      </div>
    </>
  );
}
