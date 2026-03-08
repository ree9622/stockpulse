import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "조";
  if (num >= 100_000_000) return (num / 100_000_000).toFixed(1) + "억";
  if (num >= 10_000) return (num / 10_000).toFixed(0) + "만";
  return num.toLocaleString();
}

export function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR");
}

export function formatPercent(percent: number): string {
  const sign = percent >= 0 ? "+" : "";
  return `${sign}${percent.toFixed(2)}%`;
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "방금 전";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

export function getChangeColor(change: number): string {
  if (change > 0) return "text-red-500";
  if (change < 0) return "text-blue-500";
  return "text-gray-400";
}

export function getChangeBg(change: number): string {
  if (change > 0) return "bg-red-500/20 border-red-500/30";
  if (change < 0) return "bg-blue-500/20 border-blue-500/30";
  return "bg-gray-500/20 border-gray-500/30";
}

export function getHeatmapColor(changePercent: number): string {
  if (changePercent > 15) return "bg-red-600";
  if (changePercent > 10) return "bg-red-500";
  if (changePercent > 5) return "bg-red-400";
  if (changePercent > 2) return "bg-red-400/70";
  if (changePercent > 0) return "bg-red-400/40";
  if (changePercent === 0) return "bg-gray-600";
  if (changePercent > -2) return "bg-blue-400/40";
  if (changePercent > -5) return "bg-blue-400/70";
  if (changePercent > -10) return "bg-blue-500";
  if (changePercent > -15) return "bg-blue-600";
  return "bg-blue-700";
}

export function getSentimentEmoji(sentiment: string): string {
  switch (sentiment) {
    case "positive": return "🟢";
    case "negative": return "🔴";
    default: return "🟡";
  }
}
