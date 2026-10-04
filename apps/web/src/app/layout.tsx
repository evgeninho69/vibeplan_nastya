import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc/Provider";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";
import { AntiBurnoutToast } from "@/components/AntiBurnoutToast";
import { DemoBanner } from "@/components/DemoBanner";

export const metadata: Metadata = {
  title: "ВайбПлан — анти-выгорательный планировщик к ЕГЭ",
  description:
    "Анти-выгорательный планировщик для старшеклассников: расписание, ЕГЭ, привычки и эмпатичный AI-наставник Майя.",
  applicationName: "ВайбПлан",
  authors: [{ name: "ВайбПлан" }],
  keywords: ["ЕГЭ", "планировщик", "Майя", "AI", "учёба"],
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fcf9f4",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" data-theme="matcha" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/icon-192.png" type="image/png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ВайбПлан" />
      </head>
      <body className="font-[var(--font-family)] antialiased">
        <TRPCProvider>{children}</TRPCProvider>
        <DemoBanner />
        <ThemeSwitcher />
        <AntiBurnoutToast />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}