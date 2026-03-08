"use client";

import { Search, Bell, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-[1800px] mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
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
        <div className="flex-1 max-w-md ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="종목명 / 코드 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
            />
          </div>
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
