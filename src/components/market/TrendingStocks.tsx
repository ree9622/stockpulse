"use client";

import { trendingStocks } from "@/lib/mock-data";
import { formatPrice, formatPercent, formatNumber, getChangeColor } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function TrendingStocks() {
  return (
    <div className="bg-[#12121a] rounded-xl border border-gray-800/50 p-4">
      <h2 className="text-sm font-semibold text-gray-200 mb-3">🔥 실시간 인기 종목</h2>

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
            {trendingStocks.map((stock) => (
              <tr
                key={stock.code}
                className="border-b border-gray-800/30 hover:bg-gray-800/30 cursor-pointer transition-colors"
              >
                <td className="py-2.5 pr-2">
                  <div>
                    <div className="text-gray-200 font-medium text-sm">{stock.name}</div>
                    <div className="text-gray-500 text-xs">{stock.code}</div>
                  </div>
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
