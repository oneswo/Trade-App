"use client";
import { useState, useEffect } from "react";
import { ArrowUp, MessageSquare, X, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useInquirySubmit } from "@/hooks/useInquirySubmit";
import { useLocale } from "next-intl";
import {
  OPEN_INQUIRY_MODAL_EVENT,
  openInquiryModal,
} from "@/lib/inquiries/modal";

export default function GlobalFab() {
  const locale = useLocale();
  const isZh = locale === 'zh';
  const [showTop, setShowTop] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { submitState, submitMessage, handleSubmit } = useInquirySubmit({
    source: "global-inquiry",
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 500);
    };
    const openModalListener = () => setShowModal(true);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener(OPEN_INQUIRY_MODAL_EVENT, openModalListener);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener(OPEN_INQUIRY_MODAL_EVENT, openModalListener);
    };
  }, []);

  return (
    <>
      <div className="fixed bottom-12 md:bottom-16 right-8 z-[90] flex flex-col gap-4 items-center">
        <button 
          onClick={openInquiryModal}
          className="relative w-16 h-16 rounded-full bg-[#111110] text-[#C8960A] shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center justify-center hover:scale-110 transition-transform"
        >
          <div className="absolute inset-0 rounded-full border border-[#C8960A] animate-ping opacity-30"></div>
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
              className="relative w-full max-w-[620px] bg-white p-10 md:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.3)] rounded-3xl mt-4"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-black transition-colors z-20"
                title="关闭"
              >
                <X size={22} />
              </button>
              
              <div className="text-left mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-[#111111] mb-4">
                  {isZh ? '即刻获取定制报价' : 'Get Your Custom Quote Now'}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed max-w-lg font-medium">
                  {isZh ? '提供您的工况需求和采买预算，我们将在 12 小时内为您在全球网络中匹配最佳方案，并给出完整到岸价（CIF）。' : 'Share your operating requirements and target budget. Our dedicated sourcing representative will identify the best-matched alternatives and deliver a full landed cost (CIF) within 12 hours.'}
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
                 
                 <div className="mt-6 flex justify-center">
                   <button
                     type="submit"
                     disabled={submitState === "loading"}
                     className="flex h-14 w-full max-w-[320px] items-center justify-center gap-3 rounded-full bg-[#111111] text-[13px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-colors hover:bg-[#D4AF37] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                   >
                     {submitState === "loading" ? (isZh ? '提交中...' : 'Submitting...') : (isZh ? '获取专属定制报价' : 'Get Custom Quote')} <Send size={16} />
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
