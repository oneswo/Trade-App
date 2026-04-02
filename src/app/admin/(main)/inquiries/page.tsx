"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Filter, Clock, Trash2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AdminModal from "@/components/admin/AdminModal";
import InquiryDrawer, { InquiryData } from "@/components/admin/InquiryDrawer";
import type { InquiryRecord } from "@/lib/data/repository";
import { readClientCache, writeClientCache } from "@/lib/cache/client-cache";
import { fetchJson, isAbortLikeError } from "@/lib/http/client";
import { resolveInquiryLabel } from "@/lib/inquiries/presentation";

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

const INQUIRIES_CACHE_KEY = "admin:inquiries:list";
const INQUIRIES_CACHE_TTL_MS = 20 * 1000;

function toInquiryData(record: InquiryRecord): InquiryData {
  const localeRegion = record.locale ? record.locale.toUpperCase() : "GLOBAL";
  return {
    id: record.id,
    name: record.name,
    email: record.email ?? "未提供邮箱",
    phone: record.phone ?? undefined,
    product: resolveInquiryLabel(record),
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [records, setRecords] = useState<InquiryRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("全部状态");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [activeInquiryId, setActiveInquiryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fetchControllerRef = useRef<AbortController | null>(null);
  const didInitFromUrlRef = useRef(false);

  const fetchInquiries = async () => {
    fetchControllerRef.current?.abort();
    const controller = new AbortController();
    fetchControllerRef.current = controller;
    setLoading(true);
    const cached = readClientCache<InquiryRecord[]>(INQUIRIES_CACHE_KEY, INQUIRIES_CACHE_TTL_MS);
    if (cached) {
      setRecords(cached);
      setLoading(false);
    }
    try {
      const inquiryResult = await fetchJson<{
        ok: boolean;
        data: InquiryRecord[];
      }>("/api/inquiries", {
        signal: controller.signal,
      });

      if (inquiryResult.ok) {
        setRecords(inquiryResult.data);
        writeClientCache(INQUIRIES_CACHE_KEY, inquiryResult.data);
      }
    } catch (error) {
      if (isAbortLikeError(error)) return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchInquiries();
    return () => fetchControllerRef.current?.abort();
  }, []);

  useEffect(() => {
    if (didInitFromUrlRef.current) return;
    const q = searchParams.get("q") ?? "";
    const status = searchParams.get("status") ?? "全部状态";
    setSearchQuery(q);
    setDebouncedSearchQuery(q);
    setSelectedStatus(status);
    didInitFromUrlRef.current = true;
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!didInitFromUrlRef.current) return;
    const params = new URLSearchParams(searchParams.toString());
    const q = debouncedSearchQuery.trim();
    if (q) params.set("q", q);
    else params.delete("q");
    if (selectedStatus && selectedStatus !== "全部状态") params.set("status", selectedStatus);
    else params.delete("status");
    const next = params.toString();
    const current = searchParams.toString();
    if (next !== current) {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }
  }, [debouncedSearchQuery, selectedStatus, pathname, router, searchParams]);

  const inquiries = useMemo(
    () => records.map(toInquiryData),
    [records]
  );

  const filteredInquiries = useMemo(() => {
    const keyword = debouncedSearchQuery.trim().toLowerCase();
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
  }, [inquiries, debouncedSearchQuery, selectedStatus]);

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
      setRecords((prev) =>
        prev.map((record) =>
          record.id === id
            ? { ...record, isRead: true, updatedAt: new Date().toISOString() }
            : record
        )
      );
      setActiveInquiryId(id);
    } finally {
      setMarkingRead(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    const response = await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (response.ok) {
      setRecords((prev) =>
        prev.map((record) =>
          record.id === id
            ? { ...record, status: status as InquiryRecord["status"], updatedAt: new Date().toISOString() }
            : record
        )
      );
      setActiveInquiryId(id);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/inquiries/${deleteId}`, { method: "DELETE" });
      if (!response.ok) return;
      setRecords((prev) => prev.filter((record) => record.id !== deleteId));
      if (activeInquiryId === deleteId) setActiveInquiryId(null);
    } finally {
      setDeleting(false);
      setDeleteId(null);
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
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_0.8fr_36px] items-center gap-4 border-b border-black/[0.05] bg-black/[0.02] px-6 py-3 text-[10px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase shrink-0">
          <div>客户信息</div>
          <div>来源</div>
          <div>地区</div>
          <div>时间</div>
          <div className="text-right">状态</div>
          <div></div>
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
                    relative grid grid-cols-[2fr_1.5fr_1fr_1fr_0.8fr_36px] items-center gap-4 px-6 py-4
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

                  <div className="flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(inq.id);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/[0.03] text-[#111111]/50 hover:bg-red-500 hover:text-white transition-colors"
                      title="删除"
                    >
                      <Trash2 size={13} />
                    </button>
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
        onUpdateStatus={handleUpdateStatus}
      />

      {/* 删除确认弹窗 */}
      <AdminModal
        isOpen={!!deleteId}
        title="删除询盘"
        description="此操作不可撤销，确认删除该询盘记录吗？"
        confirmLabel={deleting ? "删除中..." : "确认删除"}
        isDestructive
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
