"use client";

import { Save, Image as ImageIcon, MapPin, Mail, Phone, Globe2, Link2 } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-5xl pb-12">
      
      <div className="space-y-8">
        
        {/* ── 区块 1：品牌视觉 ── */}
        <section className="rounded-xl border border-black/[0.06] bg-white p-8 shadow-sm">
          <h2 className="text-[13px] font-bold tracking-[0.1em] text-[#111111] uppercase mb-8 flex items-center gap-2">
            <ImageIcon size={16} className="text-[#111111]/40" />
            品牌视觉 (Brand Assets)
          </h2>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-semibold tracking-wider text-[#111111]/40 uppercase">
                头部 Logo (白底/透明用)
              </label>
              <div className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 bg-[#FAFAFA] transition-colors hover:border-black/30 hover:bg-black/[0.02]">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-black/[0.04]">
                  <ImageIcon size={14} className="text-[#111111]/50" />
                </div>
                <span className="text-[11px] text-[#111111]/40">上传头部 Logo</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-semibold tracking-wider text-[#111111]/40 uppercase">
                底部 Logo (暗底用)
              </label>
              <div className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 bg-[#111111] transition-colors hover:bg-black/80">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 shadow-sm border border-white/[0.04]">
                  <ImageIcon size={14} className="text-white/50" />
                </div>
                <span className="text-[11px] text-white/40">上传深色版 Logo</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 区块 2：联系方式 ── */}
        <section className="rounded-xl border border-black/[0.06] bg-white p-8 shadow-sm">
          <h2 className="text-[13px] font-bold tracking-[0.1em] text-[#111111] uppercase mb-8 flex items-center gap-2">
            <Phone size={16} className="text-[#111111]/40" />
            联系方式 (Contact Info)
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                 主打联系邮箱 (Email)
              </label>
              <div className="flex items-center gap-2 border-b border-black/10 transition-colors duration-200 focus-within:border-black/30">
                <Mail size={14} className="text-[#111111]/30" />
                <input
                  type="text"
                  defaultValue="sales@kxtjexcavator.com"
                  className="w-full bg-transparent py-2.5 text-sm text-[#111111] outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                 官方电话 (Phone / WhatsApp)
              </label>
              <div className="flex items-center gap-2 border-b border-black/10 transition-colors duration-200 focus-within:border-black/30">
                <Phone size={14} className="text-[#111111]/30" />
                <input
                  type="text"
                  defaultValue="+86 138 0000 0000"
                  className="w-full bg-transparent py-2.5 text-sm text-[#111111] outline-none"
                />
              </div>
            </div>

            <div className="col-span-2 space-y-2 pt-2">
              <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
                 公司总部地址 (HQ Address)
              </label>
              <div className="flex items-start gap-2 border-b border-black/10 transition-colors duration-200 focus-within:border-black/30">
                <MapPin size={14} className="text-[#111111]/30 mt-3" />
                <textarea
                  rows={2}
                  defaultValue="No. 18, Industrial Avenue, Jinan City, Shandong Province, China"
                  className="w-full bg-transparent py-2.5 text-[13px] leading-relaxed text-[#111111] outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── 区块 3：社交媒体 ── */}
        <section className="rounded-xl border border-black/[0.06] bg-white p-8 shadow-sm">
          <h2 className="text-[13px] font-bold tracking-[0.1em] text-[#111111] uppercase mb-8 flex items-center gap-2">
            <Globe2 size={16} className="text-[#111111]/40" />
            社交媒体 (Social Links)
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-[100px_1fr] items-center gap-4 border-b border-black/10 focus-within:border-black/30 transition-colors py-1">
               <span className="text-[11px] font-bold tracking-wider text-[#111111]/50 uppercase">YouTube</span>
               <div className="flex items-center gap-2">
                 <Link2 size={13} className="text-[#111111]/20 pb-0.5" />
                 <input type="text" placeholder="https://youtube.com/..." className="w-full bg-transparent py-2 text-sm text-[#111111] placeholder:text-black/20 outline-none" />
               </div>
            </div>
            
            <div className="grid grid-cols-[100px_1fr] items-center gap-4 border-b border-black/10 focus-within:border-black/30 transition-colors py-1">
               <span className="text-[11px] font-bold tracking-wider text-[#111111]/50 uppercase">Facebook</span>
               <div className="flex items-center gap-2">
                 <Link2 size={13} className="text-[#111111]/20 pb-0.5" />
                 <input type="text" placeholder="https://facebook.com/..." className="w-full bg-transparent py-2 text-sm text-[#111111] placeholder:text-black/20 outline-none" />
               </div>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center gap-4 border-b border-black/10 focus-within:border-black/30 transition-colors py-1">
               <span className="text-[11px] font-bold tracking-wider text-[#111111]/50 uppercase">LinkedIn</span>
               <div className="flex items-center gap-2">
                 <Link2 size={13} className="text-[#111111]/20 pb-0.5" />
                 <input type="text" placeholder="https://linkedin.com/..." className="w-full bg-transparent py-2 text-sm text-[#111111] placeholder:text-black/20 outline-none" />
               </div>
            </div>
          </div>
        </section>

      </div>

      <div className="mt-8 flex justify-end">
        <button className="flex items-center justify-center gap-2 rounded-xl bg-[#111111] px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-black/80">
          <Save size={16} />
          保存所有设置
        </button>
      </div>

    </div>
  );
}
