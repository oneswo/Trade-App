import "./globals.css";

/**
 * 根 Layout：Next.js 要求必须包含 <html> 与 <body>（子布局不得再包一层 html/body）。
 * 前台语言、dir 由 HtmlLang 在 [locale] 下同步到 document.documentElement。
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

