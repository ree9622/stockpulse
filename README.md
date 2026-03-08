# StockPulse 📈

한국 주식 실시간 정보 & 트래쉬토크 커뮤니티 플랫폼

## Features

- 🏠 **대시보드** — 실시간 시장 지수 (KOSPI, KOSDAQ, S&P500, WTI, 환율 등)
- 📊 **히트맵** — KOSPI 시가총액 기반 히트맵 (Finviz 스타일)
- 🔥 **인기 종목** — 실시간 등락률, 거래량, 시가총액
- 📰 **뉴스피드** — 실시간 뉴스 + 감성 분석 (🟢🔴🟡)
- 💬 **트래쉬토크 채팅** — 하단 팝업 실시간 채팅 (5개 채팅방)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Charts**: Recharts
- **Realtime**: Socket.io
- **Package Manager**: pnpm

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── page.tsx          # 메인 대시보드
│   └── globals.css       # 글로벌 스타일
├── components/
│   ├── chat/             # 채팅 컴포넌트
│   │   └── ChatPanel.tsx # 하단 팝업 채팅
│   ├── layout/           # 레이아웃
│   │   └── Header.tsx    # 상단 헤더
│   └── market/           # 시장 데이터
│       ├── Heatmap.tsx
│       ├── MarketOverview.tsx
│       ├── MarketTicker.tsx
│       ├── NewsFeed.tsx
│       └── TrendingStocks.tsx
├── lib/
│   ├── mock-data.ts      # 모의 데이터
│   └── utils.ts          # 유틸리티
├── hooks/                # 커스텀 훅
└── types/
    └── index.ts          # 타입 정의
```

## Roadmap

- [ ] 실시간 주가 API 연동 (KRX, Yahoo Finance)
- [ ] Socket.io 채팅 서버 구현
- [ ] 사용자 인증 (카카오/네이버 로그인)
- [ ] 종목 상세 페이지 + 차트
- [ ] 스크리너 (필터링/정렬)
- [ ] 섹터별 분석 페이지
- [ ] 알림 시스템
- [ ] PWA 지원
