'use client';
import { Target, CheckCircle, ShieldCheck, Settings, Handshake, Shield, MonitorPlay } from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { usePageContent } from '@/hooks/usePageContent';
import { openInquiryModal } from "@/lib/inquiries/modal";

export default function ServicesPageClient({
  initialContent,
}: {
  initialContent?: Record<string, string> | null;
}) {
  const locale = useLocale();
  const isZh = locale === 'zh';
  const { get: c } = usePageContent('services', initialContent);

  return (
    <main className="w-full bg-[#FAFAFA] pt-[72px]">

      {/* 2. 六大特权服务矩阵 (Premium Service Matrix) */}
      <section className="w-full py-16 md:py-24 bg-[#FAFAFA]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[#111111] tracking-tighter mb-6">{c('matrix.title', isZh ? '重装出海全维保障体系' : 'Premium Heavy Equipment Services')}</h2>
            <div className="w-12 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group bg-white p-10 lg:p-12 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 border border-gray-100 hover:border-[#D4AF37]/30 rounded-3xl">
              <div className="w-16 h-16 bg-[#111111] text-[#D4AF37] flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <Target size={28} />
              </div>
              <h3 className="text-xl font-black text-[#111111] mb-4">{c('matrix.card.0.title', isZh ? '客制化找机寻源' : 'Custom Machinery Sourcing')}</h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium">{c('matrix.card.0.desc', isZh ? '利用庞大的全球货源数据库与厂方人脉脉络，根据您的型号、小时数、预算等精准需求，实行全网反向寻机，绝不妥协任何一处瑕疵。' : 'Leveraging our extensive global inventory database and direct factory networks, we conduct targeted reverse sourcing based on your exact model, operating hours, and budget — with zero compromise on condition.')}</p>
            </div>
            
            {/* Card 2 */}
            <div className="group bg-white p-10 lg:p-12 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 border border-gray-100 hover:border-[#D4AF37]/30 rounded-3xl">
              <div className="w-16 h-16 bg-[#111111] text-[#D4AF37] flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <CheckCircle size={28} />
              </div>
              <h3 className="text-xl font-black text-[#111111] mb-4">{c('matrix.card.1.title', isZh ? '原厂级拆卸整备' : 'OEM-Standard Disassembly & Overhaul')}</h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium">{c('matrix.card.1.desc', isZh ? '独家聘用一线品牌退役资深液压与动力工程师。全维深度测试核心三大件（发动机、液压泵、分配器），符合100项严苛出海标准才予以放行。' : 'Our team includes retired senior hydraulic and powertrain engineers from leading OEM brands. The core three assemblies — engine, hydraulic pump, and control valve — undergo full-depth testing against 100 rigorous export standards before any unit is cleared for shipment.')}</p>
            </div>

            {/* Card 3 */}
            <div className="group bg-white p-10 lg:p-12 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 border border-gray-100 hover:border-[#D4AF37]/30 rounded-3xl">
              <div className="w-16 h-16 bg-[#111111] text-[#D4AF37] flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-black text-[#111111] mb-4">{c('matrix.card.2.title', isZh ? '可靠装箱与发运' : 'Secure Packing & Shipment')}</h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium">{c('matrix.card.2.desc', isZh ? '掌握拆解、防锈、打包木架的核心工艺。针对 RO-RO 滚装船或 Flat Rack 框架柜提供极致安全的捆扎绑缚，杜绝任何海运颠簸受损。' : 'We apply professional disassembly, anti-corrosion treatment, and timber crating techniques. For RO-RO vessels or flat rack containers, we perform expert lashing and securing to prevent any damage caused by ocean transit.')}</p>
            </div>

            {/* Card 4 */}
            <div className="group bg-white p-10 lg:p-12 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 border border-gray-100 hover:border-[#D4AF37]/30 rounded-3xl">
              <div className="w-16 h-16 bg-[#111111] text-[#D4AF37] flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <Settings size={28} />
              </div>
              <h3 className="text-xl font-black text-[#111111] mb-4">{c('matrix.card.3.title', isZh ? '五星级配件补给' : 'Premium Spare Parts Supply')}</h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium">{c('matrix.card.3.desc', isZh ? '附赠高频易损件保养包。滤芯、履带指、斗齿等消耗品以极具竞争力的出厂底价随船配发，扫除在偏远矿区无配换的后顾之忧。' : 'A complimentary maintenance kit of high-frequency wear parts is included with every shipment. Filters, track pins, bucket teeth, and other consumables are supplied at competitive ex-factory pricing to ensure uninterrupted operations in remote mining regions.')}</p>
            </div>

            {/* Card 5 */}
            <div className="group bg-white p-10 lg:p-12 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 border border-gray-100 hover:border-[#D4AF37]/30 rounded-3xl">
              <div className="w-16 h-16 bg-[#111111] text-[#D4AF37] flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <Handshake size={28} />
              </div>
              <h3 className="text-xl font-black text-[#111111] mb-4">{c('matrix.card.4.title', isZh ? '清关文书与合规' : 'Customs Documentation & Compliance')}</h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium">{c('matrix.card.4.desc', isZh ? '免费包办出口报关单证、原产地商检证书、海运提单 (B/L) 以及目的港特许清关所需的极高标准合规文件，确保您顺利清关免重税。' : 'We handle all export documentation at no extra cost, including export declarations, certificate of origin, commercial inspection certificates, Bill of Lading (B/L), and all compliance documents required for smooth customs clearance at the destination port.')}</p>
            </div>

            {/* Card 6 - Dark Highlight (CTA) */}
            <div className="group bg-[#111111] p-10 lg:p-12 shadow-[0_20px_40px_rgba(212,175,55,0.15)] transition-all duration-500 border border-[#D4AF37]/30 flex flex-col justify-between relative overflow-hidden rounded-3xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] opacity-10 blur-[50px] rounded-full"></div>
              <div className="relative z-10">
                <h3 className="text-4xl font-black text-white mb-6 leading-tight tracking-tighter">{c('matrix.cta.title1', isZh ? '急需稀缺' : 'Need a Hard-to-Find')}<br/>{c('matrix.cta.title2', isZh ? '特种机型？' : 'Specialist Machine?')}</h3>
                <p className="text-gray-400 leading-relaxed text-sm font-medium mb-10">{c('matrix.cta.desc', isZh ? '独家内网通道，为您直接截胡暂未面市的厂矿顶配成色一手退役机资源。' : 'Through our exclusive off-market network, we source premium first-owner decommissioned units directly from factories and mines — before they ever reach the open market.')}</p>
              </div>
              
              <button onClick={openInquiryModal} className="relative z-10 w-fit inline-flex items-center gap-2 text-[#D4AF37] text-sm font-bold tracking-widest uppercase hover:text-white transition-colors group/btn">
                {c('matrix.cta.btn', isZh ? '立即委托寻车' : 'Commission a Search Now')}
                <span className="w-12 h-px bg-[#D4AF37] group-hover/btn:w-16 transition-all"></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 全球信任背书 (Global Trust Metrics) */}
      <section className="w-full py-24 bg-[#111111] border-y border-white/10 relative overflow-hidden">
        {/* Subtle geometric lines */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
        
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">{c('trust.title', isZh ? '赢得全球矿企与基建商的绝对信赖' : 'Trusted by Global Mining & Infrastructure Operators')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10 mt-16">
            <div className="flex flex-col items-center text-center pt-8 md:pt-0 pb-8 md:pb-0 px-8">
              <Shield className="text-[#D4AF37] mb-8" size={48} strokeWidth={1.5} />
              <h4 className="text-xl font-bold text-white mb-4">{c('trust.0.title', isZh ? '超级干线与集港联运' : 'Dedicated Inland Haulage & Port Consolidation')}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{c('trust.0.desc', isZh ? '依托完全自营的重装整备基地与大件特种平板拖车车队，我们打通了直达中国各大主港的专属联运走廊，彻底告别第三方野蛮托运导致的沿途磕碰积压。' : "Operating our own heavy equipment preparation yard and specialized flatbed fleet, we have established a dedicated corridor to China's major export ports — eliminating damage and delays caused by third-party haulage.")}</p>
            </div>
            <div className="flex flex-col items-center text-center pt-8 md:pt-0 pb-8 md:pb-0 px-8">
              <MonitorPlay className="text-[#D4AF37] mb-8" size={48} strokeWidth={1.5} />
              <h4 className="text-xl font-bold text-white mb-4">{c('trust.1.title', isZh ? '云端全景实机验交' : 'Live Multi-Camera Remote Acceptance Inspection')}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{c('trust.1.desc', isZh ? '采用高帧率多机位全景直播验收。我们的工程师将带您钻入机械底部排查暗漏，俯视发动机负荷黑烟，并全景展示挖掘机的极限复合动作，所见即所达。' : 'Using high-frame-rate multi-camera live streaming, our engineers guide you through a thorough walkaround — inspecting undercarriage for oil seepage, observing engine load exhaust, and demonstrating full combined hydraulic movement. What you see is exactly what you get.')}</p>
            </div>
            <div className="flex flex-col items-center text-center pt-8 md:pt-0 pb-8 md:pb-0 px-8">
              <Handshake className="text-[#D4AF37] mb-8" size={48} strokeWidth={1.5} />
              <h4 className="text-xl font-bold text-white mb-4">{c('trust.2.title', isZh ? '跨国全周期远程排障' : 'Full-Lifecycle Cross-Border Remote Troubleshooting')}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{c('trust.2.desc', isZh ? '二手机械在恶劣矿区难免磨损突发故障，我们不仅随船附送核心易损件全家桶，更建立 1V1 专属出海专家群，零延迟进行跨洋图文连线与维修实操辅导。' : 'When used machinery encounters unexpected failures in harsh mining environments, we respond immediately. Beyond the included wear parts kit, every client receives a dedicated 1-on-1 expert channel for instant cross-ocean technical guidance, wiring diagrams, and live repair coaching.')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 极致流程步骤 (The Zig-Zag Process) */}
      <section className="w-full py-16 md:py-32 bg-white relative">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-32">
            <h2 className="text-4xl md:text-5xl font-black text-[#111111] tracking-tighter mb-6">{c('process.title', isZh ? '二手重型设备验交与发运标准' : 'Used Equipment Inspection & Dispatch Standards')}</h2>
            <div className="w-12 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="flex flex-col gap-0 relative">
            
            {/* 中轴线参考 */}
            <div className="hidden md:block absolute top-[10%] bottom-[10%] left-1/2 w-[2px] bg-gray-100 transform -translate-x-1/2 z-0"></div>
            
            {/* Step 01 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between py-16 md:py-24 group">
              <div className="absolute left-[-2px] md:left-1/2 w-4 h-4 bg-[#D4AF37] rounded-full transform -translate-x-1/2 md:group-hover:scale-150 transition-transform hidden md:block z-10"></div>
              
              <div className="md:w-5/12 text-left md:text-right md:pr-16 relative">
                <span className="absolute -top-10 md:-top-16 md:right-16 text-8xl md:text-[160px] font-black text-gray-50 opacity-80 -z-10 select-none">01</span>
                <h3 className="text-3xl font-black text-[#111111] mb-6">{c('process.0.title', isZh ? '二手寻机与严选匹配' : 'Sourcing & Rigorous Machine Selection')}</h3>
                <p className="text-gray-500 leading-relaxed font-medium text-[15px]">{c('process.0.desc', isZh ? '我们在全球各大矿场直接筛选出状态极致优秀的成色一手设备。只挑选底盘扎实、车况原版极品的高回本率神机，从货源源头上彻底扼杀事故车、水淹车和组装车。' : 'We source directly from major mining operations worldwide, selecting only first-owner units in exceptional condition. We exclusively target machines with solid undercarriages and unmolested original condition — eliminating accident-damaged, flood-damaged, and rebuilt units at the source.')}</p>
              </div>
              <div className="w-full md:w-5/12 mt-12 md:mt-0 relative aspect-video shadow-[20px_20px_0_#F5F5F5] group-hover:shadow-[20px_20px_0_#D4AF37] transition-shadow duration-500 overflow-hidden">
                {c('process.0.image', '') ? (
                  <Image fill unoptimized src={c('process.0.image', '')} alt="精准选机" className="object-cover hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#111111] text-white/35"><span className="text-[11px] font-bold tracking-[0.2em] uppercase">No Media</span></div>
                )}
              </div>
            </div>

            {/* Step 02 */}
            <div className="relative flex flex-col md:flex-row-reverse items-center justify-between py-16 md:py-24 group">
              <div className="absolute left-[-2px] md:left-1/2 w-4 h-4 bg-[#111111] rounded-full transform -translate-x-1/2 md:group-hover:scale-150 transition-transform hidden md:block z-10"></div>
              
              <div className="md:w-5/12 text-left md:pl-16 relative">
                <span className="absolute -top-10 md:-top-16 md:left-16 text-8xl md:text-[160px] font-black text-gray-50 opacity-80 -z-10 select-none">02</span>
                <h3 className="text-3xl font-black text-[#111111] mb-6">{c('process.1.title', isZh ? '全卸复检与硬核测试' : 'Full Teardown Reinspection & Load Testing')}</h3>
                <p className="text-gray-500 leading-relaxed font-medium text-[15px]">{c('process.1.desc', isZh ? '绝不只做表面功夫。老练的工程师会将上盖与液压泵彻底暴漏，实机测试怠速动作、极限复合动作，测试黑烟状态并对底盘四轮一带进行全面打分，出具百项检测报告书。' : 'We go far beyond cosmetic inspection. Experienced engineers expose the top cover and hydraulic pump for thorough assessment, conduct live idle and full combined-movement load tests, evaluate exhaust smoke quality, and score the complete undercarriage assembly — producing a 100-item inspection report.')}</p>
              </div>
              <div className="w-full md:w-5/12 mt-12 md:mt-0 relative aspect-video shadow-[-20px_20px_0_#F5F5F5] group-hover:shadow-[-20px_20px_0_#111111] transition-shadow duration-500 overflow-hidden">
                {c('process.1.image', '') ? (
                  <Image fill unoptimized src={c('process.1.image', '')} alt="核心复检" className="object-cover hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#111111] text-white/35"><span className="text-[11px] font-bold tracking-[0.2em] uppercase">No Media</span></div>
                )}
              </div>
            </div>

            {/* Step 03 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between py-16 md:py-24 group">
              <div className="absolute left-[-2px] md:left-1/2 w-4 h-4 bg-[#D4AF37] rounded-full transform -translate-x-1/2 md:group-hover:scale-150 transition-transform hidden md:block z-10"></div>
              
              <div className="md:w-5/12 text-left md:text-right md:pr-16 relative">
                <span className="absolute -top-10 md:-top-16 md:right-16 text-8xl md:text-[160px] font-black text-gray-50 opacity-80 -z-10 select-none">03</span>
                <h3 className="text-3xl font-black text-[#111111] mb-6">{c('process.2.title', isZh ? '工业级除垢与焕新喷漆' : 'Industrial Degreasing & Factory-Grade Refinishing')}</h3>
                <p className="text-gray-500 leading-relaxed font-medium text-[15px]">{c('process.2.desc', isZh ? '任何设备出港前，均经过高压水流彻底剥离黄油垢与深层硬化泥土，视客户需求进行电脑无色差原厂漆调板翻新。保证每一根接管重获新生，消除隐藏漏油隐患。' : 'Before departure, every machine is subjected to high-pressure washing to fully strip grease buildup and hardened soil. Upon request, computer-matched OEM paint is applied for a factory-finish result. All hydraulic fittings and hoses are renewed to eliminate hidden leak risks.')}</p>
              </div>
              <div className="w-full md:w-5/12 mt-12 md:mt-0 relative aspect-video shadow-[20px_20px_0_#F5F5F5] group-hover:shadow-[20px_20px_0_#D4AF37] transition-shadow duration-500 overflow-hidden">
                {c('process.2.image', '') ? (
                  <Image fill unoptimized src={c('process.2.image', '')} alt="全车焕新" className="object-cover hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#111111] text-white/35"><span className="text-[11px] font-bold tracking-[0.2em] uppercase">No Media</span></div>
                )}
              </div>
            </div>

            {/* Step 04 */}
            <div className="relative flex flex-col md:flex-row-reverse items-center justify-between py-16 md:py-24 group">
              <div className="absolute left-[-2px] md:left-1/2 w-4 h-4 bg-[#111111] rounded-full transform -translate-x-1/2 md:group-hover:scale-150 transition-transform hidden md:block z-10"></div>
              
              <div className="md:w-5/12 text-left md:pl-16 relative">
                <span className="absolute -top-10 md:-top-16 md:left-16 text-8xl md:text-[160px] font-black text-gray-50 opacity-80 -z-10 select-none">04</span>
                <h3 className="text-3xl font-black text-[#111111] mb-6">{c('process.3.title', isZh ? '在线验交与港口吊装发运' : 'Live Remote Acceptance & Port Dispatch')}</h3>
                <p className="text-gray-500 leading-relaxed font-medium text-[15px]">{c('process.3.desc', isZh ? '由客户参与实时视频动态验机。确认无误后，在专属押运专员护送下进行拆解打托装入集装箱，或直接开上港口 Frame 柜及滚装船甲板进行重型捆扎绑缚，随时在云端跟踪飘洋过海的回程路线。' : 'Clients participate in a real-time live video acceptance inspection. Once confirmed, units are loaded into containers on pallets under escort by our dedicated logistics coordinator, or driven directly onto flat rack or RO-RO vessels with professional heavy lashing applied. Full vessel tracking is available online throughout the voyage.')}</p>
              </div>
              <div className="w-full md:w-5/12 mt-12 md:mt-0 relative aspect-video shadow-[-20px_20px_0_#F5F5F5] group-hover:shadow-[-20px_20px_0_#111111] transition-shadow duration-500 overflow-hidden">
                {c('process.3.image', '') ? (
                  <Image fill unoptimized src={c('process.3.image', '')} alt="云验收" className="object-cover hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#111111] text-white/35"><span className="text-[11px] font-bold tracking-[0.2em] uppercase">No Media</span></div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </section>

    </main>
  );
}
