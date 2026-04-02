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
