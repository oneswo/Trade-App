'use client';
import { Send, CheckCircle2, ShieldCheck, Globe, Trophy, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="w-full bg-[#FAFAFA] pt-20">
      {/* 1. 沉浸式企业愿景大图 (Corporate Hero Banner) */}
      <section className="relative w-full min-h-[500px] flex items-center justify-center bg-[#111111] overflow-hidden">
        {/* 背景大楼/工厂暗纹蒙版 */}
        <div className="absolute inset-0 opacity-30 bg-[url('/images/about/hero.jpg')] bg-cover bg-center mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-[#111111]/40"></div>
        
        <div className="relative z-10 text-center px-4 mt-8">
          <span className="text-[#D4AF37] text-sm font-bold tracking-[0.3em] uppercase mb-4 block">KXTJ KUNXUAN MACHINERY</span>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 shadow-2xl">
            扎根上海，<span className="text-[#D4AF37]">驱动全球。</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            重塑二手工程机械全球供应链的信任标杆，确保每一台重装设备以巅峰状态抵达海外客户手中。
          </p>
        </div>
      </section>

      {/* 2. 实力档案 (The Scale & Story) */}
      <section className="w-full py-32 bg-white relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          
          <div className="flex flex-col gap-32">
            {/* Block A: 左图右文 - 现代化总库 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between group">
              <div className="w-full md:w-1/2 relative aspect-[4/3] shadow-[-20px_20px_0_#F5F5F5] group-hover:shadow-[-20px_20px_0_#D4AF37] transition-shadow duration-500 overflow-hidden">
                <img src="/images/about/office.jpg" alt="上海现代化总库" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="w-full md:w-5/12 text-left mt-16 md:mt-0 relative md:pl-16">
                <span className="text-[#D4AF37] text-sm font-bold tracking-[0.2em] uppercase mb-4 block">Headquarters & Warehouse</span>
                <h2 className="text-4xl md:text-5xl font-black text-[#111111] leading-tight tracking-tighter mb-8">
                  二手工程机械供应商<br/>领航者
                </h2>
                <p className="text-gray-500 leading-relaxed font-medium text-base mb-6">
                  自2003年成立以来，我们一直致力于为全球客户提供高质量的二手工程机械。公司位于具有全球航运优势的上海市，拥有 2000平米的现代化总急库。
                </p>
                <p className="text-gray-500 leading-relaxed font-medium text-base">
                  配备先进的检测设备和专业的技术人员，确保每一台入库的机器都严格符合最苛刻的国际出海标准。我们提供种类齐全的卡特彼勒、小松、日立等全系挖掘机、装载机与推土机。
                </p>
                
                <ul className="mt-10 space-y-4">
                  <li className="flex items-center gap-3 text-[#111111] font-bold"><CheckCircle2 className="text-[#D4AF37]" size={20} /> 长三角核心航运优势地带</li>
                  <li className="flex items-center gap-3 text-[#111111] font-bold"><CheckCircle2 className="text-[#D4AF37]" size={20} /> 独立机械整备流水线车间</li>
                  <li className="flex items-center gap-3 text-[#111111] font-bold"><CheckCircle2 className="text-[#D4AF37]" size={20} /> 独立专属海运通关物流团队</li>
                </ul>
              </div>
            </div>

            {/* Block B: 右图左文 - 全球声誉 */}
            <div className="relative flex flex-col md:flex-row-reverse items-center justify-between group">
              <div className="w-full md:w-1/2 relative aspect-[4/3] shadow-[20px_20px_0_#F5F5F5] group-hover:shadow-[20px_20px_0_#111111] transition-shadow duration-500 overflow-hidden">
                <img src="/images/about/yard.jpg" alt="全球机械停放阵列" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="w-full md:w-5/12 text-left mt-16 md:mt-0 relative md:pr-16">
                <span className="text-[#D4AF37] text-sm font-bold tracking-[0.2em] uppercase mb-4 block">Global Reputation</span>
                <h2 className="text-4xl md:text-5xl font-black text-[#111111] leading-tight tracking-tighter mb-8">
                  享誉七大洲的<br/>重工品质声誉
                </h2>
                <p className="text-gray-500 leading-relaxed font-medium text-base mb-6">
                  我们拥有近30名资深二手机技术人员组成的售后服务团队，随时准备为您的设备使用提供保驾护航级别的专业技术支持。
                </p>
                <p className="text-gray-500 leading-relaxed font-medium text-base">
                  多年来，我们的产品凭借卓越的性能和原装的品质赢得了全球客户的信赖。我们的产品已被成功大批量出口到俄罗斯、印尼、肯尼亚、坦桑尼亚、秘鲁、巴西等横跨亚非美欧的数十个国家和地区。
                </p>

                <div className="mt-10 grid grid-cols-2 gap-6">
                  <div className="bg-[#FAFAFA] border border-gray-100 p-6">
                    <h4 className="text-[#111111] font-black text-xl mb-2">诚信互利</h4>
                    <p className="text-gray-500 text-sm font-medium">绝不售卖事故组装机械，立足全球长远合作。</p>
                  </div>
                  <div className="bg-[#111111] border border-[#111111] p-6">
                    <h4 className="text-white font-black text-xl mb-2">服务至上</h4>
                    <p className="text-gray-400 text-sm font-medium">专属工程师跨时区进行维护保养无缝对接。</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. 核心硬实力数据条 (Milestone Data Strip) */}
      <section className="w-full py-20 bg-[#111111] relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
        <div className="max-w-[1440px] w-full px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center">
            
            <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
              <span className="text-5xl md:text-6xl font-black text-white mb-2">20<span className="text-[#D4AF37]">+</span></span>
              <span className="text-gray-400 text-sm font-bold tracking-widest uppercase">年行业深耕</span>
            </div>
            
            <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
              <span className="text-5xl md:text-6xl font-black text-white mb-2">30<span className="text-[#D4AF37]">+</span></span>
              <span className="text-gray-400 text-sm font-bold tracking-widest uppercase">名特派工程师</span>
            </div>

            <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
              <span className="text-5xl md:text-6xl font-black text-white mb-2">50<span className="text-[#D4AF37]">+</span></span>
              <span className="text-gray-400 text-sm font-bold tracking-widest uppercase">重卡出海国家</span>
            </div>

            <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
              <span className="text-5xl md:text-6xl font-black text-white mb-2">3000<span className="text-[#D4AF37]">+</span></span>
              <span className="text-gray-400 text-sm font-bold tracking-widest uppercase">台机械安全交付</span>
            </div>

          </div>
        </div>
      </section>

      {/* 4. 全球准入资质墙 (Certification Grid) */}
      <section className="w-full py-32 bg-[#FAFAFA] border-y border-gray-200">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[#111111] tracking-tighter mb-6">我们的行业准入证书</h2>
            <div className="w-12 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-gray-500 text-sm font-medium">公司不断提升专业生产和品控能力，配备了先进的检验测试机构，并拥有遍布全球的销售和服务网络背书。</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Cert 1 */}
            <div className="bg-white p-4 border border-[#D4AF37]/30 shadow-[0_10px_30px_rgba(212,175,55,0.05)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.2)] hover:-translate-y-2 transition-all duration-500 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#111111] text-white flex items-center justify-center z-10 translate-x-12 -translate-y-12 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300">
                <ShieldCheck size={20} className="translate-x-2 translate-y-2" />
              </div>
              <div className="w-full aspect-[3/4] relative bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                <img src="/images/about/cert.jpg" alt="Verified Supplier Certificate" className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              </div>
              <div className="pt-6 pb-2 text-center">
                <h4 className="text-[#111111] font-bold text-sm tracking-wide">VERIFIED SUPPLIER</h4>
              </div>
            </div>

            {/* Cert 2 */}
            <div className="bg-white p-4 border border-[#D4AF37]/30 shadow-[0_10px_30px_rgba(212,175,55,0.05)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.2)] hover:-translate-y-2 transition-all duration-500 overflow-hidden relative group">
               <div className="absolute top-0 right-0 w-16 h-16 bg-[#111111] text-white flex items-center justify-center z-10 translate-x-12 -translate-y-12 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300">
                <Globe size={20} className="translate-x-2 translate-y-2" />
              </div>
              <div className="w-full aspect-[3/4] relative bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                <img src="/images/about/cert.jpg" alt="CE Conformity Certificate" className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              </div>
              <div className="pt-6 pb-2 text-center">
                <h4 className="text-[#111111] font-bold text-sm tracking-wide">CE CONFORMITY</h4>
              </div>
            </div>

            {/* Cert 3 */}
            <div className="bg-white p-4 border border-[#D4AF37]/30 shadow-[0_10px_30px_rgba(212,175,55,0.05)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.2)] hover:-translate-y-2 transition-all duration-500 overflow-hidden relative group">
               <div className="absolute top-0 right-0 w-16 h-16 bg-[#111111] text-white flex items-center justify-center z-10 translate-x-12 -translate-y-12 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300">
                <Trophy size={20} className="translate-x-2 translate-y-2" />
              </div>
              <div className="w-full aspect-[3/4] relative bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                <img src="/images/about/cert.jpg" alt="ISO 9001 Certificate" className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              </div>
              <div className="pt-6 pb-2 text-center">
                <h4 className="text-[#111111] font-bold text-sm tracking-wide">ISO 9001:2015</h4>
              </div>
            </div>

            {/* Cert 4 */}
            <div className="bg-white p-4 border border-[#D4AF37]/30 shadow-[0_10px_30px_rgba(212,175,55,0.05)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.2)] hover:-translate-y-2 transition-all duration-500 overflow-hidden relative group">
               <div className="absolute top-0 right-0 w-16 h-16 bg-[#111111] text-white flex items-center justify-center z-10 translate-x-12 -translate-y-12 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300">
                <Award size={20} className="translate-x-2 translate-y-2" />
              </div>
              <div className="w-full aspect-[3/4] relative bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                <img src="/images/about/cert.jpg" alt="SGS Inspection Report" className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              </div>
              <div className="pt-6 pb-2 text-center">
                <h4 className="text-[#111111] font-bold text-sm tracking-wide">SGS INSPECTION</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 底部一致性询问大表单 (Final Conversion CTA) */}
      <section className="w-full py-24 bg-white">
        <div className="max-w-[900px] mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#111111] mb-6">期待未来与您的<span className="text-[#D4AF37]">密切合作</span></h2>
            <p className="text-gray-500 text-sm font-medium">填写需求型号与工况环境，12小时内获取极致竞争力的 FOB / CIF 出厂底价。</p>
          </div>

          <div className="bg-white p-10 md:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100 mx-auto rounded-sm">
             <form className="flex flex-col gap-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="border-b border-gray-300 focus-within:border-[#111111] transition-colors group">
                     <input type="text" placeholder="您的称呼 *" className="w-full py-3 text-sm focus:outline-none bg-transparent font-medium group-focus-within:placeholder:text-gray-400" />
                   </div>
                   <div className="border-b border-gray-300 focus-within:border-[#111111] transition-colors group">
                     <input type="text" placeholder="WhatsApp / 邮箱 *" className="w-full py-3 text-sm focus:outline-none bg-transparent font-medium group-focus-within:placeholder:text-gray-400" />
                   </div>
                 </div>
                 <div className="border-b border-gray-300 focus-within:border-[#111111] transition-colors group pt-2">
                   <textarea placeholder="留言详情 (如: 寻车型号或对公司的咨询) *" rows={3} className="w-full py-3 text-sm focus:outline-none bg-transparent resize-none font-medium group-focus-within:placeholder:text-gray-400"></textarea>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                   <div className="flex items-center gap-3 shrink-0 lg:mr-4">
                      {/* Social Icons */}
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
                     立即发送建联请求 <Send size={16} />
                   </button>
                 </div>
              </form>
          </div>
        </div>
      </section>

    </main>
  );
}
