"use client";

import { marketIndices } from "@/lib/mock-data";
import { formatPercent, getChangeColor } from "@/lib/utils";

export default function MarketTicker() {
  return (
    <div className="bg-[#0d0d14] border-b border-gray-800/50 overflow-hidden">
      <div className="flex animate-scroll">
        {[...marketIndices, ...marketIndices].map((index, i) => (
          <div
            key={`${index.name}-${i}`}
            className="flex items-center gap-3 px-6 py-2 shrink-0 border-r border-gray-800/30"
          >
            <span className="text-xs text-gray-400 font-medium">{index.name}</span>
            <span className="text-sm text-gray-200 font-mono">
              {index.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
            <span className={`text-xs font-mono ${getChangeColor(index.change)}`}>
              {formatPercent(index.changePercent)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
