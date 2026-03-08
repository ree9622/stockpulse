"use client";

import { Search, Bell, TrendingUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { searchStocks, type StockListItem } from "@/lib/stock-list";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<StockListItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const found = searchStocks(searchQuery);
    setResults(found);
    setShowDropdown(found.length > 0 && searchQuery.length > 0);
    setSelectedIdx(-1);
  }, [searchQuery]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navigateToStock = (code: string) => {
    setSearchQuery("");
    setShowDropdown(false);
    router.push(`/stockpulse/stock/${code}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIdx >= 0 && selectedIdx < results.length) {
        navigateToStock(results[selectedIdx].code);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-[1800px] mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <div
          className="flex items-center gap-2 shrink-0 cursor-pointer"
          onClick={() => router.push("/stockpulse")}
        >
          <TrendingUp className="w-6 h-6 text-emerald-400" />
          <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            StockPulse
          </span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          {[
            { label: "대시보드", active: true },
            { label: "히트맵", active: false },
            { label: "스크리너", active: false },
            { label: "뉴스", active: false },
            { label: "섹터", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-md ml-auto relative" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              ref={inputRef}
              type="text"
              placeholder="종목명 / 코드 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (results.length > 0) setShowDropdown(true);
              }}
              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
            />
          </div>

          {/* 자동완성 드롭다운 */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#12121a] border border-gray-700/50 rounded-lg shadow-xl shadow-black/50 overflow-hidden z-50">
              {results.map((item, idx) => (
                <button
                  key={item.code}
                  onMouseDown={() => navigateToStock(item.code)}
                  onMouseEnter={() => setSelectedIdx(idx)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                    idx === selectedIdx
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-gray-200 hover:bg-gray-800/50"
                  }`}
                >
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-xs text-gray-500 font-mono">{item.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="relative p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button className="px-3 py-1.5 bg-emerald-500/15 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/25 transition-colors">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
