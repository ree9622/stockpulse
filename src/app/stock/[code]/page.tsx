"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Newspaper,
  RefreshCw,
  Bell,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPrice, formatPercent, formatNumber, getChangeColor } from "@/lib/utils";
import type { StockDetail } from "@/lib/stock-api";
import AlertModal from "@/components/market/AlertModal";

interface HistoryPoint {
  date: string;
  close: number;
}

export default function StockDetailPage() {
  const params = useParams();
  const code = params.code as string;

  const [detail, setDetail] = useState<StockDetail | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [detailRes, historyRes] = await Promise.all([
          fetch(`/stockpulse/api/stocks?type=detail&code=${code}`),
          fetch(`/stockpulse/api/stocks?type=history&code=${code}&days=30`),
        ]);

        if (detailRes.ok) {
          const d = await detailRes.json();
          setDetail(d.detail);
        } else {
          setError("종목 정보를 불러올 수 없습니다");
        }

        if (historyRes.ok) {
          const h = await historyRes.json();
          setHistory(h.history || []);
        }
      } catch {
        setError("네트워크 오류가 발생했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [code]);

  const handleAlertSubmit = async (data: { targetPrice: number; direction: "above" | "below" }) => {
    try {
      const res = await fetch("/stockpulse/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "anonymous",
          stockCode: code,
          stockName: detail?.name || code,
          targetPrice: data.targetPrice,
          direction: data.direction,
        }),
      });

      if (res.ok) {
        setAlertMsg("✅ 알림이 설정되었습니다");
        setShowAlertModal(false);
        setTimeout(() => setAlertMsg(null), 3000);
      } else {
        setAlertMsg("❌ 알림 설정에 실패했습니다");
        setTimeout(() => setAlertMsg(null), 3000);
      }
    } catch {
      setAlertMsg("❌ 네트워크 오류가 발생했습니다");
      setTimeout(() => setAlertMsg(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">{error || "종목을 찾을 수 없습니다"}</p>
        <Link
          href="/"
          className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          대시보드로 돌아가기
        </Link>
      </div>
    );
  }

  const infoItems = [
    { label: "시가총액", value: formatNumber(detail.marketCap) },
    { label: "PER", value: detail.per ? detail.per.toFixed(2) : "-" },
    { label: "PBR", value: detail.pbr ? detail.pbr.toFixed(2) : "-" },
    { label: "거래량", value: formatNumber(detail.volume) },
    { label: "전일 종가", value: detail.prevClose ? formatPrice(detail.prevClose) : "-" },
    { label: "일중 고가", value: detail.dayHigh ? formatPrice(detail.dayHigh) : "-" },
    { label: "일중 저가", value: detail.dayLow ? formatPrice(detail.dayLow) : "-" },
    { label: "52주 최고", value: detail.high52w ? formatPrice(detail.high52w) : "-" },
    { label: "52주 최저", value: detail.low52w ? formatPrice(detail.low52w) : "-" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <h1 className="text-lg font-bold text-gray-200">{detail.name}</h1>
            <span className="text-sm text-gray-500">{detail.code}</span>
          </div>
          <button
            onClick={() => setShowAlertModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-sm text-emerald-400 font-medium hover:bg-emerald-500/25 transition-colors"
          >
            <Bell className="w-4 h-4" />
            알림 설정
          </button>
        </div>
      </header>

      {/* Alert message */}
      {alertMsg && (
        <div className="max-w-[1200px] mx-auto px-4 pt-2">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2 text-sm text-emerald-400">
            {alertMsg}
          </div>
        </div>
      )}

      <main className="max-w-[1200px] mx-auto px-4 py-6 space-y-6">
        {/* 현재가 + 등락 */}
        <div className="bg-[#12121a] rounded-xl border border-gray-800/50 p-6">
          <div className="flex items-end gap-4">
            <span className={`text-4xl font-bold font-mono ${getChangeColor(detail.change)}`}>
              {formatPrice(detail.price)}
            </span>
            <div className={`flex items-center gap-2 text-lg font-mono ${getChangeColor(detail.change)}`}>
              {detail.change > 0 ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              <span>
                {detail.change > 0 ? "+" : ""}
                {formatPrice(detail.change)}
              </span>
              <span>({formatPercent(detail.changePercent)})</span>
            </div>
          </div>
        </div>

        {/* 차트 + 정보 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 가격 차트 */}
          <div className="lg:col-span-2 bg-[#12121a] rounded-xl border border-gray-800/50 p-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-gray-200">최근 30일 가격 차트</h2>
            </div>
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                  <XAxis
                    dataKey="date"
                    stroke="#4a4a5a"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v: string) => v.slice(5)}
                  />
                  <YAxis
                    stroke="#4a4a5a"
                    tick={{ fontSize: 11 }}
                    domain={["auto", "auto"]}
                    tickFormatter={(v: number) => v.toLocaleString()}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#12121a",
                      border: "1px solid #2a2a3a",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "#9ca3af" }}
                    formatter={(value) => [formatPrice(value as number), "종가"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#10b981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500 text-sm">
                차트 데이터를 불러올 수 없습니다
              </div>
            )}
          </div>

          {/* 종목 정보 */}
          <div className="bg-[#12121a] rounded-xl border border-gray-800/50 p-4">
            <h2 className="text-sm font-semibold text-gray-200 mb-4">📊 종목 정보</h2>
            <div className="space-y-3">
              {infoItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <span className="text-sm text-gray-200 font-mono">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 관련 뉴스 */}
        <div className="bg-[#12121a] rounded-xl border border-gray-800/50 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-gray-200">📰 관련 뉴스</h2>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 py-8 text-center">
              {detail.name} 관련 뉴스가 준비 중입니다
            </p>
          </div>
        </div>
      </main>

      {/* Alert Modal */}
      {showAlertModal && (
        <AlertModal
          stockCode={code}
          stockName={detail.name}
          currentPrice={detail.price}
          onClose={() => setShowAlertModal(false)}
          onSubmit={handleAlertSubmit}
        />
      )}
    </div>
  );
}
