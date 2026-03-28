'use client';
import { Target, CheckCircle, ShieldCheck, Settings, Handshake, Shield, MonitorPlay, Send, Search, Wrench, Sparkles, Ship } from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useInquirySubmit } from "@/hooks/useInquirySubmit";

export default function ServicesPage() {
  const locale = useLocale();
  const isZh = locale === 'zh';
  const { submitState, submitMessage, handleSubmit } = useInquirySubmit({ source: "services-page-cta" });

  return (
    <main className="w-full bg-[#FAFAFA] pt-[72px]">
      {/* 1. 沉浸式英雄头图 (Cinematic Hero) */}
      <section className="relative w-full h-[450px] md:h-[500px] flex items-center justify-center bg-[#111111] overflow-hidden">
         {/* 背景暗纹蒙版与网格 */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
         <div className="absolute inset-0 opacity-60 bg-[url('/images/hero/services.png')] bg-cover bg-center pointer-events-none scale-105 active:scale-100 transition-transform duration-[10s]"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-[#111111]/10 pointer-events-none"></div>
         
         {/* 琥珀色微光 (Radiant Glow) */}
         <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D4AF37] opacity-[0.05] blur-[120px] rounded-full pointer-events-none"></div>
         <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#D4AF37] opacity-[0.03] blur-[150px] rounded-full pointer-events-none"></div>

         <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-[1100px] mx-auto text-center mt-4">
            
            {/* 顶部分类小提示 */}
            <div className="flex items-center justify-center gap-3 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-8 border border-[#D4AF37]/20 rounded-full px-5 py-2 bg-[#D4AF37]/5 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span> 
              {isZh ? '重资产出海专属服务' : 'HEAVY EQUIPMENT EXPORT SERVICES'}
            </div>

            <h1 className="text-5xl md:text-[80px] font-black text-white tracking-[0.1em] mb-10 leading-none whitespace-nowrap drop-shadow-2xl">
              {isZh ? '中国源头，' : 'CHINESE SOURCE, '}<span className="text-[#D4AF37]">{isZh ? '全球交付。' : 'GLOBAL DELIVERY.'}</span>
            </h1>

            {/* 副标题 (Height Locked) */}
            <div className="w-full flex items-center justify-center min-h-[60px] md:min-h-[80px]">
              {isZh ? (
                 <div className="w-full text-gray-400 text-lg md:text-[21px] font-medium flex justify-between items-center opacity-90 max-w-[900px]">
                    {"从源头查勘到重载交付，我们提供全链路保姆式出海护航，确保每台机械以巅峰状态抵达。".split('').map((char, index) => (
                      <span key={index}>{char}</span>
                    ))}
                 </div>
              ) : (
                 <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-3xl text-center mx-auto">
                   From factory inspection to heavy-load delivery, we provide end-to-end export escorts to ensure every machine arrives in peak condition.
                 </p>
              )}
            </div>

         </div>
      </section>

      {/* 2. 六大特权服务矩阵 (Premium Service Matrix) */}
      <section className="w-full py-24 md:py-32 bg-[#FAFAFA]">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[#111111] tracking-tighter mb-6">{isZh ? '重装出海全维保障体系' : 'PREMIUM HEAVY EQUIPMENT SERVICES'}</h2>
            <div className="w-12 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group bg-white p-10 lg:p-12 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 border border-gray-100 hover:border-[#D4AF37]/30 rounded-3xl">
              <div className="w-16 h-16 bg-[#111111] text-[#D4AF37] flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <Target size={28} />
              </div>
              <h3 className="text-xl font-black text-[#111111] mb-4">{isZh ? '客制化找机寻源' : 'Custom Machinery Sourcing'}</h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium">{isZh ? '利用庞大的全球货源数据库与厂方人脉脉络，根据您的型号、小时数、预算等精准需求，实行全网反向寻机，绝不妥协任何一处瑕疵。' : 'Leveraging our extensive global inventory database and direct factory networks, we conduct targeted reverse sourcing based on your exact model, operating hours, and budget — with zero compromise on condition.'}</p>
            </div>
            
            {/* Card 2 */}
            <div className="group bg-white p-10 lg:p-12 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 border border-gray-100 hover:border-[#D4AF37]/30 rounded-3xl">
              <div className="w-16 h-16 bg-[#111111] text-[#D4AF37] flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <CheckCircle size={28} />
              </div>
              <h3 className="text-xl font-black text-[#111111] mb-4">{isZh ? '原厂级拆卸整备' : 'OEM-Standard Disassembly & Overhaul'}</h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium">{isZh ? '独家聘用一线品牌退役资深液压与动力工程师。全维深度测试核心三大件（发动机、液压泵、分配器），符合100项严苛出海标准才予以放行。' : 'Our team includes retired senior hydraulic and powertrain engineers from leading OEM brands. The core three assemblies — engine, hydraulic pump, and control valve — undergo full-depth testing against 100 rigorous export standards before any unit is cleared for shipment.'}</p>
            </div>

            {/* Card 3 */}
            <div className="group bg-white p-10 lg:p-12 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 border border-gray-100 hover:border-[#D4AF37]/30 rounded-3xl">
              <div className="w-16 h-16 bg-[#111111] text-[#D4AF37] flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-black text-[#111111] mb-4">{isZh ? '可靠装箱与发运' : 'Secure Packing & Shipment'}</h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium">{isZh ? '掌握拆解、防锈、打包木架的核心工艺。针对 RO-RO 滚装船或 Flat Rack 框架柜提供极致安全的捆扎绑缚，杜绝任何海运颠簸受损。' : 'We apply professional disassembly, anti-corrosion treatment, and timber crating techniques. For RO-RO vessels or flat rack containers, we perform expert lashing and securing to prevent any damage caused by ocean transit.'}</p>
            </div>

            {/* Card 4 */}
            <div className="group bg-white p-10 lg:p-12 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 border border-gray-100 hover:border-[#D4AF37]/30 rounded-3xl">
              <div className="w-16 h-16 bg-[#111111] text-[#D4AF37] flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <Settings size={28} />
              </div>
              <h3 className="text-xl font-black text-[#111111] mb-4">{isZh ? '五星级配件补给' : 'Premium Spare Parts Supply'}</h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium">{isZh ? '附赠高频易损件保养包。滤芯、履带指、斗齿等消耗品以极具竞争力的出厂底价随船配发，扫除在偏远矿区无配换的后顾之忧。' : 'A complimentary maintenance kit of high-frequency wear parts is included with every shipment. Filters, track pins, bucket teeth, and other consumables are supplied at competitive ex-factory pricing to ensure uninterrupted operations in remote mining regions.'}</p>
            </div>

            {/* Card 5 */}
            <div className="group bg-white p-10 lg:p-12 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 border border-gray-100 hover:border-[#D4AF37]/30 rounded-3xl">
              <div className="w-16 h-16 bg-[#111111] text-[#D4AF37] flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <Handshake size={28} />
              </div>
              <h3 className="text-xl font-black text-[#111111] mb-4">{isZh ? '清关文书与合规' : 'Customs Documentation & Compliance'}</h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium">{isZh ? '免费包办出口报关单证、原产地商检证书、海运提单 (B/L) 以及目的港特许清关所需的极高标准合规文件，确保您顺利清关免重税。' : 'We handle all export documentation at no extra cost, including export declarations, certificate of origin, commercial inspection certificates, Bill of Lading (B/L), and all compliance documents required for smooth customs clearance at the destination port.'}</p>
            </div>

            {/* Card 6 - Dark Highlight (CTA) */}
            <div className="group bg-[#111111] p-10 lg:p-12 shadow-[0_20px_40px_rgba(212,175,55,0.15)] transition-all duration-500 border border-[#D4AF37]/30 flex flex-col justify-between relative overflow-hidden rounded-3xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] opacity-10 blur-[50px] rounded-full"></div>
              <div className="relative z-10">
                <h3 className="text-4xl font-black text-white mb-6 leading-tight tracking-tighter">{isZh ? '急需稀缺' : 'Need a Hard-to-Find'}<br/>{isZh ? '特种机型？' : 'Specialist Machine?'}</h3>
                <p className="text-gray-400 leading-relaxed text-sm font-medium mb-10">{isZh ? '独家内网通道，为您直接截胡暂未面市的厂矿顶配成色一手退役机资源。' : 'Through our exclusive off-market network, we source premium first-owner decommissioned units directly from factories and mines — before they ever reach the open market.'}</p>
              </div>
              
              <button onClick={() => window.dispatchEvent(new Event('open-inquiry-modal'))} className="relative z-10 w-fit inline-flex items-center gap-2 text-[#D4AF37] text-sm font-bold tracking-widest uppercase hover:text-white transition-colors group/btn">
                {isZh ? '立即委托寻车' : 'Commission a Search Now'}
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
        
        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">{isZh ? '赢得全球矿企与基建商的绝对信赖' : 'Earning Absolute Trust from Global Mining & Infrastructure Operators'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10 mt-16">
            <div className="flex flex-col items-center text-center pt-8 md:pt-0 pb-8 md:pb-0 px-8">
              <Shield className="text-[#D4AF37] mb-8" size={48} strokeWidth={1.5} />
              <h4 className="text-xl font-bold text-white mb-4">{isZh ? '超级干线与集港联运' : 'Dedicated Inland Haulage & Port Consolidation'}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{isZh ? '依托完全自营的重装整备基地与大件特种平板拖车车队，我们打通了直达中国各大主港的专属联运走廊，彻底告别第三方野蛮托运导致的沿途磕碰积压。' : "Operating our own heavy equipment preparation yard and specialized flatbed fleet, we have established a dedicated corridor to China's major export ports — eliminating damage and delays caused by third-party haulage."}</p>
            </div>
            <div className="flex flex-col items-center text-center pt-8 md:pt-0 pb-8 md:pb-0 px-8">
              <MonitorPlay className="text-[#D4AF37] mb-8" size={48} strokeWidth={1.5} />
              <h4 className="text-xl font-bold text-white mb-4">{isZh ? '云端全景实机验交' : 'Live Multi-Camera Remote Acceptance Inspection'}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{isZh ? '采用高帧率多机位全景直播验收。我们的工程师将带您钻入机械底部排查暗漏，俯视发动机负荷黑烟，并全景展示挖掘机的极限复合动作，所见即所达。' : 'Using high-frame-rate multi-camera live streaming, our engineers guide you through a thorough walkaround — inspecting undercarriage for oil seepage, observing engine load exhaust, and demonstrating full combined hydraulic movement. What you see is exactly what you get.'}</p>
            </div>
            <div className="flex flex-col items-center text-center pt-8 md:pt-0 pb-8 md:pb-0 px-8">
              <Handshake className="text-[#D4AF37] mb-8" size={48} strokeWidth={1.5} />
              <h4 className="text-xl font-bold text-white mb-4">{isZh ? '跨国全周期远程排障' : 'Full-Lifecycle Cross-Border Remote Troubleshooting'}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{isZh ? '二手机械在恶劣矿区难免磨损突发故障，我们不仅随船附送核心易损件全家桶，更建立 1V1 专属出海专家群，零延迟进行跨洋图文连线与维修实操辅导。' : 'When used machinery encounters unexpected failures in harsh mining environments, we respond immediately. Beyond the included wear parts kit, every client receives a dedicated 1-on-1 expert channel for instant cross-ocean technical guidance, wiring diagrams, and live repair coaching.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 极致流程步骤 (The Zig-Zag Process) */}
      <section className="w-full py-32 bg-white relative">
        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <div className="text-center mb-32">
            <h2 className="text-4xl md:text-5xl font-black text-[#111111] tracking-tighter mb-6">{isZh ? '二手重型设备验交与发运标准' : 'Used Heavy Equipment Inspection, Acceptance & Dispatch Standards'}</h2>
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
                <h3 className="text-3xl font-black text-[#111111] mb-6">{isZh ? '二手寻机与严选匹配' : 'Sourcing & Rigorous Machine Selection'}</h3>
                <p className="text-gray-500 leading-relaxed font-medium text-[15px]">{isZh ? '我们在全球各大矿场直接筛选出状态极致优秀的成色一手设备。只挑选底盘扎实、车况原版极品的高回本率神机，从货源源头上彻底扼杀事故车、水淹车和组装车。' : 'We source directly from major mining operations worldwide, selecting only first-owner units in exceptional condition. We exclusively target machines with solid undercarriages and unmolested original condition — eliminating accident-damaged, flood-damaged, and rebuilt units at the source.'}</p>
              </div>
              <div className="w-full md:w-5/12 mt-12 md:mt-0 relative aspect-video shadow-[20px_20px_0_#F5F5F5] group-hover:shadow-[20px_20px_0_#D4AF37] transition-shadow duration-500 overflow-hidden">
                <img src="/images/services/process-1.jpg" alt="精准选机" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>

            {/* Step 02 */}
            <div className="relative flex flex-col md:flex-row-reverse items-center justify-between py-16 md:py-24 group">
              <div className="absolute left-[-2px] md:left-1/2 w-4 h-4 bg-[#111111] rounded-full transform -translate-x-1/2 md:group-hover:scale-150 transition-transform hidden md:block z-10"></div>
              
              <div className="md:w-5/12 text-left md:pl-16 relative">
                <span className="absolute -top-10 md:-top-16 md:left-16 text-8xl md:text-[160px] font-black text-gray-50 opacity-80 -z-10 select-none">02</span>
                <h3 className="text-3xl font-black text-[#111111] mb-6">{isZh ? '全卸复检与硬核测试' : 'Full Teardown Reinspection & Load Testing'}</h3>
                <p className="text-gray-500 leading-relaxed font-medium text-[15px]">{isZh ? '绝不只做表面功夫。老练的工程师会将上盖与液压泵彻底暴漏，实机测试怠速动作、极限复合动作，测试黑烟状态并对底盘四轮一带进行全面打分，出具百项检测报告书。' : 'We go far beyond cosmetic inspection. Experienced engineers expose the top cover and hydraulic pump for thorough assessment, conduct live idle and full combined-movement load tests, evaluate exhaust smoke quality, and score the complete undercarriage assembly — producing a 100-item inspection report.'}</p>
              </div>
              <div className="w-full md:w-5/12 mt-12 md:mt-0 relative aspect-video shadow-[-20px_20px_0_#F5F5F5] group-hover:shadow-[-20px_20px_0_#111111] transition-shadow duration-500 overflow-hidden">
                <img src="/images/services/process-2.jpg" alt="核心复检" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>

            {/* Step 03 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between py-16 md:py-24 group">
              <div className="absolute left-[-2px] md:left-1/2 w-4 h-4 bg-[#D4AF37] rounded-full transform -translate-x-1/2 md:group-hover:scale-150 transition-transform hidden md:block z-10"></div>
              
              <div className="md:w-5/12 text-left md:text-right md:pr-16 relative">
                <span className="absolute -top-10 md:-top-16 md:right-16 text-8xl md:text-[160px] font-black text-gray-50 opacity-80 -z-10 select-none">03</span>
                <h3 className="text-3xl font-black text-[#111111] mb-6">{isZh ? '工业级除垢与焕新喷漆' : 'Industrial Degreasing & Factory-Grade Refinishing'}</h3>
                <p className="text-gray-500 leading-relaxed font-medium text-[15px]">{isZh ? '任何设备出港前，均经过高压水流彻底剥离黄油垢与深层硬化泥土，视客户需求进行电脑无色差原厂漆调板翻新。保证每一根接管重获新生，消除隐藏漏油隐患。' : 'Before departure, every machine is subjected to high-pressure washing to fully strip grease buildup and hardened soil. Upon request, computer-matched OEM paint is applied for a factory-finish result. All hydraulic fittings and hoses are renewed to eliminate hidden leak risks.'}</p>
              </div>
              <div className="w-full md:w-5/12 mt-12 md:mt-0 relative aspect-video shadow-[20px_20px_0_#F5F5F5] group-hover:shadow-[20px_20px_0_#D4AF37] transition-shadow duration-500 overflow-hidden">
                <img src="/images/services/process-3.jpg" alt="全车焕新" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>

            {/* Step 04 */}
            <div className="relative flex flex-col md:flex-row-reverse items-center justify-between py-16 md:py-24 group">
              <div className="absolute left-[-2px] md:left-1/2 w-4 h-4 bg-[#111111] rounded-full transform -translate-x-1/2 md:group-hover:scale-150 transition-transform hidden md:block z-10"></div>
              
              <div className="md:w-5/12 text-left md:pl-16 relative">
                <span className="absolute -top-10 md:-top-16 md:left-16 text-8xl md:text-[160px] font-black text-gray-50 opacity-80 -z-10 select-none">04</span>
                <h3 className="text-3xl font-black text-[#111111] mb-6">{isZh ? '在线验交与港口吊装发运' : 'Live Remote Acceptance & Port Dispatch'}</h3>
                <p className="text-gray-500 leading-relaxed font-medium text-[15px]">{isZh ? '由客户参与实时视频动态验机。确认无误后，在专属押运专员护送下进行拆解打托装入集装箱，或直接开上港口 Frame 柜及滚装船甲板进行重型捆扎绑缚，随时在云端跟踪飘洋过海的回程路线。' : 'Clients participate in a real-time live video acceptance inspection. Once confirmed, units are loaded into containers on pallets under escort by our dedicated logistics coordinator, or driven directly onto flat rack or RO-RO vessels with professional heavy lashing applied. Full vessel tracking is available online throughout the voyage.'}</p>
              </div>
              <div className="w-full md:w-5/12 mt-12 md:mt-0 relative aspect-video shadow-[-20px_20px_0_#F5F5F5] group-hover:shadow-[-20px_20px_0_#111111] transition-shadow duration-500 overflow-hidden">
                <img src="/images/services/process-4.jpg" alt="云验收" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 5. 底部统一步伐的询单区 (Identical Direct Conversion Layout - Dark Premium) */}
      <section className="w-full py-24 bg-[#111111] border-t border-white/5 relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
        
        <div className="max-w-[900px] mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6">
              {isZh ? '期待未来与您' : 'READY TO WORK WITH YOU'} <span className="text-[#D4AF37]">{isZh ? '极度密切合作' : 'CLOSELY'}</span>
            </h2>
            <p className="text-gray-400 text-sm font-medium">{isZh ? '填写需求型号与目标港口，12小时内获取极致竞争力的 CIF 到岸底价。' : 'Provide your requirements and destination port for an extremely competitive CIF quote within 12 hours.'}</p>
          </div>

          <div className="bg-[#1A1A1A] p-10 md:p-14 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 mx-auto rounded-[32px] relative overflow-hidden">
             
             {/* 琥珀色高级氛围光晕 */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-[0.07] blur-[80px] rounded-full pointer-events-none"></div>

             <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-[#111111] rounded-2xl px-6 py-2 border border-white/5 focus-within:border-[#D4AF37]/40 focus-within:bg-[#000000] transition-all group">
                     <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mt-2 block">{isZh ? '您的称谓' : 'YOUR NAME'}</label>
                     <input name="name" type="text" placeholder={isZh ? "您的称呼" : "Your Name"} className="w-full py-2 text-sm focus:outline-none bg-transparent font-medium text-white placeholder:text-gray-600" />
                   </div>
                   <div className="bg-[#111111] rounded-2xl px-6 py-2 border border-white/5 focus-within:border-[#D4AF37]/40 focus-within:bg-[#000000] transition-all group">
                     <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mt-2 block">{isZh ? '联系方式 (WhatsApp / 邮箱)' : 'CONTACT (WHATSAPP/EMAIL)'}</label>
                     <input name="contact" type="text" placeholder={isZh ? "联系方式" : "Contact Details"} className="w-full py-2 text-sm focus:outline-none bg-transparent font-medium text-white placeholder:text-gray-600" />
                   </div>
                 </div>

                 <div className="bg-[#111111] rounded-2xl px-6 py-4 border border-white/5 focus-within:border-[#D4AF37]/40 focus-within:bg-[#000000] transition-all group">
                   <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2 block">{isZh ? '工况与型号需求' : 'REQUIREMENTS'}</label>
                   <textarea name="message" placeholder={isZh ? "请描述您的意向机械型号与工况需求..." : "Please describe your machinery requirements..."} rows={4} className="w-full py-2 text-sm focus:outline-none bg-transparent resize-none font-medium text-white placeholder:text-gray-600"></textarea>
                 </div>

                 <div className="flex flex-col sm:flex-row items-center gap-6 mt-6">
                   <div className="flex items-center gap-3 shrink-0 lg:mr-4">
                      <a href="https://wa.me/8615375319246" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-[#111111] border border-white/10 text-gray-500 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all duration-300 group shadow-sm" title="WhatsApp">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" className="group-hover:scale-110 transition-transform"><path d="M11.996 0a11.965 11.965 0 00-10.23 18.238L.044 24l6.012-1.632A11.968 11.968 0 1011.996 0zm6.657 17.244c-.266.75-1.523 1.455-2.107 1.517-.5.061-1.144.15-3.333-.762-2.646-1.096-4.35-3.805-4.48-4.004-.13-.198-1.071-1.423-1.071-2.716 0-1.291.674-1.924.912-2.19.239-.265.518-.33.69-.33.17 0 .343 0 .493.007.158.007.368-.06.574.4.215.474.721 1.777.786 1.909.066.133.111.288.026.467-.085.18-.129.294-.258.438-.13.14-.268.309-.387.433-.13.13-.264.276-.115.539.148.261.662 1.11 1.402 1.874.953.985 1.79 1.285 2.052 1.405.263.12.417.098.572-.078.155-.175.67-1.02.85-1.371.18-.35.358-.291.597-.197.24.093 1.517.714 1.776.843.256.13.43.193.493.302.062.108.062.631-.205 1.38z"/></svg>
                      </a>
                      <a href="#" className="w-14 h-14 rounded-full bg-[#111111] border border-white/10 text-gray-500 hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-all duration-300 group shadow-sm" title="LinkedIn">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" className="group-hover:scale-110 transition-transform"><path d="M22.23 0H1.77C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.008zM7.12 20.452H3.558V9h3.562v11.452zm-1.78-13.02c-1.144 0-2.065-.925-2.065-2.064 0-1.139.92-2.064 2.065-2.064 1.14 0 2.064.925 2.064 2.064 0 1.139-.924 2.064-2.064 2.064zm15.11 13.02h-3.553v-5.569c0-1.328-.027-3.037-1.852-3.037-1.854 0-2.136 1.445-2.136 2.939v5.667H9.354V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z"/></svg>
                      </a>
                      <a href="#" className="w-14 h-14 rounded-full bg-[#111111] border border-white/10 text-gray-500 hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-300 group shadow-sm" title="Facebook">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" className="group-hover:scale-110 transition-transform"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </a>
                   </div>

                   <button type="submit" disabled={submitState === 'loading'} className="flex-1 w-full h-[60px] bg-[#D4AF37] text-[#111111] text-[13px] font-black tracking-[0.2em] uppercase hover:bg-white hover:text-black hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                     {submitState === 'loading' ? (isZh ? '提交中...' : 'SUBMITTING...') : <>{isZh ? '立即获取 CIF 底价' : 'GET CIF PRICE NOW'} <Send size={16} /></>}
                   </button>
                 </div>
                 {submitMessage && (
                   <p className={`text-sm font-medium text-center ${submitState === 'success' ? 'text-[#D4AF37]' : 'text-red-400'}`}>{submitMessage}</p>
                 )}
              </form>
          </div>
        </div>
      </section>

    </main>
  );
}
