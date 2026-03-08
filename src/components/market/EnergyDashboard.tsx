"use client";

import { useState } from "react";
import { Fuel, BarChart3, ExternalLink } from "lucide-react";

const WIDGETS = [
  { symbol: "TVC:USOIL", label: "WTI 원유", color: "#ef4444" },
  { symbol: "TVC:UKOIL", label: "브렌트유", color: "#f97316" },
  { symbol: "TVC:NATGAS", label: "천연가스", color: "#3b82f6" },
  { symbol: "KRX:KOSPI200", label: "KOSPI200", color: "#10b981" },
  { symbol: "FOREXCOM:XAUUSD", label: "금 현물", color: "#eab308" },
  { symbol: "FX_IDC:USDKRW", label: "USD/KRW", color: "#8b5cf6" },
];

function MiniChart({ symbol, label, color }: { symbol: string; label: string; color: string }) {
  const widgetHtml = `
    <div class="tradingview-widget-container" style="height:100%;width:100%">
      <iframe
        scrolling="no"
        allowtransparency="true"
        frameborder="0"
        src="https://s.tradingview.com/embed-widget/mini-symbol-overview/?locale=kr&symbol=${encodeURIComponent(symbol)}&dateRange=1D&colorTheme=dark&isTransparent=true&autosize=true&largeChartUrl=https://www.tradingview.com/chart/?symbol=${encodeURIComponent(symbol)}"
        style="box-sizing:border-box;height:100%;width:100%"
      ></iframe>
    </div>
  `;

  return (
    <div className="bg-gray-800/30 rounded-lg border border-gray-700/30 overflow-hidden" style={{ minHeight: "160px" }}>
      <div className="px-2 pt-1.5 flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[11px] font-semibold text-gray-300">{label}</span>
      </div>
      <div style={{ height: "140px" }} dangerouslySetInnerHTML={{ __html: widgetHtml }} />
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {WIDGETS.map((w) => (
            <MiniChart key={w.symbol} {...w} />
          ))}
        </div>
      )}
    </div>
  );
}
