"use client";

import { useState } from "react";
import { X, Bell, TrendingUp, TrendingDown } from "lucide-react";

interface AlertModalProps {
  stockCode: string;
  stockName: string;
  currentPrice?: number;
  onClose: () => void;
  onSubmit: (data: { targetPrice: number; direction: "above" | "below" }) => void;
}

export default function AlertModal({
  stockCode,
  stockName,
  currentPrice,
  onClose,
  onSubmit,
}: AlertModalProps) {
  const [targetPrice, setTargetPrice] = useState(currentPrice?.toString() || "");
  const [direction, setDirection] = useState<"above" | "below">("above");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) return;
    onSubmit({ targetPrice: price, direction });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#12121a] dark:bg-[#12121a] border border-gray-800/50 dark:border-gray-800/50 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-gray-200 dark:text-gray-200">가격 알림 설정</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 text-sm text-gray-400 dark:text-gray-400">
          <span className="text-gray-200 dark:text-gray-200 font-medium">{stockName}</span>
          <span className="text-gray-500 dark:text-gray-500 ml-2 font-mono">{stockCode}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Direction */}
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-500 mb-2 block">알림 조건</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDirection("above")}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                  direction === "above"
                    ? "bg-red-500/15 border-red-500/30 text-red-400"
                    : "bg-gray-800/50 border-gray-700/50 text-gray-400 hover:text-gray-200"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                이상 (상승)
              </button>
              <button
                type="button"
                onClick={() => setDirection("below")}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                  direction === "below"
                    ? "bg-blue-500/15 border-blue-500/30 text-blue-400"
                    : "bg-gray-800/50 border-gray-700/50 text-gray-400 hover:text-gray-200"
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                이하 (하락)
              </button>
            </div>
          </div>

          {/* Target Price */}
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-500 mb-1 block">목표가 (원)</label>
            <input
              type="number"
              placeholder="목표 가격을 입력하세요"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="w-full bg-gray-800/50 dark:bg-gray-800/50 border border-gray-700/50 dark:border-gray-700/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 dark:text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 font-mono"
              min="0"
              step="1"
              required
            />
          </div>

          {currentPrice && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              현재가: <span className="font-mono text-gray-300 dark:text-gray-300">{currentPrice.toLocaleString()}원</span>
            </p>
          )}

          {/* Submit */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-800/50 dark:bg-gray-800/50 border border-gray-700/50 dark:border-gray-700/50 rounded-lg text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-sm text-emerald-400 font-medium hover:bg-emerald-500/30 transition-colors"
            >
              알림 설정
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
