import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/layout/SessionProvider";

export const metadata: Metadata = {
  title: "StockPulse | 한국 주식 실시간 정보",
  description: "실시간 주식 정보, 히트맵, 뉴스, 트래쉬토크 커뮤니티",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="bg-[#0a0a0f] text-gray-200 antialiased min-h-screen">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
