"use client";

import { useState, useEffect, useRef } from "react";
import { Fuel, BarChart3, ExternalLink, Moon } from "lucide-react";

/* ── 원자재 위젯 (symbol-overview) ── */
function CommodityWidget({ symbol, label, color }: { symbol: string; label: string; color: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [[symbol, label]],
      chartOnly: false,
      width: "100%",
      height: "100%",
      locale: "kr",
      colorTheme: "dark",
      autosize: true,
      showVolume: false,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: "no",
      scaleMode: "Normal",
      fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      fontSize: "10",
      noTimeScale: false,
      valuesTracking: "1",
      changeMode: "price-and-percent",
      chartType: "area",
      lineWidth: 2,
      lineColor: color,
      topColor: `${color}33`,
      bottomColor: `${color}00`,
      dateRanges: ["1d|1", "1w|15", "1m|60"],
      isTransparent: true,
    });

    containerRef.current.appendChild(script);
  }, [symbol, label, color]);

  return (
    <div className="bg-gray-800/20 rounded-lg border border-gray-700/30 overflow-hidden">
      <div ref={containerRef} style={{ height: "170px", width: "100%" }} />
    </div>
  );
}

const COMMODITIES = [
  { symbol: "TVC:USOIL", label: "WTI 원유", color: "#ef4444" },
  { symbol: "TVC:UKOIL", label: "브렌트유", color: "#f97316" },
  { symbol: "PEPPERSTONE:NATGAS", label: "천연가스", color: "#3b82f6" },
  { symbol: "FOREXCOM:XAUUSD", label: "금 현물", color: "#eab308" },
  { symbol: "FX_IDC:USDKRW", label: "USD/KRW", color: "#8b5cf6" },
];

export default function EnergyDashboard() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-[#12121a] rounded-xl border border-gray-800/50 p-3 sm:p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Fuel className="w-4 h-4 text-orange-400" />
          <h2 className="text-sm font-semibold text-gray-200">🛢 에너지·원자재·야간선물</h2>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://longshortnow.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 bg-gray-800/50 hover:bg-gray-700/50 rounded text-[10px] text-gray-400 hover:text-emerald-400 transition-colors"
          >
            <BarChart3 className="w-3 h-3" />
            롱숏나우
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] text-gray-500 hover:text-gray-300 px-2 py-1 bg-gray-800/50 rounded transition-colors"
          >
            {expanded ? "접기" : "펼치기"}
          </button>
        </div>
      </div>

      {expanded && (
        <>
          {/* 야간선물 — longshortnow.com 임베드 */}
          <div className="bg-gray-800/20 rounded-lg border border-gray-700/30 overflow-hidden">
            <div className="px-3 py-2 flex items-center gap-2 border-b border-gray-800/30">
              <Moon className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs font-semibold text-gray-300">코스피·코스닥 야간선물</span>
              <span className="text-[10px] text-gray-500 ml-1">18:00 ~ 06:00</span>
              <a
                href="https://longshortnow.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-[10px] text-gray-500 hover:text-cyan-400 flex items-center gap-1 transition-colors"
              >
                longshortnow.com <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <iframe
              src="https://longshortnow.com"
              className="w-full border-0"
              style={{ height: "480px" }}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
              title="롱숏나우 야간선물"
            />
          </div>

          {/* 원자재 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {COMMODITIES.map((w) => (
              <CommodityWidget key={w.symbol} {...w} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
