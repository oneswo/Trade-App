"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Cpu,
  BookOpen,
} from "lucide-react";

// ─── 导航配置 ────────────────────────────────────────────────
const NAV_ITEMS = [
  { href: "/admin/dashboard",  label: "数据看板",   icon: LayoutDashboard },
  { href: "/admin/products",   label: "产品列表",    icon: Package },
  { href: "/admin/categories", label: "分类管理",  icon: FolderTree },
  { href: "/admin/inquiries",  label: "询盘管理",   icon: MessageSquare },
  { href: "/admin/articles",   label: "行业智库",   icon: BookOpen },
  { href: "/admin/pages",      label: "页面内容",       icon: FileText },
  { href: "/admin/settings",   label: "全局设置",       icon: Settings },
];

// ─── 组件 ─────────────────────────────────────────────────────
export default function AdminSidebar() {
  const pathname = usePathname();

  /**
   * 判断当前路由是否匹配侧边栏条目
   * /admin/products/new → 激活 /admin/products
   */
  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-52 flex-col bg-[#0F0F0F]">
      {/* ── Logo 区域 ── */}
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-white">
          <Cpu size={16} className="text-[#0F0F0F]" />
        </div>
        <span className="text-[15px] font-bold text-white tracking-wide">
          管理后台
        </span>
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
                  {/* 左侧激活竖线 */}
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
  );
}
