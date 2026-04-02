"use client";

import {
  Package,
  MessageSquare,
  Bell,
  ArrowUpRight,
  Clock,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import InquiryDrawer, { InquiryData } from "@/components/admin/InquiryDrawer";
import { readClientCache, writeClientCache } from "@/lib/cache/client-cache";
import { fetchJson } from "@/lib/http/client";

interface DashboardStats {
  totalProducts: number;
  draftProducts: number;
  totalInquiries: number;
  unreadInquiries: number;
  recentInquiries: InquiryData[];
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "待处理",   color: "bg-orange-50 text-orange-600 border-orange-200" },
  CONTACTED: { label: "已联系", color: "bg-blue-50 text-blue-600 border-blue-200" },
  CLOSED:    { label: "已关闭",    color: "bg-gray-100 text-gray-500 border-gray-200" },
};

const DASHBOARD_CACHE_KEY = "admin:dashboard:stats";
const DASHBOARD_CACHE_TTL_MS = 60 * 1000;

// ─── 页面 ─────────────────────────────────────────────────────
export default function DashboardPage() {
  const [activeInquiryId, setActiveInquiryId] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const cached = readClientCache<DashboardStats>(DASHBOARD_CACHE_KEY, DASHBOARD_CACHE_TTL_MS);
    if (cached) {
      setStats(cached);
    }

    void fetchJson<{ ok: boolean; data: DashboardStats }>("/api/admin/dashboard")
      .then((res: { ok: boolean; data: DashboardStats }) => {
        if (res.ok) {
          setStats(res.data);
          writeClientCache(DASHBOARD_CACHE_KEY, res.data);
        }
      })
      .catch(() => {});
  }, []);

  const STATS = [
    {
      id: "total-products",
      label: "产品总数",
      value: stats ? String(stats.totalProducts) : "—",
      sub: stats ? `含 ${stats.draftProducts} 件草稿` : "加载中...",
      icon: Package,
      accent: "#111111",
      badge: null,
    },
    {
      id: "total-inquiries",
      label: "询盘总数",
      value: stats ? String(stats.totalInquiries) : "—",
      sub: "来自前台表单",
      icon: MessageSquare,
      accent: "#111111",
      badge: null,
    },
    {
      id: "unread-inquiries",
      label: "未读询盘",
      value: stats ? String(stats.unreadInquiries) : "—",
      sub: "需要处理",
      icon: Bell,
      accent: "#f97316",
      badge: stats && stats.unreadInquiries > 0 ? "紧急" : null,
    },
  ];

  const activeInq = stats?.recentInquiries?.find(inq => inq.id === activeInquiryId) || null;
  const displayedInquiries = stats?.recentInquiries || [];

  return (
    <div className="space-y-6">



      {/* ── 统计卡片 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STATS.map(({ id, label, value, sub, icon: Icon, accent, badge }) => (
          <div
            key={id}
            id={id}
            className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm"
          >
            {/* 左侧彩色竖线 */}
            <div
              className="absolute left-0 top-6 bottom-6 w-0.5 rounded-full"
              style={{ backgroundColor: accent }}
            />

            <div className="flex items-start justify-between">
              <div className="pl-4">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-[#111111]/40 uppercase">
                  {label}
                </p>
                <p className="mt-2 text-3xl font-bold text-[#111111]">{value}</p>
                <p className="mt-1 text-xs text-[#111111]/35">{sub}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Icon size={18} strokeWidth={1.6} className="text-[#111111]/20" />
                {badge && (
                  <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase">
                    {badge}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 最新询盘列表 ── */}
      <div className="rounded-2xl border border-black/[0.06] bg-white shadow-sm">

        {/* 表头行 */}
        <div className="flex items-center justify-between border-b border-black/[0.05] px-6 py-4">
          <div>
            <h2 className="text-[13px] font-semibold text-[#111111]">最新询盘</h2>
            <p className="text-xs text-[#111111]/35 mt-0.5">来自前台表单的最新线索</p>
          </div>
          <Link
            href="/admin/inquiries"
            className="flex items-center gap-1.5 text-[12px] font-medium text-[#111111]/50 transition-colors hover:text-[#111111]"
          >
            查看全部
            <ArrowUpRight size={13} />
          </Link>
        </div>

        {/* 列标题 */}
        <div className="grid grid-cols-[1fr_1fr] md:grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 border-b border-black/[0.04] px-6 py-3">
          {["客户信息", "关联产品", "地区", "时间", "状态"].map((col, idx) => (
            <span key={col} className={`text-[10px] font-semibold tracking-[0.12em] text-[#111111]/25 uppercase ${idx >= 2 && idx <= 3 ? "hidden md:block" : ""}`}>
              {col}
            </span>
          ))}
        </div>

        {/* 数据行 */}
        <ul className="divide-y divide-black/[0.04]">
          {displayedInquiries.length === 0 ? (
            <li className="px-6 py-8 text-center text-[13px] text-[#111111]/40">
              暂无最新询盘数据
            </li>
          ) : (
            displayedInquiries.map((inq) => (
              <li key={inq.id}>
                <button
                  onClick={() => setActiveInquiryId(inq.id)}
                className="
                  group relative grid grid-cols-[1fr_1fr] md:grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 items-center px-6 py-4 text-left
                  transition-colors duration-150 hover:bg-black/[0.02] cursor-pointer block w-full
                "
              >
                {/* 未读左侧 orange 竖线 */}
                {inq.isUnread && (
                  <span className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full bg-orange-400" />
                )}

                {/* 客户信息 */}
                <div className="min-w-0">
                  <p className={`text-[13px] font-semibold truncate transition-colors group-hover:text-black ${inq.isUnread ? "text-[#111111]" : "text-[#111111]/60"}`}>
                    {inq.name}
                  </p>
                  <p className="text-[11px] text-[#111111]/40 truncate mt-0.5">{inq.email}</p>
                </div>

                {/* 产品 */}
                <p className="text-[12px] font-medium text-[#111111]/60 truncate group-hover:text-[#111111]/80">{inq.product}</p>

                {/* 地区 */}
                <p className="text-[12px] text-[#111111]/50 items-center gap-1.5 hidden md:flex">
                  <span>{inq.country}</span>
                  <span>{inq.region}</span>
                </p>

                {/* 时间 */}
                <div className="items-center gap-1.5 text-[11px] text-[#111111]/40 hidden md:flex">
                  <Clock size={11} />
                  {inq.time}
                </div>

                {/* 状态 */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${STATUS_MAP[inq.status]?.color}`}>
                    {STATUS_MAP[inq.status]?.label}
                  </span>
                  <ChevronRight size={14} className="text-[#111111]/20 transition-transform group-hover:translate-x-1 group-hover:text-[#111111]/40" />
                </div>
              </button>
              </li>
            ))
          )}
        </ul>

      </div>

      {/* 弹窗抽屉 */}
      <InquiryDrawer 
        inquiry={activeInq}
        onClose={() => setActiveInquiryId(null)}
      />

    </div>
  );
}
