import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Console | KXTJ",
  description: "KXTJ Internal Management Console",
  robots: "noindex, nofollow",
};

/**
 * 后台壳层（不再包含 html/body，由 src/app/layout.tsx 统一提供）
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] antialiased">{children}</div>
  );
}
