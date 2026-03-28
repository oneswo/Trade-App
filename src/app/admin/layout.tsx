import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin Console | KXTJ",
  description: "KXTJ Internal Management Console",
  robots: "noindex, nofollow",
};

/**
 * 后台独立 Layout
 * - 不包含前台的 Header / Footer / GlobalFab / NextIntlClientProvider
 * - admin 路由段完全独立，自成体系
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#F8F9FA] antialiased">
        {children}
      </body>
    </html>
  );
}
