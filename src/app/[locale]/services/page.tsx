'use client';
import { Target, CheckCircle, ShieldCheck, Settings, Handshake, Shield, MonitorPlay, Send, Search, Wrench, Sparkles, Ship } from "lucide-react";
import Image from "next/image";

export default function ServicesPage() {
  return (
    <main className="w-full bg-[#FAFAFA] pt-20">
      {/* 1. 沉浸式英雄头图 (Cinematic Hero) */}
      <section className="relative w-full min-h-[500px] flex items-center justify-center bg-[#111111] overflow-hidden">
        {/* 背景暗纹蒙版 */}
        <div className="absolute inset-0 opacity-20 bg-[url('/images/services/process-4.jpg')] bg-cover bg-center mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-transparent"></div>
        
        <div className="relative z-10 text-center px-4 mt-8">
          <span className="text-[#D4AF37] text-sm font-bold tracking-[0.3em] uppercase mb-4 block">KXTJ Global Network</span>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 shadow-2xl">
            全球采购，<span className="text-[#D4AF37]">全程无忧。</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            从机器查勘到最终交付，我们提供全链路的保姆式出海服务，确保每一台重装设备以巅峰状态抵达您的矿山与工地。
          </p>
        </div>
      </section>

      {/* 2. 六大特权服务矩阵 (Premium Service Matrix) */}
      <section className="w-full py-24 md:py-32 bg-[#FAFAFA]">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[#111111] tracking-tighter mb-6">旗舰级专业服务保障</h2>
            <div className="w-12 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group bg-white p-12 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 border border-gray-100 hover:border-[#D4AF37]/30">
              <div className="w-16 h-16 bg-[#111111] text-[#D4AF37] flex items-center justify-center rounded-xs mb-8 group-hover:scale-110 transition-transform">
                <Target size={28} />
              </div>
              <h3 className="text-xl font-black text-[#111111] mb-4">客制化找机寻源</h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium">利用庞大的全球货源数据库与厂方人脉脉络，根据您的型号、小时数、预算等精准需求，实行全网反向寻机，绝不妥协任何一处瑕疵。</p>
            </div>
            
            {/* Card 2 */}
            <div className="group bg-white p-12 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 border border-gray-100 hover:border-[#D4AF37]/30">
              <div className="w-16 h-16 bg-[#111111] text-[#D4AF37] flex items-center justify-center rounded-xs mb-8 group-hover:scale-110 transition-transform">
                <CheckCircle size={28} />
              </div>
              <h3 className="text-xl font-black text-[#111111] mb-4">原厂级拆卸整备</h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium">独家聘用一线品牌退役资深液压与动力工程师。全维深度测试核心三大件（发动机、液压泵、分配器），符合100项严苛出海标准才予以放行。</p>
            </div>

            {/* Card 3 */}
            <div className="group bg-white p-12 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 border border-gray-100 hover:border-[#D4AF37]/30">
              <div className="w-16 h-16 bg-[#111111] text-[#D4AF37] flex items-center justify-center rounded-xs mb-8 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-black text-[#111111] mb-4">可靠装箱与发运</h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium">掌握拆解、防锈、打包木架的核心工艺。针对 RO-RO 滚装船或 Flat Rack 框架柜提供极致安全的捆扎绑缚，杜绝任何海运颠簸受损。</p>
            </div>

            {/* Card 4 */}
            <div className="group bg-white p-12 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 border border-gray-100 hover:border-[#D4AF37]/30">
              <div className="w-16 h-16 bg-[#111111] text-[#D4AF37] flex items-center justify-center rounded-xs mb-8 group-hover:scale-110 transition-transform">
                <Settings size={28} />
              </div>
              <h3 className="text-xl font-black text-[#111111] mb-4">五星级配件补给</h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium">附赠高频易损件保养包。滤芯、履带指、斗齿等消耗品以极具竞争力的出厂底价随船配发，扫除在偏远矿区无配换的后顾之忧。</p>
            </div>

            {/* Card 5 */}
            <div className="group bg-white p-12 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 border border-gray-100 hover:border-[#D4AF37]/30">
              <div className="w-16 h-16 bg-[#111111] text-[#D4AF37] flex items-center justify-center rounded-xs mb-8 group-hover:scale-110 transition-transform">
                <Handshake size={28} />
              </div>
              <h3 className="text-xl font-black text-[#111111] mb-4">清关文书与合规</h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium">免费包办出口报关单证、原产地商检证书、海运提单 (B/L) 以及目的港特许清关所需的极高标准合规文件，确保您顺利清关免重税。</p>
            </div>

            {/* Card 6 - Dark Highlight (CTA) */}
            <div className="group bg-[#111111] p-12 shadow-[0_20px_40px_rgba(212,175,55,0.15)] transition-all duration-500 border border-[#D4AF37]/20 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] opacity-10 blur-[50px] rounded-full"></div>
              <div className="relative z-10">
                <h3 className="text-4xl font-black text-white mb-6 leading-tight tracking-tighter">找不到<br/>特定机械？</h3>
                <p className="text-gray-400 leading-relaxed text-sm font-medium mb-10">独家内网通道，为您直接截胡暂未面市的厂矿顶配成色一手退役机资源。</p>
              </div>
              
              <button onClick={() => window.dispatchEvent(new Event('open-inquiry-modal'))} className="relative z-10 w-fit inline-flex items-center gap-2 text-[#D4AF37] text-sm font-bold tracking-widest uppercase hover:text-white transition-colors group/btn">
                立即委托寻车
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
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">赢得世界各地客商的信任</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="flex flex-col items-center text-center pt-8 md:pt-0 pb-8 md:pb-0 px-8">
              <Shield className="text-[#D4AF37] mb-8" size={48} strokeWidth={1.5} />
              <h4 className="text-xl font-bold text-white mb-4">包装与物流直签</h4>
              <p className="text-gray-400 text-sm leading-relaxed">我们拥有完全自营的超级仓储与打包工厂，杜绝第三方外包造成的野蛮装卸，对客户利益安全负责到底。</p>
            </div>
            <div className="flex flex-col items-center text-center pt-8 md:pt-0 pb-8 md:pb-0 px-8">
              <MonitorPlay className="text-[#D4AF37] mb-8" size={48} strokeWidth={1.5} />
              <h4 className="text-xl font-bold text-white mb-4">云端全景试机送货</h4>
              <p className="text-gray-400 text-sm leading-relaxed">采用超清 4K 多机位云端直播或实地视频连线验收，您在千里之外的办公室即可俯瞰发动机内部构造与全车液压状态。</p>
            </div>
            <div className="flex flex-col items-center text-center pt-8 md:pt-0 pb-8 md:pb-0 px-8">
              <Handshake className="text-[#D4AF37] mb-8" size={48} strokeWidth={1.5} />
              <h4 className="text-xl font-bold text-white mb-4">无缝海外技术指导</h4>
              <p className="text-gray-400 text-sm leading-relaxed">除了完备的图解维修说明，KXTJ 独创海外专属售后 1V1 技术群，遇到任何机械疑难杂症随时可进行在线视频排障。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 极致流程步骤 (The Zig-Zag Process) */}
      <section className="w-full py-32 bg-white relative">
        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <div className="text-center mb-32">
            <h2 className="text-4xl md:text-5xl font-black text-[#111111] tracking-tighter mb-6">提验机全周期标准流程</h2>
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
                <h3 className="text-3xl font-black text-[#111111] mb-6">二手寻机与严选匹配</h3>
                <p className="text-gray-500 leading-relaxed font-medium text-[15px]">我们在全球各大矿场直接筛选出状态极致优秀的成色一手设备。只挑选底盘扎实、车况原版极品的高回本率神机，从货源源头上彻底扼杀事故车、水淹车和组装车。</p>
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
                <h3 className="text-3xl font-black text-[#111111] mb-6">全卸复检与硬核测试</h3>
                <p className="text-gray-500 leading-relaxed font-medium text-[15px]">绝不只做表面功夫。老练的工程师会将上盖与液压泵彻底暴漏，实机测试怠速动作、极限复合动作，测试黑烟状态并对底盘四轮一带进行全面打分，出具百项检测报告书。</p>
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
                <h3 className="text-3xl font-black text-[#111111] mb-6">工业级除垢与焕新喷漆</h3>
                <p className="text-gray-500 leading-relaxed font-medium text-[15px]">任何设备出港前，均经过高压水流彻底剥离黄油垢与深层硬化泥土，视客户需求进行电脑无色差原厂漆调板翻新。保证每一根接管重获新生，消除隐藏漏油隐患。</p>
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
                <h3 className="text-3xl font-black text-[#111111] mb-6">在线验交与木笼装船</h3>
                <p className="text-gray-500 leading-relaxed font-medium text-[15px]">最后由客户参与实时视频动态验机。确认无误后，在专属押运专员护送下开上港口 Frame 柜或滚装甲板重型捆扎。生成物流提单号，随时在云端跟踪飘洋过海的回程路线。</p>
              </div>
              <div className="w-full md:w-5/12 mt-12 md:mt-0 relative aspect-video shadow-[-20px_20px_0_#F5F5F5] group-hover:shadow-[-20px_20px_0_#111111] transition-shadow duration-500 overflow-hidden">
                <img src="/images/services/process-4.jpg" alt="云验收" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 5. 底部统一步伐的询单区 (Identical Direct Conversion Layout) */}
      <section className="w-full py-24 bg-[#FAFAFA] border-t border-gray-200">
        <div className="max-w-[900px] mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#111111] mb-6">我们期待未来与您<span className="text-[#D4AF37]">密切合作</span></h2>
            <p className="text-gray-500 text-sm font-medium">填写需求型号与目标港口，12小时内获取极致竞争力的 CIF 到底岸底价。</p>
          </div>

          <div className="bg-white p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 mx-auto">
             <form className="flex flex-col gap-6">
                 <div className="border-b border-gray-300 focus-within:border-[#111111] transition-colors group">
                   <input type="text" placeholder="您的称呼 *" className="w-full py-3 text-sm focus:outline-none bg-transparent font-medium group-focus-within:placeholder:text-gray-400" />
                 </div>
                 <div className="border-b border-gray-300 focus-within:border-[#111111] transition-colors group">
                   <input type="text" placeholder="WhatsApp / 邮箱 *" className="w-full py-3 text-sm focus:outline-none bg-transparent font-medium group-focus-within:placeholder:text-gray-400" />
                 </div>
                 <div className="border-b border-gray-300 focus-within:border-[#111111] transition-colors group pt-2">
                   <textarea placeholder="意向机械与特定工况需求 (必填)" rows={4} className="w-full py-3 text-sm focus:outline-none bg-transparent resize-none font-medium group-focus-within:placeholder:text-gray-400"></textarea>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                   <div className="flex items-center gap-3 shrink-0 lg:mr-4">
                      <a href="#" className="w-14 h-14 rounded-full border border-gray-200 text-gray-400 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all duration-300 group" title="WhatsApp">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" className="group-hover:scale-110 transition-transform"><path d="M11.996 0a11.965 11.965 0 00-10.23 18.238L.044 24l6.012-1.632A11.968 11.968 0 1011.996 0zm6.657 17.244c-.266.75-1.523 1.455-2.107 1.517-.5.061-1.144.15-3.333-.762-2.646-1.096-4.35-3.805-4.48-4.004-.13-.198-1.071-1.423-1.071-2.716 0-1.291.674-1.924.912-2.19.239-.265.518-.33.69-.33.17 0 .343 0 .493.007.158.007.368-.06.574.4.215.474.721 1.777.786 1.909.066.133.111.288.026.467-.085.18-.129.294-.258.438-.13.14-.268.309-.387.433-.13.13-.264.276-.115.539.148.261.662 1.11 1.402 1.874.953.985 1.79 1.285 2.052 1.405.263.12.417.098.572-.078.155-.175.67-1.02.85-1.371.18-.35.358-.291.597-.197.24.093 1.517.714 1.776.843.256.13.43.193.493.302.062.108.062.631-.205 1.38z"/></svg>
                      </a>
                      <a href="#" className="w-14 h-14 rounded-full border border-gray-200 text-gray-400 hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-all duration-300 group" title="LinkedIn">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" className="group-hover:scale-110 transition-transform"><path d="M22.23 0H1.77C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.008zM7.12 20.452H3.558V9h3.562v11.452zm-1.78-13.02c-1.144 0-2.065-.925-2.065-2.064 0-1.139.92-2.064 2.065-2.064 1.14 0 2.064.925 2.064 2.064 0 1.139-.924 2.064-2.064 2.064zm15.11 13.02h-3.553v-5.569c0-1.328-.027-3.037-1.852-3.037-1.854 0-2.136 1.445-2.136 2.939v5.667H9.354V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z"/></svg>
                      </a>
                      <a href="#" className="w-14 h-14 rounded-full border border-gray-200 text-gray-400 hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-300 group" title="Facebook">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" className="group-hover:scale-110 transition-transform"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </a>
                   </div>
                   
                   <button type="button" className="flex-1 w-full h-14 bg-[#111111] text-white text-[13px] font-bold tracking-[0.2em] uppercase hover:bg-[#D4AF37] hover:text-black transition-colors flex items-center justify-center gap-3 shadow-md">
                     立即询盘发车 <Send size={16} />
                   </button>
                 </div>
              </form>
          </div>
        </div>
      </section>

    </main>
  );
}
