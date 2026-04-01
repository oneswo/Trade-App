"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MessageSquare,
  FileText,
  Settings,
  Cpu,
  BookOpen,
  LifeBuoy,
  Menu,
  X,
} from "lucide-react";

// ─── 导航配置 ────────────────────────────────────────────────
const NAV_ITEMS = [
  { href: "/admin/dashboard",  label: "数据看板", icon: LayoutDashboard },
  { href: "/admin/categories", label: "分类管理", icon: FolderTree },
  { href: "/admin/products",   label: "产品列表", icon: Package },
  { href: "/admin/inquiries",  label: "询盘管理", icon: MessageSquare },
  { href: "/admin/pages",      label: "页面内容", icon: FileText },
  { href: "/admin/articles",   label: "行业智库", icon: BookOpen },
  { href: "/admin/settings",   label: "全局设置", icon: Settings },
  { href: "/admin/tickets",    label: "技术支持", icon: LifeBuoy },
];

// ─── 组件 ─────────────────────────────────────────────────────
export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* 移动端汉堡按钮 */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F0F0F] text-white shadow-lg md:hidden"
      >
        <Menu size={20} />
      </button>

      {/* 移动端遮罩 */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 flex w-52 flex-col bg-[#0F0F0F]
        transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:z-40
      `}>
        {/* ── Logo 区域 ── */}
        <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-white">
              <Cpu size={16} className="text-[#0F0F0F]" />
            </div>
            <span className="text-[15px] font-bold text-white tracking-wide">
              管理后台
            </span>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white md:hidden">
            <X size={18} />
          </button>
        </div>

        {/* ── 导航列表 ── */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-2">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    prefetch
                    onClick={() => setOpen(false)}
                    className={`
                      relative flex items-center gap-3.5 rounded-xl px-4 py-3.5
                      text-[15px] font-medium transition-all duration-200
                      ${
                        active
                          ? "bg-white/[0.08] text-white shadow-sm"
                          : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                      }
                    `}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-md bg-white" />
                    )}
                    <Icon size={18} strokeWidth={active ? 2 : 1.8} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
