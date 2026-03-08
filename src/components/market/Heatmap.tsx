"use client";

import { heatmapData } from "@/lib/mock-data";
import { getHeatmapColor, formatPercent } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Heatmap() {
  const router = useRouter();
  const maxMcap = Math.max(...heatmapData.map((d) => d.marketCap));

  return (
    <div className="bg-[#12121a] rounded-xl border border-gray-800/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-sm font-semibold text-gray-200">📊 KOSPI 히트맵</h2>
        <div className="flex items-center gap-2 text-[10px] text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-blue-600" /> 하락
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-gray-600" /> 보합
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-red-600" /> 상승
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1">
        {heatmapData
          .sort((a, b) => b.marketCap - a.marketCap)
          .map((item) => {
            const sizeRatio = Math.max(item.marketCap / maxMcap, 0.3);
            const height = Math.max(50, sizeRatio * 100);
            return (
              <div
                key={item.code}
                onClick={() => router.push(`/stockpulse/stock/${item.code}`)}
                className={`${getHeatmapColor(item.changePercent)} rounded-lg p-1.5 sm:p-2 flex flex-col justify-center items-center cursor-pointer hover:brightness-125 transition-all group relative active:scale-95`}
                style={{ minHeight: `${height}px` }}
              >
                <span className="text-[10px] sm:text-[11px] font-bold text-white/90 text-center leading-tight truncate w-full">
                  {item.name}
                </span>
                <span className="text-[9px] sm:text-[10px] text-white/70 font-mono mt-0.5">
                  {formatPercent(item.changePercent)}
                </span>

                {/* Tooltip - 데스크톱만 */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden md:group-hover:block z-10">
                  <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-xl">
                    <div className="text-gray-200 font-semibold">{item.name} ({item.code})</div>
                    <div className="text-gray-400">{item.sector}</div>
                    <div className={item.changePercent >= 0 ? "text-red-400" : "text-blue-400"}>
                      {formatPercent(item.changePercent)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
