"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Clock } from "lucide-react";
import InquiryDrawer, { InquiryData } from "@/components/admin/InquiryDrawer";
import type { InquiryRecord } from "@/lib/data/repository";

const STATUS_MAP: Record<string, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: "待处理", color: "text-orange-600", bgColor: "bg-orange-50 border-orange-200" },
  CONTACTED: { label: "已联系", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
  CLOSED: { label: "已关闭", color: "text-gray-500", bgColor: "bg-gray-100 border-gray-200" },
};

function formatTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString("zh-CN", {
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toInquiryData(record: InquiryRecord): InquiryData {
  const localeRegion = record.locale ? record.locale.toUpperCase() : "GLOBAL";
  return {
    id: record.id,
    name: record.name,
    email: record.email ?? "未提供邮箱",
    phone: record.phone ?? undefined,
    product: "通用询盘",
    productId: null,
    country: "🌐",
    region: localeRegion,
    time: formatTime(record.createdAt),
    message: record.message,
    isUnread: !record.isRead,
    status: record.status,
    createdAt: record.createdAt,
  };
}

export default function InquiriesPage() {
  const [records, setRecords] = useState<InquiryRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("全部状态");
  const [activeInquiryId, setActiveInquiryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/inquiries", {
        cache: "no-store",
      });
      const result = (await response.json()) as {
        ok: boolean;
        data: InquiryRecord[];
      };

      if (response.ok && result.ok) {
        setRecords(result.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchInquiries();
  }, []);

  const inquiries = useMemo(() => records.map(toInquiryData), [records]);

  const filteredInquiries = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return inquiries.filter((inq) => {
      const matchesKeyword =
        !keyword ||
        inq.name.toLowerCase().includes(keyword) ||
        inq.email.toLowerCase().includes(keyword) ||
        (inq.phone ?? "").toLowerCase().includes(keyword) ||
        (inq.message ?? "").toLowerCase().includes(keyword);

      const matchesStatus =
        selectedStatus === "全部状态" ||
        (selectedStatus === "待处理 (Pending)" && inq.status === "PENDING") ||
        (selectedStatus === "已联系 (Contacted)" && inq.status === "CONTACTED") ||
        (selectedStatus === "已关闭 (Closed)" && inq.status === "CLOSED");

      return matchesKeyword && matchesStatus;
    });
  }, [inquiries, searchQuery, selectedStatus]);

  const unreadCount = filteredInquiries.filter((inq) => inq.isUnread).length;

  const activeInquiry =
    filteredInquiries.find((inq) => inq.id === activeInquiryId) ?? null;

  const handleMarkRead = async (id: string) => {
    setMarkingRead(true);
    try {
      const response = await fetch(`/api/inquiries/${id}/read`, {
        method: "POST",
      });

      if (!response.ok) return;

      await fetchInquiries();
      setActiveInquiryId(id);
    } finally {
      setMarkingRead(false);
    }
  };

  return (
    <div className="relative h-[calc(100vh-100px)] flex flex-col pt-0">
      <div className="flex shrink-0 items-center justify-between gap-4 rounded-xl border border-black/[0.06] bg-white p-2 shadow-sm mb-6">
        <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 w-[280px] shrink-0 transition-colors focus-within:bg-black/[0.02]">
          <Search size={16} className="text-[#111111]/30 shrink-0" />
          <input
            type="text"
            placeholder="搜索客户姓名/联系方式/留言..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-[#111111] placeholder:text-[#111111]/30 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-md bg-orange-50 px-3 py-1.5 border border-orange-100/50 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            <span className="text-[12px] text-orange-900/80">
              共 <strong className="font-bold text-orange-900">{filteredInquiries.length}</strong> 条客户询盘，其中{" "}
              <strong className="font-bold text-orange-600">{unreadCount}</strong> 条未读
            </span>
          </div>

          <div className="h-5 w-px bg-black/[0.06] mx-1" />

          <div className="flex items-center gap-1 px-2">
            <div className="relative flex items-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 text-[13px] font-medium transition-colors hover:bg-black/[0.02]">
              <Filter size={13} className="text-[#111111]/40" />
              <select
                className="appearance-none bg-transparent text-[#111111]/70 outline-none cursor-pointer pr-4"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option>全部状态</option>
                <option>待处理 (Pending)</option>
                <option>已联系 (Contacted)</option>
                <option>已关闭 (Closed)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-black/[0.06] bg-white shadow-sm flex flex-col relative">
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_0.8fr] items-center gap-4 border-b border-black/[0.05] bg-black/[0.02] px-6 py-3 text-[10px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase shrink-0">
          <div>客户信息</div>
          <div>来源</div>
          <div>地区</div>
          <div>时间</div>
          <div className="text-right pr-2">状态</div>
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-black/[0.04]">
          {loading ? (
            <div className="px-6 py-10 text-sm text-[#111111]/45">加载中...</div>
          ) : filteredInquiries.length === 0 ? (
            <div className="px-6 py-10 text-sm text-[#111111]/45">暂无询盘数据</div>
          ) : (
            filteredInquiries.map((inq) => {
              const statusConfig = STATUS_MAP[inq.status] ?? STATUS_MAP.PENDING;
              const isActive = activeInquiryId === inq.id;
              return (
                <div
                  key={inq.id}
                  onClick={() => setActiveInquiryId(inq.id)}
                  className={`
                    relative grid grid-cols-[2fr_1.5fr_1fr_1fr_0.8fr] items-center gap-4 px-6 py-4
                    cursor-pointer transition-colors
                    ${isActive ? "bg-black/[0.03]" : "hover:bg-black/[0.015]"}
                  `}
                >
                  {inq.isUnread && (
                    <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-orange-500" />
                  )}

                  <div className="min-w-0">
                    <p
                      className={`text-[13px] truncate ${
                        inq.isUnread
                          ? "font-bold text-[#111111]"
                          : "font-medium text-[#111111]/70"
                      }`}
                    >
                      {inq.name}
                    </p>
                    <p className="text-[11px] text-[#111111]/40 truncate mt-0.5">
                      {inq.email}
                    </p>
                  </div>

                  <div className="text-[12px] text-[#111111]/60 truncate font-medium">
                    {inq.product}
                  </div>

                  <div className="flex items-center gap-1.5 text-[12px] text-[#111111]/60">
                    <span>{inq.country}</span>
                    <span>{inq.region}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#111111]/40">
                    <Clock size={12} />
                    {inq.time}
                  </div>

                  <div className="flex justify-end">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase ${statusConfig.bgColor} ${statusConfig.color}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <InquiryDrawer
        inquiry={activeInquiry}
        onClose={() => setActiveInquiryId(null)}
        onMarkRead={handleMarkRead}
        markingRead={markingRead}
      />
    </div>
  );
}

