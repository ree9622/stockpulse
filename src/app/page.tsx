import Header from "@/components/layout/Header";
import MarketTicker from "@/components/market/MarketTicker";
import MarketOverview from "@/components/market/MarketOverview";
import Heatmap from "@/components/market/Heatmap";
import TrendingStocks from "@/components/market/TrendingStocks";
import NewsFeed from "@/components/market/NewsFeed";
import ChatPanel from "@/components/chat/ChatPanel";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <MarketTicker />

      <main className="max-w-[1800px] mx-auto px-4 py-6 space-y-6">
        {/* 지수 카드 */}
        <MarketOverview />

        {/* 메인 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 히트맵 */}
          <div className="lg:col-span-2">
            <Heatmap />
          </div>

          {/* 오른쪽: 뉴스 */}
          <div>
            <NewsFeed />
          </div>
        </div>

        {/* 인기 종목 테이블 */}
        <TrendingStocks />
      </main>

      {/* 하단 채팅 패널 */}
      <ChatPanel />
    </div>
  );
}
