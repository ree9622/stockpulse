"use client";

import { heatmapData } from "@/lib/mock-data";
import { getHeatmapColor, formatPercent } from "@/lib/utils";

export default function Heatmap() {
  const maxMcap = Math.max(...heatmapData.map((d) => d.marketCap));

  return (
    <div className="bg-[#12121a] rounded-xl border border-gray-800/50 p-4">
      <div className="flex items-center justify-between mb-4">
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

      <div className="grid grid-cols-6 gap-1 auto-rows-auto">
        {heatmapData
          .sort((a, b) => b.marketCap - a.marketCap)
          .map((item) => {
            const sizeRatio = Math.max(item.marketCap / maxMcap, 0.3);
            const height = Math.max(60, sizeRatio * 100);
            return (
              <div
                key={item.code}
                className={`${getHeatmapColor(item.changePercent)} rounded-lg p-2 flex flex-col justify-center items-center cursor-pointer hover:brightness-125 transition-all group relative`}
                style={{ minHeight: `${height}px` }}
              >
                <span className="text-[11px] font-bold text-white/90 text-center leading-tight">
                  {item.name}
                </span>
                <span className="text-[10px] text-white/70 font-mono mt-0.5">
                  {formatPercent(item.changePercent)}
                </span>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
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
