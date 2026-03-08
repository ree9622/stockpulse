import type { Metadata, Viewport } from "next";
import "./globals.css";
import SessionProvider from "@/components/layout/SessionProvider";

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "주식갤 | 한국 주식 실시간 정보",
  description: "실시간 주식 정보, 히트맵, 뉴스, 트래쉬토크 커뮤니티",
  manifest: "/stockpulse/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "주식갤",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href="/stockpulse/icon-192.svg" />
      </head>
      <body className="bg-[#0a0a0f] dark:bg-[#0a0a0f] text-gray-200 dark:text-gray-200 antialiased min-h-[100dvh] overscroll-none">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
