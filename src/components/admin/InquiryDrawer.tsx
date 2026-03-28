"use client";

import { X, Mail, Phone, MapPin, ExternalLink, CalendarDays, ArrowRight, MessageSquare, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

// 定义通用的类型，方便多页面复用
export interface InquiryData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  product: string;
  productId?: string | null;
  country: string;
  region: string;
  time: string;
  message?: string;
  isUnread?: boolean;
  status: string;
  createdAt?: string;
}

const STATUS_MAP: Record<string, { label: string; color: string; bgColor: string }> = {
  PENDING:   { label: "待处理",   color: "text-orange-600", bgColor: "bg-orange-50 border-orange-200" },
  CONTACTED: { label: "已联系", color: "text-blue-600",   bgColor: "bg-blue-50 border-blue-200" },
  CLOSED:    { label: "已关闭",    color: "text-gray-500",   bgColor: "bg-gray-100 border-gray-200" },
};

interface InquiryDrawerProps {
  inquiry: InquiryData | null;
  onClose: () => void;
  onMarkRead?: (id: string) => void;
  markingRead?: boolean;
}

export default function InquiryDrawer({
  inquiry,
  onClose,
  onMarkRead,
  markingRead = false,
}: InquiryDrawerProps) {
  useEffect(() => {
    if (inquiry) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [inquiry]);

  return (
    <>
      {/* 背景遮罩 */}
      {inquiry && (
        <div 
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] transition-all"
          onClick={onClose}
        />
      )}

      {/* 内容抽屉 */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-[480px] bg-white border-l border-black/[0.08] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${inquiry ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {inquiry && (
          <div className="flex flex-col h-full max-h-screen">
            
            {/* 抽屉头部 */}
            <div className="flex items-center justify-between border-b border-black/[0.05] bg-[#FAFAFA] px-6 py-4 shrink-0">
              <h2 className="text-[15px] font-bold text-[#111111]/80">询盘详情</h2>
              <button 
                onClick={onClose}
                className="flex items-center justify-center p-1.5 rounded-md text-[#111111]/40 hover:bg-black/[0.04] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* 抽屉滚动内容 */}
            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
              
              {/* 客户名片卡 */}
              <div className="rounded-xl border border-black/[0.05] p-5 bg-[#FAFAFA]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/[0.04] border border-black/[0.08]">
                      <span className="text-[13px] font-bold text-[#111111]/70 tracking-widest uppercase">
                        {inquiry.name.substring(0,2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#111111]">{inquiry.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-[#111111]/40 mt-1">
                        <MapPin size={11} />
                        {inquiry.country} {inquiry.region}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-black/[0.04]">
                  <div className="flex items-center gap-3 text-[13px] text-[#111111]/70">
                    <Mail size={14} className="text-[#111111]/30" />
                    <a href={`mailto:${inquiry.email}`} className="font-medium hover:underline hover:text-black">
                      {inquiry.email}
                    </a>
                  </div>
                  {inquiry.phone && (
                    <div className="flex items-center gap-3 text-[13px] text-[#111111]/70">
                      <Phone size={14} className="text-[#111111]/30" />
                      <a href={`tel:${inquiry.phone}`} className="font-medium hover:underline hover:text-black">
                        {inquiry.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-[13px] text-[#111111]/70">
                    <CalendarDays size={14} className="text-[#111111]/30" />
                    <span>提交于 {inquiry.time}</span>
                  </div>
                </div>
              </div>

              {/* 询盘原文 */}
              {inquiry.message && (
                <div>
                  <h4 className="flex items-center gap-2 text-[11px] font-bold tracking-[0.1em] text-[#111111]/40 uppercase mb-3">
                    <MessageSquare size={13} />
                    客户寄语 (Message)
                  </h4>
                  <div className="rounded-xl bg-orange-50/50 border border-orange-100/50 p-5 text-[14px] leading-relaxed text-[#111111]/80 italic relative">
                    <span className="absolute -top-3 -left-2 text-4xl text-orange-200 font-serif leading-none">&ldquo;</span>
                    {inquiry.message}
                  </div>
                </div>
              )}

              {/* 关联意向产品 */}
              {inquiry.productId && (
                <div>
                  <h4 className="flex items-center gap-2 text-[11px] font-bold tracking-[0.1em] text-[#111111]/40 uppercase mb-3">
                    意向产品 (Interested In)
                  </h4>
                  <div className="flex items-center justify-between rounded-xl border border-black/[0.06] p-3 transition-colors hover:bg-[#FAFAFA]">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-md bg-black/[0.03] flex items-center justify-center">
                        <ImageIcon size={14} className="text-[#111111]/20" />
                      </div>
                      <span className="text-[13px] font-medium text-[#111111]">
                        {inquiry.product}
                      </span>
                    </div>
                    <Link 
                      href={`/admin/products/${inquiry.productId}/edit`}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-black/[0.03] text-[#111111]/40 hover:bg-black hover:text-white transition-colors"
                    >
                      <ExternalLink size={13} />
                    </Link>
                  </div>
                </div>
              )}

              {/* 处理状态管理 */}
              <div>
                <h4 className="text-[11px] font-bold tracking-[0.1em] text-[#111111]/40 uppercase mb-3">
                  标记状态
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(STATUS_MAP).map(([key, config]) => (
                    <button
                      key={key}
                      className={`
                        rounded-lg border py-2 text-[11px] font-bold tracking-wider uppercase transition-colors
                        ${inquiry.status === key 
                          ? `${config.bgColor} ${config.color} border-current ring-1 ring-current ring-offset-1` 
                          : "border-black/[0.06] bg-white text-[#111111]/40 hover:bg-black/[0.02] hover:text-[#111111]"
                        }
                      `}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 内部备注 */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-[0.1em] text-[#111111]/40 uppercase">
                  内部备注 (Internal Notes)
                </label>
                <textarea 
                  rows={4} 
                  placeholder="在此添加仅团队可见的备注..."
                  className="w-full resize-none rounded-xl border border-black/10 bg-[#FAFAFA] p-3 text-sm text-[#111111] placeholder:text-[#111111]/30 outline-none transition-colors focus:border-black/30 focus:bg-white"
                />
              </div>

            </div>

            {/* 抽屉底部操作区 */}
            <div className="border-t border-black/[0.05] p-6 bg-[#FAFAFA] shrink-0">
               <button
                 disabled={!inquiry.isUnread || markingRead}
                 onClick={() => {
                   if (!inquiry.isUnread) return;
                   onMarkRead?.(inquiry.id);
                 }}
                 className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#111111] py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {markingRead
                   ? "更新中..."
                   : inquiry.isUnread
                     ? "标记为已读"
                     : "已读，无需操作"}
                 <ArrowRight size={15} />
               </button>
            </div>

          </div>
        )}
      </div>
    </>
  );
}
