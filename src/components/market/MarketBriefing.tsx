"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Flame,
  Shield,
  TrendingUp,
  TrendingDown,
  Zap,
  Globe,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertTriangle,
  Fuel,
  DollarSign,
} from "lucide-react";
import { marketIndices, trendingStocks, heatmapData, newsItems } from "@/lib/mock-data";
import { formatPercent, getChangeColor } from "@/lib/utils";

interface BriefingThread {
  id: string;
  icon: React.ReactNode;
  label: string;
  labelColor: string;
  title: string;
  content: string;
  detail?: string;
  tags?: string[];
  stocks?: { name: string; code: string; change: number }[];
  timestamp: Date;
  severity: "critical" | "warning" | "info" | "positive";
}

function generateBriefings(): BriefingThread[] {
  const threads: BriefingThread[] = [];
  const now = new Date();

  // ── 1. 시장 총평 ──
  const kospi = marketIndices.find((i) => i.name === "KOSPI")!;
  const kosdaq = marketIndices.find((i) => i.name === "KOSDAQ")!;
  const sp500 = marketIndices.find((i) => i.name === "S&P 500");
  const nasdaq = marketIndices.find((i) => i.name === "NASDAQ");

  const marketSentiment =
    kospi.change < 0 && kosdaq.change < 0
      ? "약세"
      : kospi.change > 0 && kosdaq.change > 0
        ? "강세"
        : "혼조";

  threads.push({
    id: "market-overview",
    icon: <BarChart3 className="w-4 h-4" />,
    label: "시장 총평",
    labelColor: marketSentiment === "약세" ? "text-blue-400 bg-blue-500/10" : marketSentiment === "강세" ? "text-red-400 bg-red-500/10" : "text-yellow-400 bg-yellow-500/10",
    title: `국내 증시 ${marketSentiment}세 — KOSPI ${kospi.change > 0 ? "+" : ""}${kospi.change.toFixed(0)}p, KOSDAQ ${kosdaq.change > 0 ? "+" : ""}${kosdaq.change.toFixed(0)}p`,
    content: `KOSPI ${kospi.value.toLocaleString()}(${formatPercent(kospi.changePercent)}), KOSDAQ ${kosdaq.value.toLocaleString()}(${formatPercent(kosdaq.changePercent)})${sp500 ? `. 미국 S&P500 ${formatPercent(sp500.changePercent)}, NASDAQ ${formatPercent(nasdaq?.changePercent || 0)}으로 전일 마감.` : "."}`,
    detail: marketSentiment === "약세"
      ? "주요 지수 하락세. 위험자산 회피 심리 확산 중."
      : marketSentiment === "강세"
        ? "투자 심리 개선. 매수세 유입 중."
        : "코스피·코스닥 방향 엇갈림. 업종별 차별화 장세.",
    severity: marketSentiment === "약세" ? "warning" : marketSentiment === "강세" ? "positive" : "info",
    timestamp: new Date(now.getTime() - 2 * 60000),
  });

  // ── 2. 환율/원자재 동향 ──
  const usdkrw = marketIndices.find((i) => i.name === "USD/KRW");
  const wti = marketIndices.find((i) => i.name === "WTI");
  const gold = marketIndices.find((i) => i.name === "Gold");

  if (usdkrw && wti) {
    const fxAlert = usdkrw.value > 1450;
    threads.push({
      id: "fx-commodity",
      icon: fxAlert ? <AlertTriangle className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />,
      label: fxAlert ? "환율 경고" : "환율·원자재",
      labelColor: fxAlert ? "text-orange-400 bg-orange-500/10" : "text-cyan-400 bg-cyan-500/10",
      title: `원/달러 ${usdkrw.value.toFixed(0)}원${fxAlert ? " ⚠️ 고환율 지속" : ""} · WTI ${wti.value.toFixed(1)}$ ${wti.change > 0 ? "급등" : "하락"}`,
      content: `환율 ${formatPercent(usdkrw.changePercent)}${fxAlert ? ", 1,450원대 고환율 장기화 우려" : ""}. 국제유가(WTI) ${wti.value.toFixed(1)}$(${formatPercent(wti.changePercent)})${wti.changePercent > 5 ? " 급등세" : ""}${gold ? `. 금 ${gold.value.toFixed(0)}$(${formatPercent(gold.changePercent)})` : ""}.`,
      detail: wti.changePercent > 10
        ? "유가 급등으로 에너지 수입 부담 가중. 정유·에너지주 수혜 예상."
        : undefined,
      severity: fxAlert || wti.changePercent > 10 ? "warning" : "info",
      timestamp: new Date(now.getTime() - 5 * 60000),
    });
  }

  // ── 3. 급등 섹터 ──
  const bigMovers = trendingStocks
    .filter((s) => Math.abs(s.changePercent) > 10)
    .sort((a, b) => b.changePercent - a.changePercent);

  const risers = bigMovers.filter((s) => s.changePercent > 0);
  const fallers = bigMovers.filter((s) => s.changePercent < 0);

  if (risers.length > 0) {
    // 섹터 그루핑
    const sectorMap = new Map<string, typeof risers>();
    risers.forEach((s) => {
      const arr = sectorMap.get(s.sector) || [];
      arr.push(s);
      sectorMap.set(s.sector, arr);
    });

    const topSector = [...sectorMap.entries()].sort((a, b) => b[1].length - a[1].length)[0];

    threads.push({
      id: "hot-sector",
      icon: <Flame className="w-4 h-4" />,
      label: "🔥 급등 섹터",
      labelColor: "text-red-400 bg-red-500/10",
      title: `${topSector[0]}주 일제히 급등 — ${topSector[1].map((s) => s.name).join(", ")}`,
      content: risers.map((s) => `${s.name} ${formatPercent(s.changePercent)}`).join(" · "),
      stocks: risers.map((s) => ({ name: s.name, code: s.code, change: s.changePercent })),
      tags: [...new Set(risers.map((s) => s.sector))],
      severity: "positive",
      timestamp: new Date(now.getTime() - 8 * 60000),
    });
  }

  if (fallers.length > 0) {
    threads.push({
      id: "drop-alert",
      icon: <TrendingDown className="w-4 h-4" />,
      label: "급락 경보",
      labelColor: "text-blue-400 bg-blue-500/10",
      title: `${fallers.map((s) => s.name).join(", ")} 급락`,
      content: fallers.map((s) => `${s.name} ${formatPercent(s.changePercent)}`).join(" · "),
      stocks: fallers.map((s) => ({ name: s.name, code: s.code, change: s.changePercent })),
      severity: "warning",
      timestamp: new Date(now.getTime() - 12 * 60000),
    });
  }

  // ── 4. 뉴스 기반 이벤트 ──
  const breakingNews = newsItems.filter((n) => n.tags.includes("속보"));
  if (breakingNews.length > 0) {
    const negCount = breakingNews.filter((n) => n.sentiment === "negative").length;
    threads.push({
      id: "breaking-news",
      icon: <Zap className="w-4 h-4" />,
      label: "속보",
      labelColor: "text-yellow-400 bg-yellow-500/10",
      title: breakingNews[0].title,
      content: breakingNews.length > 1
        ? `외 ${breakingNews.length - 1}건의 속보. ${negCount > 2 ? "부정적 뉴스 다수 — 리스크 관리 필요." : ""}`
        : breakingNews[0].source + " 보도.",
      detail: breakingNews.length > 1 ? breakingNews.slice(1, 4).map((n) => `• ${n.title}`).join("\n") : undefined,
      severity: negCount > 2 ? "critical" : "warning",
      timestamp: breakingNews[0].timestamp,
    });
  }

  // ── 5. 세이브티커 전략 ──
  const btc = marketIndices.find((i) => i.name === "BTC/USD");
  const safeAssets: string[] = [];
  if (gold && gold.change < 0) safeAssets.push(`금 ${formatPercent(gold.changePercent)}`);
  if (btc && btc.change < 0) safeAssets.push(`BTC ${formatPercent(btc.changePercent)}`);

  const defensiveStocks = heatmapData
    .filter((s) => s.changePercent > 0 && ["바이오", "보험", "금융"].includes(s.sector))
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 3);

  threads.push({
    id: "safe-ticker",
    icon: <Shield className="w-4 h-4" />,
    label: "세이브티커",
    labelColor: "text-emerald-400 bg-emerald-500/10",
    title: marketSentiment === "약세"
      ? "방어적 포지션 권장 — 에너지·방산 강세 지속"
      : "시장 안정화 시그널 — 수급 분산 전략",
    content: marketSentiment === "약세"
      ? `위험자산 회피 구간. ${risers.length > 0 ? `${[...new Set(risers.map((s) => s.sector))].join("·")}주가 대안으로 부상.` : "현금 비중 확대 고려."}`
      : "양호한 시장 환경. 업종별 순환매 장세 전략 유효.",
    detail: defensiveStocks.length > 0
      ? `방어주 동향: ${defensiveStocks.map((s) => `${s.name} ${formatPercent(s.changePercent)}`).join(", ")}`
      : undefined,
    stocks: defensiveStocks.length > 0
      ? defensiveStocks.map((s) => ({ name: s.name, code: s.code, change: s.changePercent }))
      : undefined,
    tags: ["전략", "세이브티커"],
    severity: "info",
    timestamp: new Date(now.getTime() - 1 * 60000),
  });

  return threads.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

