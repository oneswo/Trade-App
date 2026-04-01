import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import HtmlLang from "@/components/layout/HtmlLang";
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
  await params;
  const messages = await getMessages();
  const repo = getSiteSettingsRepo();
  const siteSettings = await repo.get();

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA] text-[#111111]">
      <NextIntlClientProvider messages={messages}>
        <HtmlLang />
        <Header initialSettings={siteSettings} />
        {children}
        <Footer initialSettings={siteSettings} />
        <GlobalFab />
      </NextIntlClientProvider>
    </div>
  );
}
