"use client";
import { useState, useEffect } from "react";
import { ArrowUp, MessageSquare, X, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useInquirySubmit } from "@/hooks/useInquirySubmit";
import { useLocale } from "next-intl";

export default function GlobalFab() {
  const locale = useLocale();
  const isZh = locale === 'zh';
  const [showTop, setShowTop] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { submitState, submitMessage, handleSubmit } = useInquirySubmit({
    source: "global-fab",
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 500);
    };
    const openModalListener = () => setShowModal(true);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("open-inquiry-modal", openModalListener);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("open-inquiry-modal", openModalListener);
    };
  }, []);

  return (
    <>
      <div className="fixed bottom-12 md:bottom-16 right-8 z-[90] flex flex-col gap-4 items-center">
        <button 
          onClick={() => setShowModal(true)}
          className="relative w-16 h-16 rounded-full bg-[#111111] text-[#D4AF37] shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center justify-center hover:scale-110 transition-transform"
        >
          <div className="absolute inset-0 rounded-full border border-[#D4AF37] animate-ping opacity-30"></div>
          <MessageSquare size={24} />
        </button>
        {showTop && (
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-14 h-14 rounded-full bg-white text-black shadow-2xl flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <ArrowUp size={20} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative w-full max-w-[620px] bg-white p-10 md:p-14 shadow-2xl rounded-sm mt-4"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-black transition-colors z-20"
                title="关闭"
              >
                <X size={22} />
              </button>
              
              <div className="text-center mb-10 mt-2">
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#111111] mb-5">
                  {isZh ? '获取极速报价与' : 'Get a Fast Quote &'}<span className="text-[#D4AF37]">{isZh ? '找车服务' : 'Sourcing Service'}</span>
                </h2>
                <p className="text-gray-500 text-[13px] md:text-sm leading-relaxed max-w-md mx-auto font-medium">
                  {isZh ? '我们的专属海外销售代表将提供 1 对 1 服务，12 小时内为您核算出包含物流在内的最终到岸价格（CIF）。' : 'Our dedicated overseas sales representative will provide 1-on-1 support and deliver a full landed cost, including freight (CIF), within 12 hours.'}
                </p>
              </div>
              
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                 <input
                   type="text"
                   name="website"
                   autoComplete="off"
                   tabIndex={-1}
                   className="hidden"
                   aria-hidden="true"
                 />
                 <div className="border-b border-gray-300 focus-within:border-[#111111] transition-colors group">
                   <input name="name" required type="text" placeholder={isZh ? '您的称呼 *' : 'Your Name *'} className="w-full py-3 text-sm focus:outline-none bg-transparent font-medium group-focus-within:placeholder:text-gray-400" />
                 </div>
                 <div className="border-b border-gray-300 focus-within:border-[#111111] transition-colors group">
                   <input name="contact" required type="text" placeholder={isZh ? 'WhatsApp / 邮箱 *' : 'WhatsApp / Email *'} className="w-full py-3 text-sm focus:outline-none bg-transparent font-medium group-focus-within:placeholder:text-gray-400" />
                 </div>
                 <div className="border-b border-gray-300 focus-within:border-[#111111] transition-colors group pt-2">
                   <textarea name="message" required placeholder={isZh ? '意向机械与特定工况需求 (必填)' : 'Machine of interest & specific operating requirements (required)'} rows={3} className="w-full py-3 text-sm focus:outline-none bg-transparent resize-none font-medium group-focus-within:placeholder:text-gray-400"></textarea>
                 </div>
                 {submitMessage ? (
                   <p
                     className={`text-xs font-medium ${
                       submitState === "success" ? "text-green-600" : "text-red-500"
                     }`}
                   >
                     {submitMessage}
                   </p>
                 ) : null}
                 
                 <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                    <div className="flex items-center gap-3 shrink-0 lg:mr-4">
                      <a href="https://wa.me/8615375319246" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full border border-gray-200 text-gray-400 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all duration-300 group" title="WhatsApp">
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
                     {submitState === "loading" ? (isZh ? '提交中...' : 'Submitting...') : (isZh ? '获取专属定制报价' : 'Request My Custom Quote')} <Send size={16} />
                   </button>
                 </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
