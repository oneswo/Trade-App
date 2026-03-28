import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GlobalFab from "@/components/ui/global-fab";

export const metadata: Metadata = {
  title: "KXTJ Excavator | Heavy Machinery",
  description: "Global Leader in Heavy Machinery.",
};

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
