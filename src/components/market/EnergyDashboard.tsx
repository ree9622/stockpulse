"use client";

import { useState, useEffect, useRef } from "react";
import { Fuel, BarChart3, ExternalLink, Moon } from "lucide-react";

/* ── 야간선물 차트 (TradingView Advanced Chart) ── */
function NightFuturesChart({ symbol, title }: { symbol: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const id = `tv_night_${symbol.replace(/[^a-zA-Z0-9]/g, "_")}`;

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = `<div id="${id}" style="height:100%;width:100%"></div>`;

    const script = document.createElement("script");
    script.src = "https://s.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      // @ts-expect-error TradingView global
      if (window.TradingView) {
        // @ts-expect-error TradingView global
        new window.TradingView.widget({
          container_id: id,
          symbol: symbol,
          interval: "5",
          timezone: "Asia/Seoul",
          theme: "dark",
          style: "1",
          locale: "kr",
          toolbar_bottom: true,
          hide_top_toolbar: false,
          hide_side_toolbar: true,
          allow_symbol_change: false,
          save_image: false,
          withdateranges: true,
          autosize: true,
          backgroundColor: "rgba(0,0,0,0)",
          gridColor: "rgba(255,255,255,0.03)",
        });
      }
    };
    containerRef.current.appendChild(script);
  }, [symbol, id]);

  return (
    <div className="bg-gray-800/20 rounded-lg border border-gray-700/30 overflow-hidden">
      <div className="px-3 pt-2 pb-1 flex items-center gap-2 border-b border-gray-800/30">
        <Moon className="w-3.5 h-3.5 text-yellow-400" />
        <span className="text-xs font-semibold text-gray-300">{title}</span>
        <span className="text-[10px] text-gray-500 ml-auto">야간 18:00~06:00</span>
      </div>
      <div ref={containerRef} style={{ height: "300px" }} />
    </div>
  );
}

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
          {/* 야간선물 차트 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <NightFuturesChart symbol="KRX:101V6000" title="코스피 야간선물 (KOSPI 200)" />
            <NightFuturesChart symbol="KRX:106V6000" title="코스닥 야간선물 (KOSDAQ 150)" />
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
