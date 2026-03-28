'use client';
import { useState, useRef, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { Search, Globe, ChevronDown, Home, Package, ShieldCheck, Lightbulb, Info, PhoneCall, Check, X, Factory } from 'lucide-react';

export default function Header() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

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
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#111111] to-[#2A2A2A] shadow-md transition-transform group-hover:scale-105">
            <Factory size={20} className="text-[#D4AF37]" strokeWidth={2.5} />
          </div>
          <span className="text-[22px] font-bold tracking-widest text-[#111111]">
            中国<span className="text-[#D4AF37]">机械</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {[
            { label: '首页', href: '/', icon: Home },
            { label: '产品', href: '/products', icon: Package },
            { label: '服务', href: '/services', icon: ShieldCheck },
            { label: '智库', href: '/insights', icon: Lightbulb },
            { label: '关于', href: '/about', icon: Info },
            { label: '联系', href: '/contact', icon: PhoneCall }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.label} 
                href={item.href} 
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
            <span className="text-[14px] font-semibold tracking-wider">ZH</span>
            <ChevronDown size={14} strokeWidth={2} />
          </div>

          <button 
             onClick={() => window.dispatchEvent(new Event('open-inquiry-modal'))}
             className="hidden md:block bg-[#111111] text-white text-[14px] font-semibold tracking-widest px-7 py-2.5 rounded-full hover:bg-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300"
          >
            立即询价
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
                  选择您的语言与地区
                </h3>
                <p className="text-gray-500 font-bold text-[10px] md:text-xs uppercase tracking-widest mt-1">Select your preferred language / region</p>
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
               { flag: "🇨🇳", lang: "简体中文" },
               { flag: "🇬🇧", lang: "English" },
               { flag: "🇪🇸", lang: "Español" },
               { flag: "🇫🇷", lang: "Français" },
               { flag: "🇷🇺", lang: "Русский" },
               { flag: "🇩🇪", lang: "Deutsch" },
               { flag: "🇵🇹", lang: "Português" },
               { flag: "🇸🇦", lang: "العربية" },
               { flag: "🇮🇹", lang: "Italiano" },
               { flag: "🇮🇩", lang: "Indonesia" },
               { flag: "🇻🇳", lang: "Tiếng Việt" },
               { flag: "🇹🇭", lang: "ภาษาไทย" },
               { flag: "🇿🇦", lang: "Afrikaans" },
               { flag: "🇯🇵", lang: "日本語" },
               { flag: "🇰🇷", lang: "한국어" },
             ].map((item, idx) => (
               <a key={idx} href="#" className="bg-white border border-gray-200 p-4 flex flex-col items-center justify-center gap-3 hover:border-[#111111] hover:shadow-[0_10px_20px_rgba(0,0,0,0.05)] transition-all duration-300 group rounded-md relative overflow-hidden">
                 {/* Active Status Mock */}
                 {item.lang === "简体中文" && (
                   <div className="absolute top-0 left-0 w-full h-[3px] bg-[#D4AF37]"></div>
                 )}
                 <span className="text-3xl md:text-4xl drop-shadow-sm group-hover:scale-110 transition-transform">{item.flag}</span>
                 <span className={`text-[11px] md:text-[13px] font-bold transition-colors ${item.lang === "简体中文" ? "text-[#D4AF37]" : "text-gray-500 group-hover:text-[#111111]"}`}>
                   {item.lang}
                 </span>
               </a>
             ))}
           </div>

        </div>
      </div>
    </>
  );
}
