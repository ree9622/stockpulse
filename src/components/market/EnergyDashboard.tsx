"use client";

import { useState, useEffect, useRef } from "react";
import { Fuel, BarChart3, ExternalLink } from "lucide-react";

const WIDGETS = [
  { symbol: "NYMEX:CL1!", label: "WTI 선물", color: "#ef4444" },
  { symbol: "ICEEUR:BRN1!", label: "브렌트 선물", color: "#f97316" },
  { symbol: "NYMEX:NG1!", label: "천연가스 선물", color: "#3b82f6" },
  { symbol: "KRX:KOSPI200", label: "KOSPI200", color: "#10b981" },
  { symbol: "FOREXCOM:XAUUSD", label: "금 현물", color: "#eab308" },
  { symbol: "FX_IDC:USDKRW", label: "USD/KRW", color: "#8b5cf6" },
];

function TradingViewWidget({ symbol, label, color }: { symbol: string; label: string; color: string }) {
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
      fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
      fontSize: "10",
      noTimeScale: false,
      valuesTracking: "1",
      changeMode: "price-and-percent",
      chartType: "area",
      lineWidth: 2,
      lineColor: color,
      topColor: `${color}33`,
      bottomColor: `${color}00`,
      dateRanges: ["1d|1", "1w|15", "1m|60", "3m|1D"],
      isTransparent: true,
    });

    containerRef.current.appendChild(script);
  }, [symbol, label, color]);

  return (
    <div className="bg-gray-800/30 rounded-lg border border-gray-700/30 overflow-hidden" style={{ minHeight: "180px" }}>
      <div
        ref={containerRef}
        className="tradingview-widget-container"
        style={{ height: "180px", width: "100%" }}
      />
    </div>
  );
}

export default function EnergyDashboard() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-[#12121a] rounded-xl border border-gray-800/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Fuel className="w-4 h-4 text-orange-400" />
          <h2 className="text-sm font-semibold text-gray-200">🛢 에너지·원자재·선물 모니터</h2>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {WIDGETS.map((w) => (
            <TradingViewWidget key={w.symbol} {...w} />
          ))}
        </div>
      )}
    </div>
  );
}
