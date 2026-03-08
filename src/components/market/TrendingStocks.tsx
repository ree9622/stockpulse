"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trendingStocks as mockStocks } from "@/lib/mock-data";
import { formatPrice, formatPercent, formatNumber, getChangeColor } from "@/lib/utils";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import type { Stock } from "@/types";

export default function TrendingStocks() {
  const [stocks, setStocks] = useState<Stock[]>(mockStocks);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/stockpulse/api/stocks?type=trending");
      if (res.ok) {
        const data = await res.json();
        if (data.stocks && data.stocks.length > 0) {
          setStocks(data.stocks);
          setLastUpdated(new Date());
        }
      }
    } catch {
      // fallback to mock data (already set)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 60_000); // 1분마다 갱신
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#12121a] rounded-xl border border-gray-800/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-200">🔥 실시간 인기 종목</h2>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-[10px] text-gray-600">
              {lastUpdated.toLocaleTimeString("ko-KR")} 업데이트
            </span>
          )}
          <button
            onClick={fetchStocks}
            disabled={loading}
            className="p-1 text-gray-500 hover:text-emerald-400 transition-colors disabled:animate-spin"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs border-b border-gray-800/50">
              <th className="text-left py-2 pr-2">종목</th>
              <th className="text-right py-2 px-2">현재가</th>
              <th className="text-right py-2 px-2">등락률</th>
              <th className="text-right py-2 px-2 hidden sm:table-cell">거래량</th>
              <th className="text-right py-2 pl-2 hidden md:table-cell">시가총액</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr
                key={stock.code}
                className="border-b border-gray-800/30 hover:bg-gray-800/30 cursor-pointer transition-colors"
              >
                <td className="py-2.5 pr-2">
                  <Link href={`/stock/${stock.code}`} className="block">
                    <div className="text-gray-200 font-medium text-sm hover:text-emerald-400 transition-colors">
                      {stock.name}
                    </div>
                    <div className="text-gray-500 text-xs">{stock.code}</div>
                  </Link>
                </td>
                <td className={`text-right py-2.5 px-2 font-mono ${getChangeColor(stock.change)}`}>
                  {formatPrice(stock.price)}
                </td>
                <td className="text-right py-2.5 px-2">
                  <div className={`flex items-center justify-end gap-1 font-mono ${getChangeColor(stock.change)}`}>
                    {stock.change > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="text-sm">{formatPercent(stock.changePercent)}</span>
                  </div>
                </td>
                <td className="text-right py-2.5 px-2 text-gray-400 font-mono text-xs hidden sm:table-cell">
                  {formatNumber(stock.volume)}
                </td>
                <td className="text-right py-2.5 pl-2 text-gray-400 font-mono text-xs hidden md:table-cell">
                  {formatNumber(stock.marketCap)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
