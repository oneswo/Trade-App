import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

/**
 * 后台主界面 Layout
 * 适用于所有 /admin/(dashboard|products|categories|...) 路由
 * 登录页使用独立路由，不套此 layout
 * 鉴权由 proxy.ts 统一处理
 */
export default function AdminMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* 左侧固定侧边栏 */}
      <AdminSidebar />

      {/* 右侧主体区域 */}
      <div className="flex flex-1 flex-col pl-0 md:pl-52">
        {/* 吸顶 Topbar */}
        <AdminTopbar />

        {/* 主内容区，顶部留出 Topbar 高度 */}
        <main className="mt-16 flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
