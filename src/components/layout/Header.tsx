'use client';
import { useState, useRef, useEffect } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { Globe, ChevronDown, Home, Package, ShieldCheck, Info, PhoneCall, X, Menu } from 'lucide-react';
import { useSiteSettings, type SiteSettings } from '@/hooks/useSiteSettings';
import { SUPPORTED_LOCALES, LOCALE_FLAGS, LOCALE_LABELS, isSupportedLocale, type SupportedLocale } from '@/lib/i18n/locales';
import { openInquiryModal } from '@/lib/inquiries/modal';

function HeaderLogo({
  logoText,
  logoImageUrl,
  textClassName,
  imageClassName,
  imageElementClassName,
}: {
  logoText: string;
  logoImageUrl: string | null;
  textClassName: string;
  imageClassName: string;
  imageElementClassName: string;
}) {
  const [brokenLogoUrl, setBrokenLogoUrl] = useState<string | null>(null);

  if (logoImageUrl && brokenLogoUrl !== logoImageUrl) {
    return (
      <>
        <div className={`flex items-center ${imageClassName}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoImageUrl}
            alt={`${logoText} logo`}
            className={imageElementClassName}
            onError={() => setBrokenLogoUrl(logoImageUrl)}
          />
        </div>
        <span
          className={textClassName}
          style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" }}
        >
          {logoText.toUpperCase()}
        </span>
      </>
    );
  }

  return (
    <>
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#111110]">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-[#F5C842]">
          <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z"/>
        </svg>
      </div>
      <span
        className={textClassName}
        style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" }}
      >
        {logoText.toUpperCase()}
      </span>
    </>
  );
}

export default function Header({ initialSettings }: { initialSettings?: SiteSettings | null }) {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const pathname = usePathname();
  const isZh = locale === 'zh';
  const { settings } = useSiteSettings(initialSettings);

  // 获取 Logo 文字
  const logoText = isZh ? settings.logoText : settings.logoTextEn;

  useEffect(() => {
    document.title = isZh ? settings.siteName : settings.siteNameEn;
  }, [isZh, settings.siteName, settings.siteNameEn]);

  const navItems = [
    { label: isZh ? '首页' : 'Home', href: '/', icon: Home },
    { label: isZh ? '产品' : 'Products', href: '/products', icon: Package },
    { label: isZh ? '服务' : 'Services', href: '/services', icon: ShieldCheck },
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
      <header className="sticky top-0 w-full z-[100] bg-white border-b border-[#D8D6CF]">
      <div className="px-6 sm:px-[60px] h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <HeaderLogo
            logoText={logoText}
            logoImageUrl={settings.logoImageUrl}
            textClassName="text-[26px] tracking-[0.08em] text-[#111110]"
            imageClassName="h-10 shrink-0"
            imageElementClassName="block h-full w-auto max-w-[84px] sm:max-w-[116px] object-contain object-left"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href as `/${string}`}
                className="group flex items-center gap-2 px-4 py-2 rounded-full text-[15px] font-medium text-[#3A3A38] tracking-[0.02em] transition-all duration-200 hover:bg-[#C8960A] hover:text-white"
                style={{ fontFamily: "var(--font-dm), 'DM Sans', sans-serif" }}
              >
                <Icon size={16} strokeWidth={2} className="transition-colors group-hover:text-white" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Tools */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div
            onClick={() => setIsLangOpen(true)}
            className="flex items-center gap-1 cursor-pointer text-[#3A3A38] hover:text-[#111110] transition-colors"
          >
            <Globe size={16} strokeWidth={2} />
            <span className="text-[13px] font-medium tracking-wider hidden sm:inline">{locale.toUpperCase()}</span>
            <ChevronDown size={12} strokeWidth={2} />
          </div>

          <button
            onClick={openInquiryModal}
            className="hidden md:block bg-[#111110] text-white text-[12px] font-semibold tracking-[0.08em] uppercase px-[22px] py-2.5 rounded-full hover:bg-[#C8960A] transition-colors duration-200"
          >
            {isZh ? '立即询价' : 'Get a Quote'}
          </button>

          {/* 汉堡按钮 — 仅 < lg 可见 */}
          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-md text-[#111110] hover:bg-gray-100 transition-colors"
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
            <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsMobileMenuOpen(false)}>
              <HeaderLogo
                logoText={logoText}
                logoImageUrl={settings.logoImageUrl}
                textClassName="text-[18px] tracking-[0.08em] text-[#111110]"
                imageClassName="h-9 shrink-0"
                imageElementClassName="block h-full w-auto max-w-[78px] object-contain object-left"
              />
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
                openInquiryModal();
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

      {/* 精致小型多语言弹窗 */}
      {isLangOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-in fade-in duration-150">
          {/* 背景遮罩 */}
          <div className="absolute inset-0 bg-black/35" onClick={() => setIsLangOpen(false)} />
          
          {/* 弹窗主体 */}
          <div 
            ref={langRef}
            className="relative bg-white rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.2)] animate-in fade-in slide-in-from-bottom-2 duration-150"
          >
          {/* 内容区 */}
          <div className="px-6 pt-5 pb-6">
            {/* 标题 */}
            <div className="flex items-center gap-2 mb-5">
              <Globe size={18} className="text-[#C8960A]" />
              <span className="text-[15px] font-bold text-[#111110] tracking-tight">
                {isZh ? '选择语言' : 'Language'}
              </span>
            </div>

            {/* 语言选项 - 横向排列 */}
            <div className="flex gap-3">
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
                      flex items-center gap-2.5 px-4 py-2.5 rounded-full transition-all duration-200
                      ${isCurrent 
                        ? 'bg-[#111110] text-white' 
                        : 'bg-[#F6F4F0] text-[#3A3A38] hover:bg-[#EDECEA]'
                      }
                    `}
                  >
                    <span className="text-lg">
                      {LOCALE_FLAGS[code as SupportedLocale]}
                    </span>
                    <span className={`text-[13px] font-semibold ${isCurrent ? 'text-white' : ''}`}>
                      {LOCALE_LABELS[code as SupportedLocale]}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        </div>
      )}
    </>
  );
}
