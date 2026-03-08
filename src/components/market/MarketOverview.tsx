"use client";

import { useEffect, useState } from "react";
import { marketIndices as mockIndices } from "@/lib/mock-data";
import { formatPercent, getChangeColor } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { MarketIndex } from "@/types";

export default function MarketOverview() {
  const [indices, setIndices] = useState<MarketIndex[]>(mockIndices);

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const res = await fetch("/stockpulse/api/stocks?type=indices");
        if (res.ok) {
          const data = await res.json();
          if (data.indices && data.indices.length > 0) {
            setIndices(data.indices);
          }
        }
      } catch {
        // fallback to mock
      }
    };

    fetchIndices();
    const interval = setInterval(fetchIndices, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {indices.slice(0, 8).map((index) => (
        <div
          key={index.name}
          className="bg-[#12121a] rounded-xl border border-gray-800/50 p-3 hover:border-gray-700/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400 font-medium">{index.name}</span>
            {index.status === "up" ? (
              <TrendingUp className="w-3.5 h-3.5 text-red-400" />
            ) : index.status === "down" ? (
              <TrendingDown className="w-3.5 h-3.5 text-blue-400" />
            ) : (
              <Minus className="w-3.5 h-3.5 text-gray-500" />
            )}
          </div>
          <div className="text-lg font-bold text-gray-200 font-mono">
            {index.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div className={`text-xs font-mono mt-0.5 ${getChangeColor(index.change)}`}>
            {index.change > 0 ? "+" : ""}
            {index.change.toFixed(2)} ({formatPercent(index.changePercent)})
          </div>
        </div>
      ))}
    </div>
  );
}
