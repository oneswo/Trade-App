"use client";
import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';

export default function Footer() {
  const locale = useLocale();
  const isZh = locale === 'zh';
  const { settings } = useSiteSettings();
  const { categories } = useCategories();
  const { brands } = useBrands();

  const footerCategories = categories.filter(c => c.enabled).slice(0, 6);
  const footerBrands = brands.slice(0, 6);

  // 获取 Logo 文字
  const logoText = isZh ? settings.logoText : settings.logoTextEn;
  // 版权信息
  const copyrightCompany = isZh ? settings.copyrightText : settings.copyrightTextEn;
  // 地址
  const address = isZh ? settings.contactAddress : settings.contactAddressEn;

  // 社交媒体图标配置
  const socialLinks = [
    { 
      name: "X", 
      url: settings.socialX,
      icon: <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>, 
      hover: "hover:bg-white hover:text-black" 
    },
    { 
      name: "Instagram", 
      url: settings.socialInstagram,
      icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>, 
      hover: "hover:bg-[#E1306C] hover:text-white" 
    },
    { 
      name: "Facebook", 
      url: settings.socialFacebook,
      icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>, 
      hover: "hover:bg-[#1877F2] hover:text-white" 
    },
    { 
      name: "YouTube", 
      url: settings.socialYoutube,
      icon: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>, 
      hover: "hover:bg-[#FF0000] hover:text-white" 
    },
    { 
      name: "TikTok", 
      url: settings.socialTiktok,
      icon: <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.26-.92 4.54-2.58 5.84-1.74 1.36-4.08 1.95-6.19 1.4-2.19-.57-4.05-2.08-4.9-4.14-.86-2.07-.74-4.5.3-6.42 1.05-1.92 2.97-3.32 5.1-3.72 1.25-.23 2.54-.15 3.77.16v4.06c-.84-.2-1.73-.24-2.56-.05-1.39.31-2.6 1.48-3.02 2.82-.44 1.36-.2 2.93.63 4.07.82 1.11 2.27 1.66 3.63 1.49 1.43-.18 2.66-1.31 3.05-2.67.24-.85.19-1.75.19-2.63V.02z"/>, 
      hover: "hover:bg-[#FFF] hover:text-black" 
    },
    { 
      name: "LinkedIn", 
      url: settings.socialLinkedin,
      icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>, 
      hover: "hover:bg-[#0A66C2] hover:text-white" 
    },
  ].filter(item => item.url); // 只显示有链接的社交媒体

  return (
    <footer className="w-full bg-[#111111] text-white pt-16 pb-8 border-t border-[#222]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-10">
          
          {/* Col 1: Brand & Contact Info */}
          <div className="lg:col-span-4 pr-8">
            <Link href="/" className="inline-block mb-10">
              <span className="text-4xl font-black tracking-tighter text-white">
                {logoText}
              </span>
            </Link>
            
            <div className="flex flex-col gap-4 text-sm text-gray-400 font-medium mb-8">
              <p className="flex items-center gap-4">
                <span className="text-gray-500 w-20">{isZh ? '联系人:' : 'Contact:'}</span> 
                {settings.contactName}
              </p>
              <p className="flex items-center gap-4">
                <span className="text-gray-500 w-20">{isZh ? '电话:' : 'Phone:'}</span> 
                <a href={`tel:${settings.contactPhone.replace(/\s/g, '')}`} className="hover:text-white transition-colors cursor-pointer">
                  {settings.contactPhone}
                </a>
              </p>
              <p className="flex items-center gap-4">
                <span className="text-gray-500 w-20">{isZh ? '邮箱:' : 'Email:'}</span> 
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition-colors cursor-pointer">
                  {settings.contactEmail}
                </a>
              </p>
              <p className="flex items-center gap-4">
                <span className="text-gray-500 w-20">WhatsApp:</span> 
                <a href={`https://wa.me/${settings.contactWhatsApp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors cursor-pointer">
                  {settings.contactWhatsApp}
                </a>
              </p>
              <p className="flex items-start gap-4 leading-relaxed">
                <span className="text-gray-500 w-20 shrink-0">{isZh ? '公司地址:' : 'Address:'}</span> 
                <span>{address}</span>
              </p>
            </div>

            {/* Circular Social Icons */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a 
                    key={social.name} 
                    href={social.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full bg-[#222222] flex items-center justify-center text-gray-400 border border-gray-800 ${social.hover} transition-all duration-300 hover:scale-110`} 
                    title={social.name}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">{social.icon}</svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 lg:col-start-7">
            <h4 className="text-sm font-bold text-white mb-8 tracking-widest uppercase">{isZh ? '快速链接' : 'Quick Links'}</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400 font-medium">
              <li><Link href="/" className="hover:text-[#D4AF37] transition-colors">{isZh ? '主页' : 'Home'}</Link></li>
              <li><Link href="/products" className="hover:text-[#D4AF37] transition-colors">{isZh ? '找设备' : 'Equipment'}</Link></li>
              <li>
                <Link href={"/contact#sales-team" as `/${string}`} className="hover:text-[#D4AF37] transition-colors">
                  {isZh ? '联系销售代表' : 'Contact Sales'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Brands（动态从已发布产品提取，最多 6 个） */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white mb-8 tracking-widest uppercase">{isZh ? '品牌矩阵' : 'Brands'}</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400 font-medium">
              {footerBrands.length > 0
                ? footerBrands.map(brand => (
                    <li key={brand}>
                      <Link href={`/products?brand=${encodeURIComponent(brand)}` as `/${string}`} className="hover:text-[#D4AF37] transition-colors">
                        {brand}
                      </Link>
                    </li>
                  ))
                : <li className="text-gray-600 text-xs">{isZh ? '暂无品牌数据' : 'No brands yet'}</li>
              }
            </ul>
          </div>

          {/* Col 4: Categories（动态从分类表读取，最多 6 个） */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white mb-8 tracking-widest uppercase">{isZh ? '核心类目' : 'Categories'}</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400 font-medium">
              {footerCategories.length > 0
                ? footerCategories.map(cat => (
                    <li key={cat.slug}>
                      <Link href={`/products?category=${encodeURIComponent(cat.slug)}` as `/${string}`} className="hover:text-[#D4AF37] transition-colors">
                        {isZh ? cat.nameZh : cat.nameEn}
                      </Link>
                    </li>
                  ))
                : <li className="text-gray-600 text-xs">{isZh ? '暂无分类数据' : 'No categories yet'}</li>
              }
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#222222] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-bold text-gray-600 tracking-widest uppercase">
          <p>
            {isZh ? '版权所有' : 'Copyright'} © {new Date().getFullYear()} {copyrightCompany} | {' '}
            <a href={`https://${settings.copyrightUrl.replace(/^https?:\/\//, '')}`} className="hover:text-gray-400">
              {settings.copyrightUrl}
            </a>
          </p>
          <div className="flex items-center gap-6">
             <Link href="#" className="hover:text-gray-400 transition-colors">{isZh ? '隐私条款' : 'Privacy Policy'}</Link>
             <Link href="#" className="hover:text-gray-400 transition-colors">{isZh ? '服务政策' : 'Terms of Service'}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
