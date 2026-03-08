"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  TrendingUp,
  TrendingDown,
  Zap,
  Globe,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertTriangle,
  DollarSign,
  Flame,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { formatPercent, getChangeColor } from "@/lib/utils";

interface BriefingThread {
  id: string;
  icon: string;       // emoji/icon name
  label: string;
  labelColor: string;
  title: string;
  content: string;
  detail?: string;
  tags?: string[];
  stocks?: { name: string; code: string; change: number }[];
  severity: "critical" | "warning" | "info" | "positive";
}

interface Briefing {
  date: string;
  timestamp: number;
  threads: BriefingThread[];
  marketData?: Record<string, unknown>;
  generatedBy?: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  "bar-chart": <BarChart3 className="w-4 h-4" />,
  "dollar": <DollarSign className="w-4 h-4" />,
  "alert": <AlertTriangle className="w-4 h-4" />,
  "flame": <Flame className="w-4 h-4" />,
  "trending-down": <TrendingDown className="w-4 h-4" />,
  "trending-up": <TrendingUp className="w-4 h-4" />,
  "zap": <Zap className="w-4 h-4" />,
  "shield": <Shield className="w-4 h-4" />,
  "globe": <Globe className="w-4 h-4" />,
};

const severityBorder: Record<string, string> = {
  critical: "border-l-red-500",
  warning: "border-l-orange-400",
  info: "border-l-cyan-400",
  positive: "border-l-emerald-400",
};

