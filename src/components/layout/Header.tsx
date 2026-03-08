"use client";

import { Search, Bell, TrendingUp, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { searchStocks, type StockListItem } from "@/lib/stock-list";
import AuthButton from "./AuthButton";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { label: "대시보드", href: "/", scrollTo: null },
  { label: "히트맵", href: "/", scrollTo: "heatmap" },
  { label: "스크리너", href: "/screener", scrollTo: null },
  { label: "뉴스", href: "/", scrollTo: "news" },
  { label: "섹터", href: "/sectors", scrollTo: null },
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<StockListItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const found = searchStocks(searchQuery);
    setResults(found);
    setShowDropdown(found.length > 0 && searchQuery.length > 0);
    setSelectedIdx(-1);
  }, [searchQuery]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // 모바일 메뉴 열린 상태에서 스크롤 방지
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const navigateToStock = (code: string) => {
    setSearchQuery("");
    setShowDropdown(false);
    setMobileSearchOpen(false);
    router.push(`/stock/${code}`);
  };

  const handleNavClick = (item: typeof NAV_ITEMS[0]) => {
    setMobileMenuOpen(false);
    if (item.scrollTo) {
      if (pathname === "/" || pathname === "/") {
        const el = document.getElementById(item.scrollTo);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          return;
        }
      }
      router.push(`/#${item.scrollTo}`);
    } else {
      router.push(item.href);
    }
  };

  const isActive = (item: typeof NAV_ITEMS[0]) => {
    if (item.href === "/" && !item.scrollTo) {
      return pathname === "/" || pathname === "";
    }
    if (item.scrollTo) return false;
    return pathname === item.href || pathname === item.href + "/";
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
    <>
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/95 dark:bg-[#0a0a0f]/95 light:bg-white/95 backdrop-blur-md border-b border-gray-800 dark:border-gray-800 light:border-gray-200">
        <div className="max-w-[1800px] mx-auto px-3 sm:px-4 h-14 flex items-center gap-2 sm:gap-4">
          {/* 모바일 햄버거 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/stockpulse/favicon.svg" alt="주식갤" className="w-6 h-6 sm:w-7 sm:h-7" />
            <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              주식갤
            </span>
          </Link>

          {/* 데스크톱 Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item)
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* 데스크톱 Search */}
          <div className="hidden sm:block flex-1 max-w-md ml-auto relative" ref={dropdownRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                ref={inputRef}
                type="text"
                placeholder="종목명 / 코드 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
              />
            </div>
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#12121a] border border-gray-700/50 rounded-lg shadow-xl shadow-black/50 overflow-hidden z-50 max-h-[60vh] overflow-y-auto">
                {results.map((item, idx) => (
                  <button
                    key={item.code}
                    onMouseDown={() => navigateToStock(item.code)}
                    onMouseEnter={() => setSelectedIdx(idx)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                      idx === selectedIdx ? "bg-emerald-500/10 text-emerald-400" : "text-gray-200 hover:bg-gray-800/50"
                    }`}
                  >
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-gray-500 font-mono">{item.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 모바일 검색 버튼 */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="sm:hidden ml-auto p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Actions */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <ThemeToggle />
            <button className="relative p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="hidden sm:block">
              <AuthButton />
            </div>
          </div>
        </div>

        {/* 모바일 검색 바 */}
        {mobileSearchOpen && (
          <div className="sm:hidden px-3 pb-3 border-t border-gray-800/50" ref={dropdownRef}>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                autoFocus
                type="text"
                placeholder="종목명 / 코드 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            {showDropdown && (
              <div className="mt-1 bg-[#12121a] border border-gray-700/50 rounded-lg shadow-xl overflow-hidden max-h-[50vh] overflow-y-auto">
                {results.map((item, idx) => (
                  <button
                    key={item.code}
                    onMouseDown={() => navigateToStock(item.code)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                      idx === selectedIdx ? "bg-emerald-500/10 text-emerald-400" : "text-gray-200 hover:bg-gray-800/50"
                    }`}
                  >
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-gray-500 font-mono">{item.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      {/* 모바일 네비게이션 오버레이 */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* 배경 딤 */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          {/* 사이드 메뉴 */}
          <div className="absolute top-14 left-0 right-0 bg-[#0d0d14] border-b border-gray-800/50 shadow-2xl">
            <nav className="p-2 space-y-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(item)
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "text-gray-300 hover:bg-gray-800/50 active:bg-gray-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="px-4 py-3 border-t border-gray-800/50">
              <AuthButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
