"use client";

import { useEffect, useState } from "react";
import { newsItems as mockNews } from "@/lib/mock-data";
import { timeAgo, getSentimentEmoji } from "@/lib/utils";
import { Eye, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import type { NewsItem } from "@/types";

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>(
    mockNews.map((n) => ({ ...n, id: n.id || String(Date.now()) }))
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("전체");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/stockpulse/api/news?limit=30");
        if (res.ok) {
          const data = await res.json();
          if (data.news && data.news.length > 0) {
            const items: NewsItem[] = data.news.map(
              (n: Record<string, unknown>, i: number) => ({
                id: String(n.timestamp || i),
                title: n.title as string,
                source: n.source as string,
                timestamp: new Date(n.timestamp as number),
                tags: (n.tags as string[]) || [],
                views: (n.views as number) || 0,
                sentiment:
                  (n.sentiment as "positive" | "negative" | "neutral") || "neutral",
                url: n.url as string | undefined,
                content: n.content as string | undefined,
                analysis: n.analysis as string | undefined,
                sourceUrl: n.sourceUrl as string | undefined,
              })
            );
            setNews(items);
          }
        }
      } catch {
        // fallback to mock
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 30_000);
    return () => clearInterval(interval);
  }, []);

  const filteredNews =
    activeTab === "전체"
      ? news
      : news.filter((n) =>
          n.tags.includes(activeTab === "속보" ? "속보" : "분석")
        );

  return (
    <div className="bg-[#12121a] rounded-xl border border-gray-800/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-200">📰 실시간 뉴스</h2>
        <div className="flex gap-1">
          {["전체", "속보", "분석"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                tab === activeTab
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1 max-h-[600px] overflow-y-auto">
        {filteredNews.map((item) => {
          const isExpanded = expandedId === item.id;
          const hasDetail = item.content || item.analysis || item.sourceUrl;

          return (
            <div key={item.id} className="rounded-lg transition-colors">
              {/* 헤드라인 */}
              <div
                onClick={() =>
                  hasDetail && setExpandedId(isExpanded ? null : item.id)
                }
                className={`p-2.5 rounded-lg cursor-pointer transition-colors group ${
                  isExpanded ? "bg-gray-800/50" : "hover:bg-gray-800/30"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-sm mt-0.5 shrink-0">
                    {getSentimentEmoji(item.sentiment)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 leading-snug group-hover:text-emerald-300 transition-colors line-clamp-2">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 flex-wrap">
                      <span>{item.source}</span>
                      <span>
                        {timeAgo(
                          item.timestamp instanceof Date
                            ? item.timestamp
                            : new Date(item.timestamp)
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item.views}
                      </span>
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 bg-gray-800 rounded text-[10px] text-gray-400"
                        >
                          #{tag}
                        </span>
                      ))}
                      {hasDetail &&
                        (isExpanded ? (
                          <ChevronUp className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <ChevronDown className="w-3 h-3 text-gray-600" />
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 상세 패널 */}
              {isExpanded && hasDetail && (
                <div className="mx-2.5 mb-2 p-3 bg-gray-900/80 rounded-lg border border-gray-700/50 space-y-2.5">
                  {item.content && (
                    <div>
                      <div className="text-[10px] font-semibold text-gray-500 uppercase mb-1">
                        📄 기사 내용
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                        {item.content}
                      </p>
                    </div>
                  )}

                  {item.analysis && (
                    <div>
                      <div className="text-[10px] font-semibold text-emerald-500 uppercase mb-1">
                        🤖 AI 분석
                      </div>
                      <p className="text-xs text-emerald-300/80 leading-relaxed whitespace-pre-line">
                        {item.analysis}
                      </p>
                    </div>
                  )}

                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      원문 보기
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
