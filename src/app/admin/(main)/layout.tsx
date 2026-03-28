import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

/**
 * 后台主界面 Layout
 * 适用于所有 /admin/(dashboard|products|categories|...) 路由
 * 登录页使用独立路由，不套此 layout
 */
export default function AdminMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full">
      {/* 左侧固定侧边栏 */}
      <AdminSidebar />

      {/* 右侧主体区域 */}
      <div className="flex flex-1 flex-col pl-52">
        {/* 吸顶 Topbar */}
        <AdminTopbar />

        {/* 主内容区，顶部留出 Topbar 高度 */}
        <main className="mt-16 flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
