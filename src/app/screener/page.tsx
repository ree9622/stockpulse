"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Filter, ArrowUpDown, ChevronUp, ChevronDown, Search } from "lucide-react";
import Header from "@/components/layout/Header";
import { STOCK_LIST, SECTORS, type StockListItem } from "@/lib/stock-list";
import { formatNumber, formatPercent, getChangeColor } from "@/lib/utils";

type SortKey = "name" | "per" | "pbr" | "marketCap" | "volume" | "changePercent" | "sector";
type SortDir = "asc" | "desc";

interface Filters {
  perMin: string;
  perMax: string;
  pbrMin: string;
  pbrMax: string;
  marketCapMin: string;
  marketCapMax: string;
  changeMin: string;
  changeMax: string;
  volumeMin: string;
  volumeMax: string;
  sector: string;
  search: string;
}

const defaultFilters: Filters = {
  perMin: "", perMax: "",
  pbrMin: "", pbrMax: "",
  marketCapMin: "", marketCapMax: "",
  changeMin: "", changeMax: "",
  volumeMin: "", volumeMax: "",
  sector: "",
  search: "",
};

export default function ScreenerPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sortKey, setSortKey] = useState<SortKey>("marketCap");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [showFilters, setShowFilters] = useState(true);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredStocks = useMemo(() => {
    let stocks = STOCK_LIST.filter((s) => s.sector !== "ETF");

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      stocks = stocks.filter((s) => s.name.toLowerCase().includes(q) || s.code.includes(q));
    }

    // Sector
    if (filters.sector) {
      stocks = stocks.filter((s) => s.sector === filters.sector);
    }

    // Range filters
    const applyRange = (list: StockListItem[], field: keyof StockListItem, min: string, max: string) => {
      let result = list;
      if (min) result = result.filter((s) => (s[field] as number) >= parseFloat(min));
      if (max) result = result.filter((s) => (s[field] as number) <= parseFloat(max));
      return result;
    };

    stocks = applyRange(stocks, "per", filters.perMin, filters.perMax);
    stocks = applyRange(stocks, "pbr", filters.pbrMin, filters.pbrMax);
    stocks = applyRange(stocks, "marketCap", filters.marketCapMin, filters.marketCapMax);
    stocks = applyRange(stocks, "changePercent", filters.changeMin, filters.changeMax);
    stocks = applyRange(stocks, "volume", filters.volumeMin, filters.volumeMax);

    // Sort
    stocks.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return stocks;
  }, [filters, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="w-3 h-3 text-gray-600" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-emerald-400" />
    ) : (
      <ChevronDown className="w-3 h-3 text-emerald-400" />
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] dark:bg-[#0a0a0f]">
      <Header />
      <main className="max-w-[1800px] mx-auto px-4 py-6 space-y-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-200 dark:text-gray-200">📊 종목 스크리너</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-emerald-400 hover:bg-gray-800/50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? "필터 숨기기" : "필터 보기"}
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-[#12121a] dark:bg-[#12121a] rounded-xl border border-gray-800/50 dark:border-gray-800/50 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="sm:col-span-2 lg:col-span-4">
                <label className="text-xs text-gray-500 dark:text-gray-500 mb-1 block">종목 검색</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="종목명 또는 코드..."
                    value={filters.search}
                    onChange={(e) => updateFilter("search", e.target.value)}
                    className="w-full bg-gray-800/50 dark:bg-gray-800/50 border border-gray-700/50 dark:border-gray-700/50 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              {/* Sector */}
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-500 mb-1 block">섹터</label>
                <select
                  value={filters.sector}
                  onChange={(e) => updateFilter("sector", e.target.value)}
                  className="w-full bg-gray-800/50 dark:bg-gray-800/50 border border-gray-700/50 dark:border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-200 dark:text-gray-200 focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="">전체</option>
                  {SECTORS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* PER Range */}
              <RangeFilter
                label="PER"
                minVal={filters.perMin}
                maxVal={filters.perMax}
                onMinChange={(v) => updateFilter("perMin", v)}
                onMaxChange={(v) => updateFilter("perMax", v)}
                placeholderMin="0"
                placeholderMax="200"
              />

              {/* PBR Range */}
              <RangeFilter
                label="PBR"
                minVal={filters.pbrMin}
                maxVal={filters.pbrMax}
                onMinChange={(v) => updateFilter("pbrMin", v)}
                onMaxChange={(v) => updateFilter("pbrMax", v)}
                placeholderMin="0"
                placeholderMax="10"
              />

              {/* Change Range */}
              <RangeFilter
                label="등락률 (%)"
                minVal={filters.changeMin}
                maxVal={filters.changeMax}
                onMinChange={(v) => updateFilter("changeMin", v)}
                onMaxChange={(v) => updateFilter("changeMax", v)}
                placeholderMin="-30"
                placeholderMax="30"
              />

              {/* Market Cap */}
              <RangeFilter
                label="시가총액 (억)"
                minVal={filters.marketCapMin}
                maxVal={filters.marketCapMax}
                onMinChange={(v) => updateFilter("marketCapMin", v)}
                onMaxChange={(v) => updateFilter("marketCapMax", v)}
                placeholderMin="0"
                placeholderMax="5000000"
              />

              {/* Volume */}
              <RangeFilter
                label="거래량"
                minVal={filters.volumeMin}
                maxVal={filters.volumeMax}
                onMinChange={(v) => updateFilter("volumeMin", v)}
                onMaxChange={(v) => updateFilter("volumeMax", v)}
                placeholderMin="0"
                placeholderMax="10000000"
              />

              {/* Reset */}
              <div className="flex items-end">
                <button
                  onClick={() => setFilters(defaultFilters)}
                  className="w-full px-4 py-2 bg-gray-800/50 dark:bg-gray-800/50 hover:bg-emerald-500/10 border border-gray-700/50 dark:border-gray-700/50 rounded-lg text-sm text-gray-400 dark:text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  필터 초기화
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="text-sm text-gray-500 dark:text-gray-500">
          {filteredStocks.length}개 종목
        </div>

        {/* Table */}
        <div className="bg-[#12121a] dark:bg-[#12121a] rounded-xl border border-gray-800/50 dark:border-gray-800/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800/50 dark:border-gray-800/50">
                  {[
                    { key: "name" as SortKey, label: "종목명" },
                    { key: "sector" as SortKey, label: "섹터" },
                    { key: "per" as SortKey, label: "PER" },
                    { key: "pbr" as SortKey, label: "PBR" },
                    { key: "marketCap" as SortKey, label: "시가총액" },
                    { key: "changePercent" as SortKey, label: "등락률" },
                    { key: "volume" as SortKey, label: "거래량" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 uppercase cursor-pointer hover:text-emerald-400 transition-colors select-none"
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        <SortIcon column={col.key} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map((stock) => (
                  <tr
                    key={stock.code}
                    onClick={() => router.push(`/stock/${stock.code}`)}
                    className="border-b border-gray-800/30 dark:border-gray-800/30 hover:bg-gray-800/30 dark:hover:bg-gray-800/30 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <span className="text-sm font-medium text-gray-200 dark:text-gray-200">{stock.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-500 ml-2 font-mono">{stock.code}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800/50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-400">
                        {stock.sector}
                      </span>
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
          {filteredStocks.length === 0 && (
            <div className="py-12 text-center text-gray-500 dark:text-gray-500 text-sm">
              조건에 맞는 종목이 없습니다
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function RangeFilter({
  label,
  minVal,
  maxVal,
  onMinChange,
  onMaxChange,
  placeholderMin,
  placeholderMax,
}: {
  label: string;
  minVal: string;
  maxVal: string;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
  placeholderMin: string;
  placeholderMax: string;
}) {
  return (
    <div>
      <label className="text-xs text-gray-500 dark:text-gray-500 mb-1 block">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder={placeholderMin}
          value={minVal}
          onChange={(e) => onMinChange(e.target.value)}
          className="w-full bg-gray-800/50 dark:bg-gray-800/50 border border-gray-700/50 dark:border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-200 dark:text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50"
        />
        <span className="text-gray-600 text-xs">~</span>
        <input
          type="number"
          placeholder={placeholderMax}
          value={maxVal}
          onChange={(e) => onMaxChange(e.target.value)}
          className="w-full bg-gray-800/50 dark:bg-gray-800/50 border border-gray-700/50 dark:border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-200 dark:text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50"
        />
      </div>
    </div>
  );
}
