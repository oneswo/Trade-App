"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  LifeBuoy, Send, Clock, CheckCircle2, 
  Sparkles, Loader2, MessageSquare,
  Bug, Settings, Trash2, Plus, X
} from "lucide-react";
import Image from "next/image";
import AdminModal from "@/components/admin/AdminModal";

type TicketStatus = "PENDING" | "PROCESSING" | "RESOLVED";
type TicketType = "BUG" | "FEATURE" | "QUESTION";

interface Ticket {
  id: string;
  title: string;
  description: string;
  type: TicketType;
  status: TicketStatus;
  screenshots: string[];
  createdAt: string;
  reply?: string | null;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // 新建表单状态
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<TicketType>("QUESTION");
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);

  // 管理批复弹窗
  const [managementModalOpen, setManagementModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState<TicketStatus>("PENDING");
  const [savingReply, setSavingReply] = useState(false);

  // 删除确认弹窗
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // 图片预览灯箱
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // 每个 slot 对应一个 file input ref
  const slotRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => { fetchTickets(); }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/admin/tickets");
      const data = await res.json();
      if (data.ok) setTickets(data.data);
    } catch (e) { console.error(e); }
    finally { setInitialLoading(false); }
  };

  // 上传某个 slot 的图片
  const handleSlotUpload = async (file: File, slotIndex: number) => {
    setUploadingSlot(slotIndex);
    try {
      const { directUpload } = await import("@/lib/upload");
      const result = await directUpload(file, "image");
      setScreenshots(prev => {
        const next = [...prev];
        if (slotIndex < next.length) {
          next[slotIndex] = result.url;
        } else {
          next.push(result.url);
        }
        return next;
      });
    } catch (e) { console.error(e); }
    finally {
      setUploadingSlot(null);
      if (slotRefs[slotIndex]?.current) slotRefs[slotIndex].current!.value = "";
    }
  };

  const removeScreenshot = (idx: number) => {
    setScreenshots(prev => prev.filter((_, i) => i !== idx));
  };

  // 提交新工单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, type, screenshots })
      });
      const data = await res.json();
      if (data.ok) {
        setTickets([data.data, ...tickets]);
        setTitle("");
        setDescription("");
        setType("QUESTION");
        setScreenshots([]);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openManagement = (t: Ticket) => {
    setSelectedTicket(t);
    setReplyText(t.reply || "");
    setReplyStatus(t.status);
    setManagementModalOpen(true);
  };

  const handleSaveReply = async () => {
    if (!selectedTicket) return;
    setSavingReply(true);
    try {
      const res = await fetch(`/api/admin/tickets/${selectedTicket.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: replyStatus, reply: replyText.trim() || null })
      });
      const data = await res.json();
      if (data.ok) {
        setTickets(tickets.map(t =>
          t.id === selectedTicket.id ? { ...t, status: replyStatus, reply: replyText.trim() || null } : t
        ));
        setManagementModalOpen(false);
      }
    } catch (e) { console.error(e); }
    finally { setSavingReply(false); }
  };

  const promptDeleteTicket = (id: string) => {
    setTicketToDelete(id);
    setDeleteModalOpen(true);
  };

  const executeDeleteTicket = async () => {
    if (!ticketToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/tickets/${ticketToDelete}`, { method: "DELETE" });
      if (res.ok) setTickets(tickets.filter(t => t.id !== ticketToDelete));
    } catch (e) { console.error(e); }
    finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setTicketToDelete(null);
    }
  };

  const getTypeStyle = (t: TicketType) => {
    switch (t) {
      case "BUG": return { icon: Bug, color: "text-red-500", bg: "bg-red-50", border: "border-red-200", label: "故障 / 异常" };
      case "FEATURE": return { icon: Sparkles, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200", label: "新需求建议" };
      case "QUESTION": return { icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-200", label: "日常疑问" };
    }
  };

  const getStatusStyle = (s: TicketStatus) => {
    switch (s) {
      case "PENDING": return { icon: Clock, color: "text-amber-500", label: "待处理 (开发者尚未查阅)" };
      case "PROCESSING": return { icon: Loader2, color: "text-blue-500", label: "处理中 (开发者正在处理)" };
      case "RESOLVED": return { icon: CheckCircle2, color: "text-green-500", label: "已解决 (问题已被修复)" };
    }
  };

  return (
    <div className="space-y-6 pb-20 relative">
      <header className="flex h-20 items-center justify-between rounded-xl border border-black/[0.06] bg-white px-8 shadow-sm">
        <div>
          <h1 className="text-base font-bold text-[#111111] flex items-center gap-2 flex-wrap">
            <LifeBuoy className="text-blue-500" size={18} /> 技术支持中心
            <span className="text-[12px] font-semibold text-[#111111]/50">— 遇到问题或有新功能需求，请在这里写小纸条呼唤开发者！</span>
          </h1>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0"></div>
          <span className="text-[12px] font-bold text-amber-700">20:00 – 24:00 集中处理工单</span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
        {/* 左侧：新建工单 */}
        <div className="xl:col-span-4 h-full">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 border border-black/[0.06] shadow-sm flex flex-col gap-6 h-full">
            <h2 className="text-[13px] font-bold text-[#111111] pb-4 border-b border-black/[0.05]">
              写一张新字条
            </h2>

            {/* 类型选择 */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-widest text-[#111111]/50 uppercase">字条类型</label>
              <div className="grid grid-cols-3 gap-2">
                {(["QUESTION", "BUG", "FEATURE"] as TicketType[]).map((t) => {
                  const style = getTypeStyle(t);
                  const Icon = style.icon;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex flex-col items-center gap-2 py-3 rounded-xl border transition-all ${
                        type === t
                          ? `${style.bg} ${style.border} ${style.color} shadow-sm`
                          : "bg-[#FAFAFA] border-black/[0.06] text-[#111111]/40 hover:bg-white hover:border-black/[0.1] hover:text-[#111111]"
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-[10px] font-bold">{style.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 标题 */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-widest text-[#111111]/50 uppercase">一句话总结</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="例如：首页轮播图有点卡"
                className="w-full bg-[#FAFAFA] rounded-lg border border-black/[0.06] px-4 py-2.5 text-[13px] font-bold text-[#111111] focus:outline-none focus:border-black/30 focus:bg-white transition-all placeholder:text-[#111111]/30"
              />
            </div>

            {/* 描述 */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-widest text-[#111111]/50 uppercase">详细描述</label>
              <textarea
                rows={5}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="开发者您好，我在操作后台上传图片的时候遇到了报错，请帮忙看看是怎么回事..."
                className="w-full bg-[#FAFAFA] rounded-lg border border-black/[0.06] px-4 py-3 text-[13px] text-[#111111] focus:outline-none focus:border-black/30 focus:bg-white transition-all placeholder:text-[#111111]/30 resize-none"
              />
            </div>

            {/* 截图上传 — 3个并排 slot */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-widest text-[#111111]/50 uppercase">问题截图（最多 3 张）</label>
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map(idx => {
                  const url = screenshots[idx];
                  const isUploading = uploadingSlot === idx;
                  return (
                    <div key={idx} className="relative aspect-square">
                      <input
                        ref={slotRefs[idx]}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleSlotUpload(f, idx); }}
                      />
                      {url ? (
                        <div className="relative w-full h-full rounded-xl overflow-hidden border border-black/[0.06] group/slot">
                          <Image
                            src={url}
                            alt={`截图${idx + 1}`}
                            fill
                            unoptimized
                            className="object-cover cursor-pointer"
                            onClick={() => setLightboxSrc(url)}
                          />
                          <button
                            type="button"
                            onClick={() => removeScreenshot(idx)}
                            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/slot:opacity-100 transition-opacity hover:bg-black"
                          >
                            <X size={11} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={isUploading || screenshots.length > idx}
                          onClick={() => slotRefs[idx]?.current?.click()}
                          className="w-full h-full rounded-xl border-2 border-dashed border-black/[0.08] bg-[#FAFAFA] flex flex-col items-center justify-center gap-1.5 text-[#111111]/30 hover:border-black/20 hover:bg-white hover:text-[#111111]/50 transition-all disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {isUploading
                            ? <Loader2 size={18} className="animate-spin" />
                            : <Plus size={18} />
                          }
                          <span className="text-[10px] font-bold">截图 {idx + 1}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 发送按钮 */}
            <div className="mt-auto pt-2">
              <button
                type="submit"
                disabled={loading || !title.trim() || !description.trim()}
                className="w-full flex items-center justify-center gap-2 h-[46px] rounded-xl bg-[#111111] text-[13px] font-bold text-white shadow-sm hover:bg-black/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {loading ? "发送中..." : "发送给开发者"}
              </button>
            </div>
          </form>
        </div>

        {/* 右侧：历史工单 */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          {initialLoading ? (
            <div className="flex items-center justify-center p-20 text-[#111111]/30">
              <Loader2 size={24} className="animate-spin" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border border-black/[0.06] shadow-sm flex flex-col items-center justify-center text-center">
              <LifeBuoy size={32} className="text-[#111111]/10 mb-4" />
              <p className="text-[13px] font-bold text-[#111111]/60">目前没有留下任何记录</p>
              <p className="text-[11px] text-[#111111]/40 mt-1">遇到操作困难，随时在这里给我们写字条</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {tickets.map(ticket => {
                const typeStyle = getTypeStyle(ticket.type);
                const statusStyle = getStatusStyle(ticket.status);
                const StatusIcon = statusStyle.icon;
                const shots = Array.isArray(ticket.screenshots) ? ticket.screenshots : [];

                return (
                  <div key={ticket.id} className="bg-white rounded-xl overflow-hidden border border-black/[0.06] shadow-sm group relative">
                    {/* 悬停操作按钮 */}
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => promptDeleteTicket(ticket.id)}
                        className="w-8 h-8 rounded-md bg-white border border-black/[0.06] shadow-sm text-red-500/50 hover:bg-red-50 hover:border-red-200 hover:text-red-600 flex items-center justify-center transition-all"
                        title="粉碎这条工单"
                      >
                        <Trash2 size={13} />
                      </button>
                      <button
                        onClick={() => openManagement(ticket)}
                        className="w-8 h-8 rounded-md bg-white border border-black/[0.06] shadow-sm text-[#111111]/40 hover:bg-black/[0.04] hover:text-[#111111] flex items-center justify-center transition-all"
                        title="进入老板批复台"
                      >
                        <Settings size={13} />
                      </button>
                    </div>

                    {/* 工单头部 */}
                    <div className="px-6 py-4 border-b border-black/[0.04] bg-[#FAFAFA] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md flex items-center gap-1.5 ${typeStyle.bg} ${typeStyle.color} ${typeStyle.border} border`}>
                          <typeStyle.icon size={12} /> {typeStyle.label}
                        </span>
                        <span className="text-[11px] font-bold text-[#111111]/20 uppercase tracking-widest">{ticket.id.split('-').pop()}</span>
                      </div>
                      <div className={`flex items-center gap-1.5 text-[11px] font-bold pr-10 ${statusStyle.color}`}>
                        <StatusIcon size={14} className={ticket.status === "PROCESSING" ? "animate-spin" : ""} />
                        {statusStyle.label}
                      </div>
                    </div>

                    {/* 工单内容 */}
                    <div className="p-6">
                      <h4 className="text-[15px] font-bold text-[#111111] mb-2">{ticket.title}</h4>
                      <p className="text-[13px] text-[#111111]/60 leading-relaxed max-w-3xl whitespace-pre-wrap">
                        {ticket.description}
                      </p>

                      {/* 截图缩略图 */}
                      {shots.length > 0 && (
                        <div className="flex items-center gap-3 mt-4">
                          {shots.map((src, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setLightboxSrc(src)}
                              className="relative w-20 h-20 rounded-xl overflow-hidden border border-black/[0.06] hover:border-black/20 hover:shadow-md transition-all shrink-0 group/thumb"
                            >
                              <Image
                                src={src}
                                alt={`截图${i + 1}`}
                                fill
                                unoptimized
                                className="object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                              />
                            </button>
                          ))}
                          <span className="text-[10px] text-[#111111]/30 font-bold">点击可放大预览</span>
                        </div>
                      )}

                      <p className="text-[10px] text-[#111111]/30 mt-4 font-bold tracking-wider">
                        {new Date(ticket.createdAt).toLocaleString("zh-CN")}
                      </p>
                    </div>

                    {/* 开发者回复 */}
                    {ticket.reply && (
                      <div className="px-6 py-5 bg-[#FAFAFA] border-t border-black/[0.04] flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm shadow-blue-500/20">
                          <span className="text-[10px] font-bold">DEV</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] font-bold text-blue-500 tracking-widest uppercase mb-1">来自开发者的回复处理</p>
                          <p className="text-[13px] font-semibold text-[#111111]/70 leading-relaxed whitespace-pre-wrap">
                            {ticket.reply}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 图片灯箱预览 */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            onClick={() => setLightboxSrc(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            <X size={20} />
          </button>
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full" onClick={e => e.stopPropagation()}>
            <Image
              src={lightboxSrc}
              alt="问题截图预览"
              fill
              unoptimized
              className="object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* 开发者批复通道 */}
      <AdminModal
        isOpen={managementModalOpen}
        onClose={() => setManagementModalOpen(false)}
        onConfirm={handleSaveReply}
        title={<div className="text-center w-full">审阅工作台</div>}
        description={<div className="text-center w-full">您可以随意更改该工单的处理状态，留下排期或解决方案再点保存。</div>}
        confirmLabel="发布批复"
        loading={savingReply}
      >
        <div className="flex flex-col gap-6 w-full text-left">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-widest text-[#111111]/40 uppercase">标记处理进度</label>
            <div className="flex gap-2">
              {(["PENDING", "PROCESSING", "RESOLVED"] as TicketStatus[]).map(s => (
                <button
                  key={s}
                  onClick={() => setReplyStatus(s)}
                  className={`flex-1 py-2 text-[11px] font-bold rounded-lg border transition-all ${
                    replyStatus === s
                      ? "bg-[#111111] text-white border-[#111111]"
                      : "bg-[#FAFAFA] text-[#111111]/40 border-black/[0.06] hover:bg-black/[0.02]"
                  }`}
                >
                  {s === "PENDING" && "搁置待办"}
                  {s === "PROCESSING" && "开发修复中"}
                  {s === "RESOLVED" && "彻底解决"}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-widest text-[#111111]/40 uppercase">给客户留言 (选填)</label>
            <textarea
              rows={4}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="已为您修复该 Bug，您可以刷新浏览器或清空缓存重试..."
              className="w-full bg-[#FAFAFA] rounded-lg border border-black/[0.06] px-4 py-3 text-[13px] font-medium text-[#111111] focus:outline-none focus:border-black/30 focus:bg-white transition-all resize-none"
            />
          </div>
        </div>
      </AdminModal>

      {/* 删除确认弹窗 */}
      <AdminModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={executeDeleteTicket}
        title={<div className="text-center w-full text-red-500">确认永久销毁工单？</div>}
        description={<div className="text-center w-full text-black/60">这个操作是不可逆的，一旦销毁将从系统数据库中彻底擦除，确定继续吗？</div>}
        confirmLabel="确认销毁"
        isDestructive={true}
        loading={deleting}
      />
    </div>
  );
}
