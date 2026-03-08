"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Header from "@/components/layout/Header";
import { getSectorStats, getStocksBySector, type StockListItem } from "@/lib/stock-list";
import { formatNumber, formatPercent, getChangeColor } from "@/lib/utils";

export default function SectorsPage() {
  const router = useRouter();
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const sectorStats = useMemo(() => getSectorStats(), []);

  const chartData = useMemo(
    () =>
      sectorStats.map((s) => ({
        name: s.sector,
        avgChange: s.avgChange,
      })),
    [sectorStats]
  );

  const selectedStocks = useMemo(
    () => (selectedSector ? getStocksBySector(selectedSector) : []),
    [selectedSector]
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] dark:bg-[#0a0a0f]">
      <Header />
      <main className="max-w-[1800px] mx-auto px-4 py-6 space-y-6">
        <h1 className="text-xl font-bold text-gray-200 dark:text-gray-200">🏭 섹터별 분석</h1>

        {/* Chart */}
        <div className="bg-[#12121a] dark:bg-[#12121a] rounded-xl border border-gray-800/50 dark:border-gray-800/50 p-4">
          <h2 className="text-sm font-semibold text-gray-200 dark:text-gray-200 mb-4">섹터별 평균 등락률</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
              <XAxis
                dataKey="name"
                stroke="#4a4a5a"
                tick={{ fontSize: 11 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke="#4a4a5a"
                tick={{ fontSize: 11 }}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#12121a",
                  border: "1px solid #2a2a3a",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value) => [`${Number(value).toFixed(2)}%`, "평균 등락률"]}
              />
              <Bar dataKey="avgChange" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={entry.avgChange >= 0 ? "#ef4444" : "#3b82f6"}
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sector cards or stock list */}
        {selectedSector ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedSector(null)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              전체 섹터로 돌아가기
            </button>
            <h2 className="text-lg font-semibold text-gray-200 dark:text-gray-200">
              {selectedSector} 섹터 종목
            </h2>
            <div className="bg-[#12121a] dark:bg-[#12121a] rounded-xl border border-gray-800/50 dark:border-gray-800/50 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800/50 dark:border-gray-800/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500">종목명</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500">PER</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500">PBR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500">시가총액</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500">등락률</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500">거래량</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStocks
                    .sort((a, b) => b.marketCap - a.marketCap)
                    .map((stock) => (
                      <tr
                        key={stock.code}
                        onClick={() => router.push(`/stock/${stock.code}`)}
                        className="border-b border-gray-800/30 dark:border-gray-800/30 hover:bg-gray-800/30 dark:hover:bg-gray-800/30 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-200 dark:text-gray-200">{stock.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-500 ml-2 font-mono">{stock.code}</span>
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-300 dark:text-gray-300">
                          {stock.per > 0 ? stock.per.toFixed(1) : "-"}
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-300 dark:text-gray-300">
                          {stock.pbr > 0 ? stock.pbr.toFixed(2) : "-"}
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-300 dark:text-gray-300">
                          {formatNumber(stock.marketCap * 100000000)}
                        </td>
                        <td className={`px-4 py-3 text-sm font-mono ${getChangeColor(stock.changePercent)}`}>
                          {formatPercent(stock.changePercent)}
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-300 dark:text-gray-300">
                          {stock.volume.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sectorStats.map((stat) => (
              <div
                key={stat.sector}
                onClick={() => setSelectedSector(stat.sector)}
                className="bg-[#12121a] dark:bg-[#12121a] rounded-xl border border-gray-800/50 dark:border-gray-800/50 p-4 hover:border-emerald-500/30 cursor-pointer transition-all hover:shadow-lg hover:shadow-emerald-500/5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-200 dark:text-gray-200">{stat.sector}</h3>
                  <div className="flex items-center gap-1">
                    {stat.avgChange >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-red-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-blue-500" />
                    )}
                    <span className={`text-sm font-mono font-bold ${getChangeColor(stat.avgChange)}`}>
                      {formatPercent(stat.avgChange)}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                  {stat.stockCount}개 종목 · 총 {formatNumber(stat.totalMarketCap * 100000000)}
                </div>

                <div className="space-y-1.5">
                  {stat.topStocks.map((stock) => (
                    <div key={stock.code} className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 dark:text-gray-400 truncate">{stock.name}</span>
                      <span className={`text-xs font-mono ${getChangeColor(stock.changePercent)}`}>
                        {formatPercent(stock.changePercent)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-2 border-t border-gray-800/30 dark:border-gray-800/30 flex items-center justify-end">
                  <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                    상세보기 <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