const severityDot: Record<string, string> = {
  critical: "bg-red-500 border-red-400",
  warning: "bg-orange-400 border-orange-300",
  info: "bg-cyan-400 border-cyan-300",
  positive: "bg-emerald-400 border-emerald-300",
};

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00+09:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "오늘";
  if (diff === 1) return "어제";
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function MarketBriefing() {
  const router = useRouter();
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showPast, setShowPast] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const fetchBriefings = async () => {
    try {
      const url = selectedDate
        ? `/stockpulse/api/briefings?date=${selectedDate}&limit=20`
        : `/stockpulse/api/briefings?limit=10`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setBriefings(data.briefings || []);
        // 최신 브리핑 첫 2개 자동 펼침
        if (data.briefings?.length > 0) {
          const latest = data.briefings[0];
          if (latest.threads?.length > 0) {
            const autoExpand = new Set<string>();
            latest.threads.slice(0, 2).forEach((t: BriefingThread) => {
              autoExpand.add(`${latest.timestamp}-${t.id}`);
            });
            setExpanded(autoExpand);
          }
        }
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBriefings();
    const interval = setInterval(fetchBriefings, 60_000); // 1분마다 새 브리핑 확인
    return () => clearInterval(interval);
  }, [selectedDate]);

  const toggle = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const latestBriefing = briefings[0];
  const pastBriefings = briefings.slice(1);

  // 날짜 선택 옵션
  const dateOptions: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(Date.now() - i * 86400000);
    dateOptions.push(d.toISOString().split("T")[0]);
  }

  return (
    <div className="bg-[#12121a] rounded-xl border border-gray-800/50 p-3 sm:p-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-gray-200">🌐 정세 브리핑</h2>
        </div>
        <div className="flex items-center gap-2">
          {/* 날짜 선택 */}
          <select
            value={selectedDate || ""}
            onChange={(e) => {
              setSelectedDate(e.target.value || null);
              setLoading(true);
            }}
            className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-2 py-1 text-[11px] text-gray-400 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="">최근</option>
            {dateOptions.map((d) => (
              <option key={d} value={d}>{formatDateLabel(d)} ({d.slice(5)})</option>
            ))}
          </select>
          <button
            onClick={() => { setLoading(true); fetchBriefings(); }}
            className="p-1 text-gray-500 hover:text-emerald-400 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* 로딩 */}
      {loading && briefings.length === 0 && (
        <div className="py-8 text-center text-gray-500 text-sm">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
          브리핑 불러오는 중...
        </div>
      )}

      {/* 브리핑 없음 */}
      {!loading && briefings.length === 0 && (
        <div className="py-8 text-center text-gray-500 text-sm">
          <Globe className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>아직 브리핑이 없습니다</p>
          <p className="text-xs mt-1 text-gray-600">10분마다 자동 업데이트됩니다</p>
        </div>
      )}

      {/* 최신 브리핑 */}
      {latestBriefing && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-[11px] text-gray-500">
              {formatDateLabel(latestBriefing.date)} {formatTime(latestBriefing.timestamp)}
            </span>
            {latestBriefing.generatedBy && (
              <span className="text-[10px] text-gray-600 px-1.5 py-0.5 bg-gray-800/50 rounded">
                {latestBriefing.generatedBy}
              </span>
            )}
          </div>

          <div className="relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-800/80 hidden sm:block" />
            <div className="space-y-2 sm:space-y-3">
              {(latestBriefing.threads || []).map((thread: BriefingThread) => {
                const key = `${latestBriefing.timestamp}-${thread.id}`;
                const isOpen = expanded.has(key);
                return (
                  <div
                    key={key}
                    className={`relative sm:pl-9 border-l-2 sm:border-l-0 ${severityBorder[thread.severity] || "border-l-gray-600"} sm:border-l-transparent rounded-lg`}
                  >
                    <div className={`absolute left-[11px] top-3 w-[9px] h-[9px] rounded-full border-2 hidden sm:block ${severityDot[thread.severity] || "bg-gray-400 border-gray-300"}`} />

                    <div
                      className="bg-gray-800/20 hover:bg-gray-800/40 rounded-lg p-2.5 sm:p-3 cursor-pointer transition-colors active:bg-gray-800/50"
                      onClick={() => toggle(key)}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold ${thread.labelColor || "text-gray-400 bg-gray-500/10"}`}>
                          {ICON_MAP[thread.icon] || <Globe className="w-4 h-4" />}
                          {thread.label}
                        </span>
                        <span className="text-[10px] text-gray-600 ml-auto shrink-0">
                          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </span>
                      </div>

                      <h3 className="text-[13px] sm:text-sm font-semibold text-gray-200 leading-snug">
                        {thread.title}
                      </h3>

                      {isOpen && (
                        <div className="mt-2 space-y-2">
                          <p className="text-xs sm:text-[13px] text-gray-400 leading-relaxed whitespace-pre-line">
                            {thread.content}
                          </p>
                          {thread.detail && (
                            <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">
                              {thread.detail}
                            </p>
                          )}
                          {thread.stocks && thread.stocks.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {thread.stocks.map((s) => (
                                <button
                                  key={s.code}
                                  onClick={(e) => { e.stopPropagation(); router.push(`/stock/${s.code}`); }}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800/60 hover:bg-gray-700/60 rounded-md text-[11px] font-medium transition-colors active:scale-95"
                                >
                                  <span className="text-gray-300">{s.name}</span>
                                  <span className={`font-mono ${getChangeColor(s.change)}`}>
                                    {s.change > 0 ? "+" : ""}{s.change.toFixed(1)}%
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                          {thread.tags && thread.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {thread.tags.map((tag) => (
                                <span key={tag} className="px-1.5 py-0.5 bg-gray-800/50 rounded text-[10px] text-gray-500">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 과거 브리핑 */}
      {pastBriefings.length > 0 && (
        <div className="mt-3 border-t border-gray-800/50 pt-3">
          <button
            onClick={() => setShowPast(!showPast)}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-emerald-400 transition-colors w-full"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>이전 브리핑 {pastBriefings.length}건</span>
            {showPast ? <ChevronUp className="w-3.5 h-3.5 ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 ml-auto" />}
          </button>

          {showPast && (
            <div className="mt-2 space-y-3">
              {pastBriefings.map((b: Briefing) => (
                <div key={b.timestamp} className="border border-gray-800/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-3 h-3 text-gray-600" />
                    <span className="text-[11px] text-gray-500">
                      {formatDateLabel(b.date)} {formatTime(b.timestamp)}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {(b.threads || []).map((thread: BriefingThread) => {
                      const key = `${b.timestamp}-${thread.id}`;
                      const isOpen = expanded.has(key);
                      return (
                        <div
                          key={key}
                          className="cursor-pointer"
                          onClick={() => toggle(key)}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${thread.labelColor || "text-gray-400 bg-gray-500/10"}`}>
                              {thread.label}
                            </span>
                            <span className="text-[12px] text-gray-300 truncate flex-1">{thread.title}</span>
                          </div>
                          {isOpen && (
                            <div className="mt-1.5 ml-2 pl-2 border-l border-gray-800/50">
                              <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">{thread.content}</p>
                              {thread.detail && <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">{thread.detail}</p>}
                              {thread.stocks && thread.stocks.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {thread.stocks.map((s) => (
                                    <button
                                      key={s.code}
                                      onClick={(e) => { e.stopPropagation(); router.push(`/stock/${s.code}`); }}
                                      className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-800/60 hover:bg-gray-700/60 rounded text-[10px] font-medium transition-colors"
                                    >
                                      <span className="text-gray-300">{s.name}</span>
                                      <span className={`font-mono ${getChangeColor(s.change)}`}>
                                        {s.change > 0 ? "+" : ""}{s.change.toFixed(1)}%
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
