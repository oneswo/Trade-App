"use client";
import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';

export default function Footer() {
  const locale = useLocale();
  const isZh = locale === 'zh';
  return (
    <footer className="w-full bg-[#111111] text-white pt-16 pb-8 border-t border-[#222]">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-10">
          
          {/* Col 1: Brand & Contact Info */}
          <div className="lg:col-span-4 pr-8">
            <Link href="/" className="inline-block mb-10">
              <span className="text-4xl font-black tracking-tighter text-white">
                {isZh ? '中国机械' : 'CHINA MACHINERY'}
              </span>
            </Link>
            
            <div className="flex flex-col gap-4 text-sm text-gray-400 font-medium mb-8">
              <p className="flex items-center gap-4"><span className="text-gray-500 w-20">{isZh ? '联系人:' : 'Contact:'}</span> Jack Yin</p>
              <p className="flex items-center gap-4"><span className="text-gray-500 w-20">{isZh ? '电话:' : 'Phone:'}</span> <a href="tel:+8617321077956" className="hover:text-white transition-colors cursor-pointer">+86 17321077956</a></p>
              <p className="flex items-center gap-4"><span className="text-gray-500 w-20">{isZh ? '邮箱:' : 'Email:'}</span> <a href="mailto:15156888267@163.com" className="hover:text-white transition-colors cursor-pointer">15156888267@163.com</a></p>
              <p className="flex items-center gap-4"><span className="text-gray-500 w-20">WhatsApp:</span> <a href="https://wa.me/8615375319246" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors cursor-pointer">+86 15375319246</a></p>
              <p className="flex items-start gap-4 leading-relaxed"><span className="text-gray-500 w-20 shrink-0">{isZh ? '公司地址:' : 'Address:'}</span> <span>{isZh ? '中国上海市奉贤区金海路6055号' : 'No. 6055, Jinhai Rd, Fengxian District, Shanghai, China'}</span></p>
            </div>

            {/* Circular Social Icons - 悬浮引爆平台色 */}
            <div className="flex items-center gap-3">
               {[
                 { name: "X", icon: <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>, hover: "hover:bg-white hover:text-black" },
                 { name: "Instagram", icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>, hover: "hover:bg-[#E1306C] hover:text-white" },
                 { name: "Facebook", icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>, hover: "hover:bg-[#1877F2] hover:text-white" },
                 { name: "YouTube", icon: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>, hover: "hover:bg-[#FF0000] hover:text-white" },
                 { name: "TikTok", icon: <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.26-.92 4.54-2.58 5.84-1.74 1.36-4.08 1.95-6.19 1.4-2.19-.57-4.05-2.08-4.9-4.14-.86-2.07-.74-4.5.3-6.42 1.05-1.92 2.97-3.32 5.1-3.72 1.25-.23 2.54-.15 3.77.16v4.06c-.84-.2-1.73-.24-2.56-.05-1.39.31-2.6 1.48-3.02 2.82-.44 1.36-.2 2.93.63 4.07.82 1.11 2.27 1.66 3.63 1.49 1.43-.18 2.66-1.31 3.05-2.67.24-.85.19-1.75.19-2.63V.02z"/>, hover: "hover:bg-[#FFF] hover:text-black" }
               ].map((social) => (
                  <a key={social.name} href="#" className={`w-10 h-10 rounded-full bg-[#222222] flex items-center justify-center text-gray-400 border border-gray-800 ${social.hover} transition-all duration-300 hover:scale-110`} title={social.name}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">{social.icon}</svg>
                  </a>
               ))}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 lg:col-start-7">
            <h4 className="text-sm font-bold text-white mb-8 tracking-widest uppercase">{isZh ? '快速链接' : 'Quick Links'}</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400 font-medium">
              {(isZh 
                ? [{label:'主页', path:'/'}, {label:'找设备', path:'/products'}, {label:'联系销售代表', path:'/contact'}] 
                : [{label:'Home', path:'/'}, {label:'Equipment', path:'/products'}, {label:'Contact Sales', path:'/contact'}]).map(item => (
                 <li key={item.label}><Link href={item.path as any} className="hover:text-[#D4AF37] transition-colors">{item.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Col 3: Brands */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white mb-8 tracking-widest uppercase">{isZh ? '品牌矩阵' : 'Brands'}</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400 font-medium">
              {(isZh 
                 ? ['卡特彼勒', '小松', '日立', '三一重工', '徐工', '沃尔沃']
                 : ['Caterpillar', 'Komatsu', 'Hitachi', 'SANY', 'XCMG', 'VOLVO']).map(item => (
                 <li key={item}><Link href="/products" className="hover:text-[#D4AF37] transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Col 4: Equipment */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white mb-8 tracking-widest uppercase">{isZh ? '核心类目' : 'Categories'}</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400 font-medium">
              {(isZh 
                 ? ['履带挖掘机', '轮式装载机', '重型推土机', '平地机', '压路机', '叉车']
                 : ['Excavators', 'Wheel Loaders', 'Bulldozers', 'Graders', 'Rollers', 'Forklifts']).map(item => (
                 <li key={item}><Link href="/products" className="hover:text-[#D4AF37] transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#222222] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-bold text-gray-600 tracking-widest uppercase">
          <p>{isZh ? '版权所有' : 'Copyright'} © 2026 {isZh ? '中国机械' : 'CHINA MACHINERY'} | <a href="#" className="hover:text-gray-400">WWW.ONESWO.COM</a></p>
          <div className="flex items-center gap-6">
             <Link href="#" className="hover:text-gray-400 transition-colors">{isZh ? '隐私条款' : 'Privacy Policy'}</Link>
             <Link href="#" className="hover:text-gray-400 transition-colors">{isZh ? '服务政策' : 'Terms of Service'}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
