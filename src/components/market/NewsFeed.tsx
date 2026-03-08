"use client";

import { newsItems } from "@/lib/mock-data";
import { timeAgo, getSentimentEmoji } from "@/lib/utils";
import { Eye } from "lucide-react";

export default function NewsFeed() {
  return (
    <div className="bg-[#12121a] rounded-xl border border-gray-800/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-200">📰 실시간 뉴스</h2>
        <div className="flex gap-1">
          {["전체", "속보", "분석"].map((tab) => (
            <button
              key={tab}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                tab === "전체"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        {newsItems.map((news) => (
          <div
            key={news.id}
            className="p-2.5 rounded-lg hover:bg-gray-800/30 cursor-pointer transition-colors group"
          >
            <div className="flex items-start gap-2">
              <span className="text-sm mt-0.5 shrink-0">{getSentimentEmoji(news.sentiment)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 leading-snug group-hover:text-emerald-300 transition-colors line-clamp-2">
                  {news.title}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                  <span>{news.source}</span>
                  <span>{timeAgo(news.timestamp)}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {news.views}
                  </span>
                  {news.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 bg-gray-800 rounded text-[10px] text-gray-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
