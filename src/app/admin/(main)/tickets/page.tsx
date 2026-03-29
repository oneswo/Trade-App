"use client";

import React, { useState, useEffect } from "react";
import { 
  LifeBuoy, Send, Clock, CheckCircle2, 
  Sparkles, Loader2, MessageSquare,
  Bug, Settings, Trash2, ImagePlus
} from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";

type TicketStatus = "PENDING" | "PROCESSING" | "RESOLVED";
type TicketType = "BUG" | "FEATURE" | "QUESTION";

interface Ticket {
  id: string;
  title: string;
  description: string;
  type: TicketType;
  status: TicketStatus;
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

  // 管理批复弹窗状态
  const [managementModalOpen, setManagementModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState<TicketStatus>("PENDING");
  const [savingReply, setSavingReply] = useState(false);

  // 删除确认弹窗状态
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // 初始化拉取工单
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/admin/tickets");
      const data = await res.json();
      if (data.ok) {
        setTickets(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setInitialLoading(false);
    }
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
        body: JSON.stringify({ title, description, type })
      });
      const data = await res.json();
      
      if (data.ok) {
        setTickets([data.data, ...tickets]); // 直接插入首行
        setTitle("");
        setDescription("");
        setType("QUESTION");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // 开启批复弹窗
  const openManagement = (t: Ticket) => {
    setSelectedTicket(t);
    setReplyText(t.reply || "");
    setReplyStatus(t.status);
    setManagementModalOpen(true);
  };

  // 保存批复
  const handleSaveReply = async () => {
    if (!selectedTicket) return;
    setSavingReply(true);

    try {
      const res = await fetch(`/api/admin/tickets/${selectedTicket.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: replyStatus,
          reply: replyText.trim() || null,
        })
      });
      const data = await res.json();
      if (data.ok) {
        // 更新本地列表
        setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, status: replyStatus, reply: replyText.trim() || null } : t));
        setManagementModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingReply(false);
    }
  };

  // 拦截并唤起删除确认弹窗
  const promptDeleteTicket = (id: string) => {
    setTicketToDelete(id);
    setDeleteModalOpen(true);
  };

  // 确认执行删除
  const executeDeleteTicket = async () => {
    if (!ticketToDelete) return;
    setDeleting(true);
    
    try {
      const res = await fetch(`/api/admin/tickets/${ticketToDelete}`, { method: "DELETE" });
      if (res.ok) {
        setTickets(tickets.filter(t => t.id !== ticketToDelete));
      }
    } catch (e) {
      console.error(e);
    } finally {
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
          <h1 className="text-base font-bold text-[#111111] flex items-center gap-2">
            <LifeBuoy className="text-blue-500" size={18} /> 技术支持中心
          </h1>
          <p className="mt-1 text-[11px] font-medium text-[#111111]/40">
            如果您在网站使用中遇到问题或有新功能需求，请在这里写小纸条呼唤开发者！
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/[0.02] border border-black/[0.04] rounded-lg">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           <span className="text-[11px] font-bold text-[#111111]/60">开发者在线接收工单中</span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
        {/* 左侧：新建工单 (4栏) */}
        <div className="xl:col-span-4 h-full">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 border border-black/[0.06] shadow-sm flex flex-col gap-6 h-full">
            <div>
              <h2 className="text-[13px] font-bold text-[#111111] pb-4 border-b border-black/[0.05] flex items-center gap-2">
                写一张新字条
              </h2>
            </div>
            
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
                          ? `${style.bg} ${style.border} ${style.color} shadow-sm ring-1 ring-${style.color}/20` 
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

            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-widest text-[#111111]/50 uppercase">详细描述（可附疑问截图链接）</label>
              <textarea 
                rows={5}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="开发者您好，我在操作后台上传图片的时候遇到了报错，请帮忙看看是怎么回事..." 
                className="w-full bg-[#FAFAFA] rounded-lg border border-black/[0.06] px-4 py-3 text-[13px] text-[#111111] focus:outline-none focus:border-black/30 focus:bg-white transition-all placeholder:text-[#111111]/30 resize-none"
              ></textarea>
            </div>

            <div className="mt-auto pt-2 flex items-center gap-3">
              <button 
                type="button"
                className="flex items-center justify-center h-[46px] w-[54px] rounded-xl bg-[#FAFAFA] border border-black/[0.06] text-[#111111]/50 hover:bg-white hover:text-[#111111] hover:border-black/[0.15] hover:shadow-sm transition-all shrink-0"
                title="上传问题截图"
              >
                <ImagePlus size={18} />
              </button>
              
              <button 
                type="submit" 
                disabled={loading || !title.trim() || !description.trim()}
                className="flex-1 flex items-center justify-center gap-2 h-[46px] rounded-xl bg-[#111111] text-[13px] font-bold text-white shadow-sm hover:bg-black/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

                return (
                  <div key={ticket.id} className="bg-white rounded-xl overflow-hidden border border-black/[0.06] shadow-sm group relative">
                    {/* 管理动作遮罩按钮组 (只有悬停时可见) */}
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

                    {/* 工单内容主体 */}
                    <div className="p-6">
                       <h4 className="text-[15px] font-bold text-[#111111] mb-2">{ticket.title}</h4>
                       <p className="text-[13px] text-[#111111]/60 leading-relaxed max-w-3xl whitespace-pre-wrap">
                         {ticket.description}
                       </p>
                       <p className="text-[10px] text-[#111111]/30 mt-4 font-bold tracking-wider">
                         {new Date(ticket.createdAt).toLocaleString("zh-CN")}
                       </p>
                    </div>

                    {/* 回复区 */}
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

      {/* ============== 开发者批复隐藏通道 (模态框) ============== */}
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

      {/* ============== 粉碎警告弹窗 (模态框) ============== */}
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