const severityBorder: Record<string, string> = {
  critical: "border-l-red-500",
  warning: "border-l-orange-400",
  info: "border-l-cyan-400",
  positive: "border-l-emerald-400",
};

function timeAgoShort(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diff < 1) return "방금";
  if (diff < 60) return `${diff}분 전`;
  return `${Math.floor(diff / 60)}시간 전`;
}

export default function MarketBriefing() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["market-overview", "safe-ticker"]));
  const [showAll, setShowAll] = useState(false);

  const threads = useMemo(() => generateBriefings(), []);
  const displayThreads = showAll ? threads : threads.slice(0, 4);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="bg-[#12121a] rounded-xl border border-gray-800/50 p-3 sm:p-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-gray-200">🛡️ 세이브티커 정세 브리핑</h2>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
          <Clock className="w-3 h-3" />
          <span>실시간 업데이트</span>
        </div>
      </div>

      {/* 쓰레드 타임라인 */}
      <div className="relative">
        {/* 타임라인 세로선 */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-800/80 hidden sm:block" />

        <div className="space-y-2 sm:space-y-3">
          {displayThreads.map((thread) => {
            const isOpen = expanded.has(thread.id);
            return (
              <div
                key={thread.id}
                className={`relative sm:pl-9 border-l-2 sm:border-l-0 ${severityBorder[thread.severity]} sm:border-l-transparent rounded-lg`}
              >
                {/* 타임라인 도트 (데스크톱) */}
                <div className={`absolute left-[11px] top-3 w-[9px] h-[9px] rounded-full border-2 hidden sm:block ${
                  thread.severity === "critical" ? "bg-red-500 border-red-400" :
                  thread.severity === "warning" ? "bg-orange-400 border-orange-300" :
                  thread.severity === "positive" ? "bg-emerald-400 border-emerald-300" :
                  "bg-cyan-400 border-cyan-300"
                }`} />

                <div
                  className="bg-gray-800/20 hover:bg-gray-800/40 rounded-lg p-2.5 sm:p-3 cursor-pointer transition-colors active:bg-gray-800/50"
                  onClick={() => toggle(thread.id)}
                >
                  {/* 상단: 라벨 + 시간 */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold ${thread.labelColor}`}>
                      {thread.icon}
                      {thread.label}
                    </span>
                    <span className="text-[10px] text-gray-600 ml-auto shrink-0">
                      {timeAgoShort(thread.timestamp)}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                    )}
                  </div>

                  {/* 제목 */}
                  <h3 className="text-[13px] sm:text-sm font-semibold text-gray-200 leading-snug">
                    {thread.title}
                  </h3>

                  {/* 펼쳐진 내용 */}
                  {isOpen && (
                    <div className="mt-2 space-y-2">
                      <p className="text-xs sm:text-[13px] text-gray-400 leading-relaxed whitespace-pre-line">
                        {thread.content}
                      </p>

                      {thread.detail && (
                        <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">
                          {thread.detail}
                        </p>
                      )}

                      {/* 관련 종목 칩 */}
                      {thread.stocks && thread.stocks.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {thread.stocks.map((s) => (
                            <button
                              key={s.code}
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/stockpulse/stock/${s.code}`);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800/60 hover:bg-gray-700/60 rounded-md text-[11px] font-medium transition-colors active:scale-95"
                            >
                              <span className="text-gray-300">{s.name}</span>
                              <span className={`font-mono ${getChangeColor(s.change)}`}>
                                {s.change > 0 ? "+" : ""}{s.change.toFixed(1)}%
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* 태그 */}
                      {thread.tags && thread.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {thread.tags.map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 bg-gray-800/50 rounded text-[10px] text-gray-500">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 더보기 */}
      {threads.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 py-2 text-xs text-gray-500 hover:text-emerald-400 transition-colors"
        >
          {showAll ? "접기" : `${threads.length - 4}건 더보기`}
        </button>
      )}
    </div>
  );
}
