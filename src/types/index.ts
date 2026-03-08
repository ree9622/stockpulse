// ━━━ 타입 정의 ━━━

export interface Stock {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  status: "up" | "down" | "flat";
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: Date;
  tags: string[];
  views: number;
  sentiment: "positive" | "negative" | "neutral";
  url?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  nickname: string;
  content: string;
  timestamp: Date;
  room: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  icon: string;
  userCount: number;
  description: string;
}

export interface HeatmapItem {
  code: string;
  name: string;
  sector: string;
  changePercent: number;
  marketCap: number;
}
