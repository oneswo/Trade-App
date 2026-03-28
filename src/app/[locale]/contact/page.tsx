'use client';
import { MapPin, Phone, Mail, Clock, Send, UserCheck, Globe, Building2, HeadphonesIcon } from 'lucide-react';
import { useInquirySubmit } from "@/hooks/useInquirySubmit";

export default function ContactPage() {
  const { submitState, submitMessage, handleSubmit } = useInquirySubmit({
    source: "contact-page-form",
  });

  return (
    <main className="w-full bg-[#FAFAFA] pt-20">
      
      {/* 1. 总部航点与核心联络网 (Headquarters & Direct Lines) */}
      <section className="w-full flex flex-col lg:flex-row min-h-[700px] border-b border-gray-100">
        
        {/* Left: Info Center */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center p-12 md:p-24 bg-[#111111] text-white">
          <span className="text-[#D4AF37] text-[11px] font-bold tracking-[0.3em] uppercase mb-6 block">Global Connect</span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
            全天候响应，<br/>无国界连线。
          </h1>
          <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-md mb-16">
             不论您身处何种时区与大洲，我们的国际贸易工程师都将在 12 小时内为您响应跨洋货单、型号垂询与实机验车请求。
          </p>

          <div className="flex flex-col gap-10">
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-sm shrink-0 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all duration-300">
                <MapPin className="text-white group-hover:text-[#111111] transition-colors" size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-white">上海总部与调度中枢</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  中国上海市奉贤区金海公路6055号<br/>
                  (紧邻特大型滚装海运港口)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-sm shrink-0 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all duration-300">
                <Mail className="text-white group-hover:text-[#111111] transition-colors" size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-white">全尺寸报价邮箱</h4>
                <a href="mailto:15156888267@163.com" className="text-gray-400 hover:text-white transition-colors text-sm font-bold tracking-widest uppercase block mb-1">
                  15156888267@163.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-sm shrink-0 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all duration-300">
                <HeadphonesIcon className="text-white group-hover:text-[#111111] transition-colors" size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-white">24小时全球技术抢修部</h4>
                <a href="tel:+8617321077956" className="text-gray-400 hover:text-white transition-colors text-sm font-bold tracking-widest uppercase block mb-1">
                  +86 17321077956
                </a>
                <p className="text-gray-600 text-xs font-bold uppercase tracking-widest mt-2">( 承接全语种技术在线指导 )</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: 实景真实可互动的谷歌地图 (Interactive Google Maps for Trust) */}
        <div className="w-full lg:w-[55%] relative group min-h-[400px] lg:min-h-full bg-gray-100 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none group-hover:opacity-0 transition-opacity duration-500 bg-black/10 z-10"></div>
          <iframe 
            src="https://maps.google.com/maps?q=Shanghai%20Fengxian%20District%20Jinhai%20Highway%206055&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=&amp;output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full grayscale-[40%] contrast-[110%] group-hover:grayscale-0 transition-all duration-[1500ms]"
          ></iframe>
          
          {/* 保留右下角的精美元件 */}
          <div className="absolute bottom-12 right-12 z-20 bg-white/90 backdrop-blur-xl border border-gray-200 p-6 flex items-center gap-4 shadow-2xl pointer-events-none">
             <div className="relative flex h-4 w-4">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
               <span className="relative inline-flex rounded-full h-4 w-4 bg-[#ef4444]"></span>
             </div>
             <div>
               <p className="text-[#111111] font-black tracking-widest text-xs uppercase mb-1">KXTJ Global Base</p>
               <p className="text-gray-500 font-medium text-[10px] tracking-[0.2em] uppercase">上海 奉贤区</p>
             </div>
          </div>
        </div>
      </section>

      {/* 2. 全球大区执行特派员 (Executive Connect Reps) */}
      <section className="w-full py-32 bg-[#FAFAFA]">
        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[#111111] tracking-tighter mb-6">直连大区业务董事</h2>
            <div className="w-12 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-gray-500 text-sm font-medium">跳过漫长的转接等待。我们根据全球大洲划分了独立的业务战区，随时接管您的专线询盘。</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Rep 1 */}
            <div className="bg-white p-8 border border-gray-200 hover:border-[#111111] hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-500 group flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#FAFAFA] border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#111111] group-hover:border-[#111111] transition-all duration-500">
                 <UserCheck size={30} strokeWidth={1.5} className="text-gray-400 group-hover:text-[#D4AF37] transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-[#111111] mb-2">尹世兵</h3>
              <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] mb-8">亚太区执行董事</p>
              
              <div className="w-full space-y-4 text-left border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">直线专电</span>
                  <a href="tel:+8615156888267" className="text-[#111111] font-bold hover:text-[#D4AF37] transition-colors">+86 15156888267</a>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">WhatsApp</span>
                  <a href="#" className="text-[#111111] font-bold hover:text-[#D4AF37] transition-colors">+86 15156888267</a>
                </div>
                <div className="flex flex-col text-sm mt-4 gap-1">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">独立报价邮箱</span>
                  <a href="mailto:15156888267@163.com" className="text-[#111111] font-bold hover:text-[#D4AF37] transition-colors overflow-hidden text-ellipsis whitespace-nowrap">15156888267@163.com</a>
                </div>
              </div>
            </div>

            {/* Rep 2 */}
            <div className="bg-white p-8 border border-gray-200 hover:border-[#111111] hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-500 group flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#FAFAFA] border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#111111] group-hover:border-[#111111] transition-all duration-500">
                 <UserCheck size={30} strokeWidth={1.5} className="text-gray-400 group-hover:text-[#D4AF37] transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-[#111111] mb-2">尹洪峰</h3>
              <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] mb-8">拉美与北非高级代办</p>
              
              <div className="w-full space-y-4 text-left border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">直线专电</span>
                  <a href="tel:+8619159103568" className="text-[#111111] font-bold hover:text-[#D4AF37] transition-colors">+86 19159103568</a>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">WhatsApp</span>
                  <a href="#" className="text-[#111111] font-bold hover:text-[#D4AF37] transition-colors">+86 19159103568</a>
                </div>
                <div className="flex flex-col text-sm mt-4 gap-1">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">独立报价邮箱</span>
                  <a href="mailto:yhf030501@163.com" className="text-[#111111] font-bold hover:text-[#D4AF37] transition-colors overflow-hidden text-ellipsis whitespace-nowrap">yhf030501@163.com</a>
                </div>
              </div>
            </div>

            {/* Rep 3 */}
            <div className="bg-white p-8 border border-gray-200 hover:border-[#111111] hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-500 group flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#FAFAFA] border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#111111] group-hover:border-[#111111] transition-all duration-500">
                 <UserCheck size={30} strokeWidth={1.5} className="text-gray-400 group-hover:text-[#D4AF37] transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-[#111111] mb-2">安娜·李</h3>
              <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] mb-8">欧亚与中东商务总监</p>
              
              <div className="w-full space-y-4 text-left border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">直线专电</span>
                  <a href="tel:+8617321077956" className="text-[#111111] font-bold hover:text-[#D4AF37] transition-colors">+86 17321077956</a>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">WhatsApp</span>
                  <a href="#" className="text-[#111111] font-bold hover:text-[#D4AF37] transition-colors">+86 17321077956</a>
                </div>
                <div className="flex flex-col text-sm mt-4 gap-1">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">独立报价邮箱</span>
                  <a href="mailto:17321077956y@gmail.com" className="text-[#111111] font-bold hover:text-[#D4AF37] transition-colors overflow-hidden text-ellipsis whitespace-nowrap">17321077956y@gmail.com</a>
                </div>
              </div>
            </div>

            {/* Rep 4 */}
             <div className="bg-white p-8 border border-gray-200 hover:border-[#111111] hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-500 group flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#FAFAFA] border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#111111] group-hover:border-[#111111] transition-all duration-500">
                 <UserCheck size={30} strokeWidth={1.5} className="text-gray-400 group-hover:text-[#D4AF37] transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-[#111111] mb-2">安妮</h3>
              <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] mb-8">泛西非大区专员</p>
              
              <div className="w-full space-y-4 text-left border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">直线专电</span>
                  <a href="tel:+8617317763969" className="text-[#111111] font-bold hover:text-[#D4AF37] transition-colors">+86 17317763969</a>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">WhatsApp</span>
                  <a href="#" className="text-[#111111] font-bold hover:text-[#D4AF37] transition-colors">+86 17317763969</a>
                </div>
                <div className="flex flex-col text-sm mt-4 gap-1">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">独立报价邮箱</span>
                  <a href="mailto:kxtjmachinery@gmail.com" className="text-[#111111] font-bold hover:text-[#D4AF37] transition-colors overflow-hidden text-ellipsis whitespace-nowrap">kxtjmachinery@gmail.com</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. 底部终极收网表单 (Direct Inquiry Line) */}
      <section className="w-full py-32 bg-white border-t border-gray-100">
        <div className="max-w-[900px] mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#111111] mb-6">即刻开启您的<span className="text-[#D4AF37]">重装之行</span></h2>
            <p className="text-gray-500 text-sm font-medium">只需在联系表格中留下您的电子件或电话，我们即可向您发送各大厂牌机皇底价和私密库存表。</p>
          </div>

          <div className="bg-white p-10 md:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100 mx-auto rounded-sm">
             <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                 <input
                   type="text"
                   name="website"
                   autoComplete="off"
                   tabIndex={-1}
                   className="hidden"
                   aria-hidden="true"
                 />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="border-b border-gray-300 focus-within:border-[#111111] transition-colors group">
                     <input name="name" required type="text" placeholder="您的姓名 *" className="w-full py-3 text-sm focus:outline-none bg-transparent font-medium group-focus-within:placeholder:text-gray-400" />
                   </div>
                   <div className="border-b border-gray-300 focus-within:border-[#111111] transition-colors group">
                     <input name="contact" required type="text" placeholder="电子邮箱或 WhatsApp *" className="w-full py-3 text-sm focus:outline-none bg-transparent font-medium group-focus-within:placeholder:text-gray-400" />
                   </div>
                 </div>
                 <div className="border-b border-gray-300 focus-within:border-[#111111] transition-colors group pt-2">
                   <textarea name="message" required placeholder="您需要哪些型号的重装机械报价? (例如: 需要三一 36C 挖掘机发往西非) *" rows={4} className="w-full py-3 text-sm focus:outline-none bg-transparent resize-none font-medium group-focus-within:placeholder:text-gray-400"></textarea>
                 </div>
                 {submitMessage ? (
                   <p className={`text-xs font-medium ${submitState === "success" ? "text-green-600" : "text-red-500"}`}>
                     {submitMessage}
                   </p>
                 ) : null}
                 
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
                   
                   <button
                     type="submit"
                     disabled={submitState === "loading"}
                     className="flex-1 w-full h-14 bg-[#111111] text-white text-[13px] font-bold tracking-[0.2em] uppercase hover:bg-[#D4AF37] hover:text-black transition-colors flex items-center justify-center gap-3 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                   >
                     {submitState === "loading" ? "提交中..." : "立即发送建联请求"} <Send size={16} />
                   </button>
                 </div>
              </form>
          </div>
        </div>
      </section>

    </main>
  );
}
