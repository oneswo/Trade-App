// 根 Layout — Next.js App Router 要求此文件存在
// 前台页面实际渲染由 src/app/[locale]/layout.tsx 完成
// 后台页面由 src/app/admin/layout.tsx 完成
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
