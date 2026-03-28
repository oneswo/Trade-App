import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GlobalFab from "@/components/ui/global-fab";
import { getSiteSettingsRepo } from "@/lib/data/repository";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const repo = getSiteSettingsRepo();
  const settings = await repo.get();
  
  const title = locale === "zh" ? settings.siteName : settings.siteNameEn;
  const description = locale === "zh" 
    ? "全球领先的重工机械供应商" 
    : "Global Leader in Heavy Machinery";
  
  return {
    title,
    description,
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  // Support RTL layout natively for Arabic
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className="scroll-smooth">
      <body className="bg-[#FAFAFA] text-[#111111] antialiased min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
          <Footer />
          <GlobalFab />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
