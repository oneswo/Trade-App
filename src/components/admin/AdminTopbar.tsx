"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, LogOut, Home } from "lucide-react";

// ─── 路由与面包屑映射 ─────────────────────────────────────────
const ROUTE_LABELS: Record<string, string> = {
  dashboard:  "数据看板",
  products:   "产品列表",
  categories: "分类管理",
  inquiries:  "询盘管理",
  pages:      "页面内容",
  settings:   "全局设置",
};

function useBreadcrumbs() {
  const pathname = usePathname();
  // /admin/products/new → ["products", "new"]
  const segments = pathname.replace(/^\/admin\/?/, "").split("/").filter(Boolean);

  return segments.map((seg, idx) => {
    let label = ROUTE_LABELS[seg] ?? seg;
    if (seg === "new") {
      if (segments[idx - 1] === "products") label = "新建产品";
      else label = "新建";
    } else if (seg === "edit") {
      label = "编辑";
    }

    return {
      label,
      isLast: idx === segments.length - 1,
    };
  });
}

// ─── 组件 ─────────────────────────────────────────────────────
export default function AdminTopbar() {
  const router = useRouter();
  const breadcrumbs = useBreadcrumbs();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-52 z-30 flex h-16 items-center justify-between border-b border-black/[0.06] bg-white/90 px-4 pl-16 md:pl-8 md:px-8 backdrop-blur-md">

      {/* 左侧：面包屑 */}
      <nav className="flex items-center gap-2 text-[15px]">
        <span className="font-medium text-[#111111]/40 tracking-wide">
          管理后台
        </span>
        {breadcrumbs.map(({ label, isLast }, idx) => (
          <span key={idx} className="flex items-center gap-2">
            <ChevronRight size={16} className="text-[#111111]/20" strokeWidth={2} />
            <span
              className={
                isLast
                  ? "font-bold text-[#111111]"
                  : "font-medium text-[#111111]/40"
              }
            >
              {label}
            </span>
          </span>
        ))}
      </nav>

      {/* 右侧：操作区 */}
      <div className="flex items-center gap-2">
        
        {/* 前台预览 */}
        <Link 
          href="/" 
          target="_blank"
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-[#111111]/40 transition-colors duration-200 hover:bg-black/[0.04] hover:text-[#111111]"
        >
          <Home size={15} strokeWidth={2} />
          <span>前台首页</span>
        </Link>
        
        <div className="mx-1 h-3.5 w-px bg-black/[0.08]" />

        {/* 退出登录 */}
        <button
          title="安全退出"
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-[#111111]/40 transition-colors duration-200 hover:bg-red-50 hover:text-red-500"
        >
          <LogOut size={14} strokeWidth={2} />
          <span>退出</span>
        </button>
      </div>
    </header>
  );
}
