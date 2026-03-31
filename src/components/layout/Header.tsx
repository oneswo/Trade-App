'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Link, usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { Search, Globe, ChevronDown, Home, Package, ShieldCheck, Lightbulb, Info, PhoneCall, X, Factory, Menu } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { SUPPORTED_LOCALES, LOCALE_FLAGS, LOCALE_LABELS, isSupportedLocale, type SupportedLocale } from '@/lib/i18n/locales';

export default function Header() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const pathname = usePathname();
  const isZh = locale === 'zh';
  const { settings } = useSiteSettings();

  // 路由变化时关闭移动菜单
  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  // 获取 Logo 文字
  const logoText = isZh ? settings.logoText : settings.logoTextEn;
  // 拆分 Logo 文字（中文前两字高亮，英文第一个单词高亮）
  const logoMain = isZh ? logoText.slice(0, 2) : logoText.split(' ')[0];
  const logoAccent = isZh ? logoText.slice(2) : logoText.split(' ').slice(1).join(' ');

  useEffect(() => {
    document.title = isZh ? settings.siteName : settings.siteNameEn;
  }, [isZh, settings.siteName, settings.siteNameEn]);

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
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-[72px] flex items-center justify-between">
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

        {/* Right Tools */}
        <div className="flex items-center gap-3 sm:gap-5">
          <button className="text-[#111111] hover:text-[#D4AF37] transition-colors">
            <Search size={18} strokeWidth={2.5} />
          </button>

          <div
            onClick={() => setIsLangOpen(true)}
            className="flex items-center gap-1 cursor-pointer text-[#111111] hover:text-[#D4AF37] transition-colors"
          >
            <Globe size={17} strokeWidth={2} />
            <span className="text-[13px] font-semibold tracking-wider hidden sm:inline">{locale.toUpperCase()}</span>
            <ChevronDown size={13} strokeWidth={2} />
          </div>

          <button
            onClick={() => window.dispatchEvent(new Event('open-inquiry-modal'))}
            className="hidden md:block bg-[#111111] text-white text-[14px] font-semibold tracking-widest px-6 py-2.5 rounded-full hover:bg-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300"
          >
            {isZh ? '立即询价' : 'Get a Quote'}
          </button>

          {/* 汉堡按钮 — 仅 < lg 可见 */}
          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-[#111111] hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="打开菜单"
          >
            <Menu size={22} strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>

    {/* 移动端全屏抽屉菜单 */}
    {isMobileMenuOpen && (
      <div className="fixed inset-0 z-[9998] lg:hidden">
        {/* 背景遮罩 */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        {/* 抽屉面板 */}
        <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl flex flex-col">
          {/* 抽屉头部 */}
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-gray-100">
            <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#111111] to-[#2A2A2A] overflow-hidden">
                {settings.logoImageUrl
                  ? <Image width={32} height={32} unoptimized src={settings.logoImageUrl} alt={logoText} className="h-full w-full object-contain" />
                  : <Factory size={17} className="text-[#D4AF37]" strokeWidth={2.5} />}
              </div>
              <span className="text-[18px] font-bold tracking-wider text-[#111111]">
                {logoMain}<span className="text-[#D4AF37]">{logoAccent}</span>
              </span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-[#111111] hover:bg-gray-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* 导航列表 */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href as `/${string}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl mb-1 text-[15px] font-semibold transition-all ${
                    isActive
                      ? 'bg-[#111111] text-white'
                      : 'text-[#2D333A] hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} strokeWidth={2} className={isActive ? 'text-[#D4AF37]' : 'text-gray-400'} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* 底部询价按钮 */}
          <div className="p-4 border-t border-gray-100 space-y-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.dispatchEvent(new Event('open-inquiry-modal'));
              }}
              className="w-full bg-[#111111] text-white text-[14px] font-bold tracking-widest py-4 rounded-xl hover:bg-[#D4AF37] transition-all"
            >
              {isZh ? '立即询价' : 'Get a Quote'}
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); setIsLangOpen(true); }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-[13px] font-semibold text-[#111111] hover:border-[#111111] transition-all"
            >
              <Globe size={15} />
              {isZh ? '切换语言' : 'Change Language'}
            </button>
          </div>
        </div>
      </div>
    )}

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
            {[...SUPPORTED_LOCALES].map((code) => {
              const isCurrent = code === locale;
               return (
                 <Link 
                  key={code}
                  href={pathname}
                  locale={code}
                  onClick={(e) => {
                    if (!isSupportedLocale(code)) { e.preventDefault(); return; }
                     setIsLangOpen(false);
                   }}
                   className={`
                     p-4 flex flex-col items-center justify-center gap-3 rounded-md relative overflow-hidden transition-all duration-300
                    bg-white border border-gray-200 hover:border-[#111111] hover:shadow-[0_10px_20px_rgba(0,0,0,0.05)] group
                   `}
                 >
                   {/* Active Status Indicator */}
                   {isCurrent && (
                     <div className="absolute top-0 left-0 w-full h-[3px] bg-[#D4AF37]"></div>
                   )}

                  <span className="text-3xl md:text-4xl drop-shadow-sm transition-transform group-hover:scale-110">
                    {LOCALE_FLAGS[code as SupportedLocale]}
                   </span>
                   <span className={`text-[11px] md:text-[13px] font-bold transition-colors 
                    ${isCurrent ? 'text-[#D4AF37]' : 'text-gray-500 group-hover:text-[#111111]'}
                   `}>
                    {LOCALE_LABELS[code as SupportedLocale]}
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
