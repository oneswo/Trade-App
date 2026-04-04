"use client";
import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { useSiteSettings, type SiteSettings } from '@/hooks/useSiteSettings';
import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';

export default function Footer({ initialSettings }: { initialSettings?: SiteSettings | null }) {
  const locale = useLocale();
  const isZh = locale === 'zh';
  const { settings } = useSiteSettings(initialSettings);
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

  return (
    <footer className="w-full bg-[#1E1E1C] text-white pt-10 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pt-14 md:pt-16 md:pb-8 border-t border-[#3A3A38]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-12 lg:gap-8 mb-8 lg:mb-10">
          
          {/* Col 1: Brand & Contact Info */}
          <div className="lg:col-span-4 lg:pr-8 border-b border-[#3A3A38]/80 pb-8 lg:border-0 lg:pb-0">
            <Link href="/" className="inline-block mb-6 md:mb-10">
              <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-white">
                {logoText}
              </span>
            </Link>
            
            <div className="flex flex-col gap-3 sm:gap-4 text-sm sm:text-[15px] text-[#9A9A94] font-medium">
              <p className="flex flex-row items-start gap-2 sm:items-baseline sm:gap-4">
                <span className="text-[#7A7A74] text-[13px] sm:text-[15px] w-16 sm:w-20 shrink-0">{isZh ? '联系人:' : 'Contact:'}</span>
                <span className="min-w-0 break-words text-[13px] sm:text-[15px]">{settings.contactName}</span>
              </p>
              <p className="flex flex-row items-start gap-2 sm:items-baseline sm:gap-4">
                <span className="text-[#7A7A74] text-[13px] sm:text-[15px] w-16 sm:w-20 shrink-0">{isZh ? '电话:' : 'Phone:'}</span>
                <span className="min-w-0 break-words text-[13px] sm:text-[15px]">{settings.contactPhone}</span>
              </p>
              <p className="flex flex-row items-start gap-2 sm:items-baseline sm:gap-4">
                <span className="text-[#7A7A74] text-[13px] sm:text-[15px] w-16 sm:w-20 shrink-0">{isZh ? '邮箱:' : 'Email:'}</span>
                <span className="min-w-0 break-all text-[13px] sm:text-[15px]">{settings.contactEmail}</span>
              </p>
              <p className="flex flex-row items-start gap-2 sm:items-baseline sm:gap-4">
                <span className="text-[#7A7A74] text-[13px] sm:text-[15px] w-16 sm:w-20 shrink-0">WhatsApp:</span>
                <span className="min-w-0 break-words text-[13px] sm:text-[15px]">{settings.contactWhatsApp}</span>
              </p>
              <p className="flex flex-row items-start gap-2 sm:items-start sm:gap-4 leading-relaxed">
                <span className="text-[#7A7A74] text-[13px] sm:text-[15px] w-16 sm:w-20 shrink-0">{isZh ? '公司地址:' : 'Address:'}</span>
                <span className="min-w-0 text-[13px] sm:text-[15px]">{address}</span>
              </p>
            </div>
          </div>

          <div className="hidden sm:grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:contents">
            {/* Col 2: Quick Links */}
            <div className="lg:col-span-2 lg:col-start-7 min-w-0">
              <h4 className="text-xs sm:text-[15px] font-bold text-white mb-4 lg:mb-8 tracking-widest uppercase text-[#C8960A] lg:text-white">{isZh ? '快速链接' : 'Quick Links'}</h4>
              <ul className="flex flex-col gap-2.5 sm:gap-4 text-sm sm:text-[15px] text-[#9A9A94] font-medium">
                <li><Link href="/" className="hover:text-[#C8960A] transition-colors inline-block py-0.5">{isZh ? '主页' : 'Home'}</Link></li>
                <li><Link href="/products" className="hover:text-[#C8960A] transition-colors inline-block py-0.5">{isZh ? '找设备' : 'Products'}</Link></li>
                <li>
                  <Link href={"/contact#sales-team" as `/${string}`} className="hover:text-[#C8960A] transition-colors inline-block py-0.5">
                    {isZh ? '联系销售代表' : 'Contact Sales'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Brands（动态从已发布产品提取，最多 6 个） */}
            <div className="lg:col-span-2 min-w-0">
              <h4 className="text-xs sm:text-[15px] font-bold text-white mb-4 lg:mb-8 tracking-widest uppercase text-[#C8960A] lg:text-white">{isZh ? '品牌矩阵' : 'Brands'}</h4>
              <ul className="flex flex-col gap-2.5 sm:gap-4 text-sm sm:text-[15px] text-[#9A9A94] font-medium">
                {footerBrands.length > 0
                  ? footerBrands.map(brand => (
                      <li key={brand}>
                        <Link href={`/products?brand=${encodeURIComponent(brand)}` as `/${string}`} className="hover:text-[#C8960A] transition-colors inline-block py-0.5 break-words">
                          {brand}
                        </Link>
                      </li>
                    ))
                  : <li className="text-[#7A7A74] text-xs">{isZh ? '暂无品牌数据' : 'No brands yet'}</li>
                }
              </ul>
            </div>

            {/* Col 4: Categories（动态从分类表读取，最多 6 个） */}
            <div className="col-span-2 sm:col-span-1 lg:col-span-2 min-w-0">
              <h4 className="text-xs sm:text-[15px] font-bold text-white mb-4 lg:mb-8 tracking-widest uppercase text-[#C8960A] lg:text-white">{isZh ? '核心类目' : 'Categories'}</h4>
              <ul className="flex flex-col gap-2.5 sm:gap-4 text-sm sm:text-[15px] text-[#9A9A94] font-medium">
                {footerCategories.length > 0
                  ? footerCategories.map(cat => (
                      <li key={cat.slug}>
                        <Link href={`/products?category=${encodeURIComponent(cat.slug)}` as `/${string}`} className="hover:text-[#C8960A] transition-colors inline-block py-0.5 break-words">
                          {isZh ? cat.nameZh : cat.nameEn}
                        </Link>
                      </li>
                    ))
                  : <li className="text-[#7A7A74] text-xs">{isZh ? '暂无分类数据' : 'No categories yet'}</li>
                }
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 md:pt-8 border-t border-[#3A3A38] text-center">
          <p className="text-[10px] sm:text-[11px] md:text-xs font-bold text-[#7A7A74] tracking-wide sm:tracking-widest uppercase leading-relaxed max-w-2xl mx-auto break-words px-1">
            <span className="block sm:inline">{isZh ? '版权所有' : 'Copyright'} © {new Date().getFullYear()} {copyrightCompany}</span>
            <span className="hidden sm:inline"> | </span>
            <span className="block sm:inline mt-1 sm:mt-0">
              <a href={`https://${settings.copyrightUrl.replace(/^https?:\/\//, '')}`} className="hover:text-[#9A9A94] break-all underline-offset-2 hover:underline">
                {settings.copyrightUrl}
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
