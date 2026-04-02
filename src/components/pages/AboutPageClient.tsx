'use client';
import Image from 'next/image';
import { CheckCircle2, ShieldCheck, Globe, Trophy, Award } from "lucide-react";
import { useLocale } from 'next-intl';
import { usePageContent } from '@/hooks/usePageContent';

export default function AboutPageClient({
  initialContent,
}: {
  initialContent?: Record<string, string> | null;
}) {
  const locale = useLocale();
  const isZh = locale === 'zh';
  const { get: c } = usePageContent('about', initialContent);
  const blockAImage = c('blockA.image', '');
  const blockBImage = c('blockB.image', '');

  return (
    <main className="w-full bg-[#FAFAFA] pt-[72px]">

      {/* 2. 实力档案 (The Scale & Story) */}
      <section className="w-full py-16 md:py-24 bg-[#FAFAFA] relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
          
          <div className="flex flex-col gap-16 md:gap-32">
            {/* Block A: 左图右文 - 现代化总库 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between group">
              <div className="w-full md:w-1/2 relative aspect-[4/3] rounded-3xl shadow-[-20px_20px_0_#EEEEEE] group-hover:shadow-[-20px_20px_0_#D4AF37] transition-all duration-500 overflow-hidden border border-gray-200">
                {blockAImage ? (
                  <Image fill unoptimized priority src={blockAImage} alt="上海现代化总库" className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#111111] text-white/35">
                    <span className="text-[11px] font-bold tracking-[0.2em] uppercase">No Media</span>
                  </div>
                )}
              </div>
              <div className="w-full md:w-5/12 text-left mt-16 md:mt-0 relative md:pl-16">
                <h2 className="text-4xl md:text-5xl font-black text-[#111111] leading-tight tracking-tighter mb-8 pt-4">
                  {isZh ? c('blockA.title', '长三角核心 源头底库基地') : c('blockA.title', 'Core Yangtze Delta Base of Operations')}
                </h2>
                <p className="text-gray-500 leading-relaxed font-medium text-[15px] mb-6">
                  {c('blockA.p1', '自2003年起，我们深度扎根于具有全球航运统治力的上海港腹地。打造了拥有逾 2000平米 的现代化重装整备急库区，绝不倒买倒卖，坚持全仓纯实体现车。')}
                </p>
                <p className="text-gray-500 leading-relaxed font-medium text-[15px]">
                  {c('blockA.p2', '基地内置独立无尘液压车间与动力测试线。我们斥资汇聚业内尖端检测仪与退役资深工程师，确保所有经我们出海的卡特彼勒、小松、日立等重卡，拥有硬核的原厂级运转能力。')}
                </p>
                
                <ul className="mt-10 space-y-5">
                  <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 transition-colors hover:border-[#D4AF37]/30">
                     <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center shrink-0">
                        <CheckCircle2 className="text-[#D4AF37]" size={18} />
                     </div>
                     <span className="text-[#111111] font-black text-[15px]">{isZh ? c('blockA.check1', '全驱自营机械整备流水线') : c('blockA.check1', 'Fully self-operated overhaul assembly line')}</span>
                  </div>
                  <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 transition-colors hover:border-[#D4AF37]/30">
                     <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center shrink-0">
                        <CheckCircle2 className="text-[#D4AF37]" size={18} />
                     </div>
                     <span className="text-[#111111] font-black text-[15px]">{isZh ? c('blockA.check2', '深链大干线专属海运特权') : c('blockA.check2', 'Dedicated mainline shipping privileges')}</span>
                  </div>
                </ul>
              </div>
            </div>

            {/* Block B: 右图左文 - 全球声誉 */}
            <div className="relative flex flex-col md:flex-row-reverse items-center justify-between group">
              <div className="w-full md:w-1/2 relative aspect-[4/3] rounded-3xl shadow-[20px_20px_0_#EEEEEE] group-hover:shadow-[20px_20px_0_#111111] transition-all duration-500 overflow-hidden border border-gray-200">
                {blockBImage ? (
                  <Image fill unoptimized src={blockBImage} alt="全球机械停放阵列" className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#111111] text-white/35">
                    <span className="text-[11px] font-bold tracking-[0.2em] uppercase">No Media</span>
                  </div>
                )}
              </div>
              <div className="w-full md:w-5/12 text-left mt-16 md:mt-0 relative md:pr-16">
                <h2 className="text-4xl md:text-5xl font-black text-[#111111] leading-tight tracking-tighter mb-8 pt-4">
                  {isZh ? c('blockB.title', '跨越极限工况的 重载交付力') : c('blockB.title', 'Heavy-Duty Delivery Beyond Extreme Conditions')}
                </h2>
                <p className="text-gray-500 leading-relaxed font-medium text-[15px] mb-6">
                  {c('blockB.p1', '重载机械漂洋过海不是终点，矿山实操才是！我们的海外业务不仅仅是"卖单机器"，更是全生命周期的工业护航。')}
                </p>
                <p className="text-gray-500 leading-relaxed font-medium text-[15px]">
                  {c('blockB.p2', '至今，我们高密度地将成套编队级工程机械成功投送至印尼镍矿、秘鲁铜矿区、以及肯尼亚基建一线。以严苛的拒售翻新组装机的红线铁律，建立起跨国老客的绝对信任壁垒。')}
                </p>

                <div className="mt-10 grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all group/card overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#FAFAFA] rounded-bl-full -mr-4 -mt-4 transition-transform group-hover/card:scale-150"></div>
                    <h4 className="text-[#111111] font-black tracking-widest text-[13px] mb-3 uppercase relative z-10">{isZh ? c('blockB.card1.title', '绝不妥协的品控') : c('blockB.card1.title', 'Integrity & Mutual Benefit')}</h4>
                    <p className="text-gray-500 text-xs font-medium leading-relaxed relative z-10">{isZh ? c('blockB.card1.desc', '一票否决事故框架与火烧水淹，从物理源头捍卫商誉。') : c('blockB.card1.desc', 'We never trade in accident-damaged or rebuilt machines — our foundation is built on long-term partnerships worldwide.')}</p>
                  </div>
                  <div className="bg-[#111111] rounded-2xl border border-gray-800 p-6 hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)] transition-all group/card overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#1A1A1A] rounded-bl-full -mr-4 -mt-4 transition-transform group-hover/card:scale-150"></div>
                    <h4 className="text-[#D4AF37] font-black tracking-widest text-[13px] mb-3 uppercase relative z-10">{isZh ? c('blockB.card2.title', '云端穿洲排障') : c('blockB.card2.title', 'Service First')}</h4>
                    <p className="text-gray-400 text-xs font-medium leading-relaxed relative z-10">{isZh ? c('blockB.card2.desc', '首席技师无视时区差，跨洋视频连线硬核拆解指导。') : c('blockB.card2.desc', 'Dedicated engineers provide seamless maintenance support across all time zones.')}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. 核心硬实力数据条 (Milestone Data Strip) */}
      <section className="w-full py-24 bg-[#111111] relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
        <div className="max-w-[1440px] w-full px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center">
            
            <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
              <span className="text-5xl md:text-6xl font-black text-white mb-3">{c('stats.0.num', '20')}<span className="text-[#D4AF37]">+</span></span>
              <span className="text-gray-400 text-sm font-black tracking-widest uppercase">{isZh ? c('stats.0.label', '年出海行业深耕') : c('stats.0.label', 'Years in the Industry')}</span>
            </div>

            <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
              <span className="text-5xl md:text-6xl font-black text-white mb-3">{c('stats.1.num', '30')}<span className="text-[#D4AF37]">+</span></span>
              <span className="text-gray-400 text-sm font-black tracking-widest uppercase">{isZh ? c('stats.1.label', '支特派抢修梯队') : c('stats.1.label', 'Field Engineers Deployed')}</span>
            </div>

            <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
              <span className="text-5xl md:text-6xl font-black text-white mb-3">{c('stats.2.num', '50')}<span className="text-[#D4AF37]">+</span></span>
              <span className="text-gray-400 text-sm font-black tracking-widest uppercase">{isZh ? c('stats.2.label', '个矿建出海国家') : c('stats.2.label', 'Countries Reached')}</span>
            </div>

            <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
              <span className="text-5xl md:text-6xl font-black text-white mb-3">{c('stats.3.num', '3000')}<span className="text-[#D4AF37]">+</span></span>
              <span className="text-gray-400 text-sm font-black tracking-widest uppercase">{isZh ? c('stats.3.label', '台实体现车交付') : c('stats.3.label', 'Machines Safely Delivered')}</span>
            </div>

          </div>
        </div>
      </section>

      {/* 4. 全球准入资质墙 (Certification Grid) */}
      <section className="w-full py-16 md:py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-[#111111] tracking-tighter mb-6">{c('certs.title', isZh ? '全球通行的重金属底气' : 'Our Industry Certifications')}</h2>
            <div className="w-12 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-gray-500 text-[15px] font-medium max-w-2xl mx-auto">{c('certs.desc', isZh ? '我们配备了最苛刻的第三方驻场验机标准与源产地报关资质矩阵，以强悍的官方背书秒杀清关屏障。' : 'We continually advance our production capabilities and quality control systems, supported by accredited inspection institutions and a globally recognized sales and service network.')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {([
              { icon: ShieldCheck, zh_n: "重工溯源认证", en_n: "Verified Supplier", zh_code: "VERIFIED SUPPLIER", en_code: "TRADE ASSURANCE" },
              { icon: Globe,       zh_n: "欧盟通行准入", en_n: "CE Conformity",     zh_code: "CE CONFORMITY",    en_code: "EU MARKET ACCESS" },
              { icon: Trophy,      zh_n: "国际质控标准", en_n: "ISO 9001:2015",     zh_code: "ISO 9001:2015",    en_code: "QUALITY MANAGEMENT" },
              { icon: Award,       zh_n: "第三方驻场终检", en_n: "SGS Inspection", zh_code: "SGS INSPECTION",   en_code: "THIRD-PARTY VERIFIED" },
            ] as const).map((cert, i) => (
              <div key={i} className="bg-[#FAFAFA] p-6 rounded-3xl border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[#D4AF37]/30 hover:-translate-y-2 transition-all duration-500 overflow-hidden relative group">
                <div className="w-14 h-14 bg-[#111111] rounded-2xl text-[#D4AF37] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <cert.icon size={24} />
                </div>
                <div className="w-full aspect-[7/5] rounded-2xl relative bg-[#F7F7F8] border border-gray-100 flex items-center justify-center overflow-hidden mb-6 p-4">
                  {c(`cert.${i}.image`, '') ? (
                    <Image fill unoptimized src={c(`cert.${i}.image`, '')} alt={isZh ? cert.zh_n : cert.en_n} className="object-contain opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700 p-3" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#111111] text-white/35">
                      <span className="text-[10px] font-bold tracking-[0.18em] uppercase">No Cert</span>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-[#111111] font-black text-lg tracking-wide mb-1">{c(`cert.${i}.name`, isZh ? cert.zh_n : cert.en_n)}</h4>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{c(`cert.${i}.code`, isZh ? cert.zh_code : cert.en_code)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
