# 📈 StockPulse - 한국 주식 실시간 정보

한국 주식 시장의 실시간 정보, 히트맵, 뉴스, 종목 스크리너를 제공하는 웹 애플리케이션입니다.

![StockPulse](https://via.placeholder.com/800x400/0a0a0f/10b981?text=StockPulse)

## ✅ 구현된 기능

- [x] **대시보드** - 시장 지수, 실시간 티커, 인기 종목
- [x] **히트맵** - 100종목 시가총액 기반 히트맵
- [x] **종목 상세** - 가격 차트, 재무 정보, 뉴스
- [x] **종목 검색** - 자동완성 검색 (100종목)
- [x] **뉴스 피드** - 실시간 시장 뉴스
- [x] **실시간 채팅** - Socket.io 기반 트래쉬토크
- [x] **종목 스크리너** - PER/PBR/시가총액/등락률/거래량/섹터 필터, 정렬
- [x] **섹터별 분석** - 섹터 카드, 평균 등락률 차트, 종목 리스트
- [x] **가격 알림 시스템** - DynamoDB 기반 목표가 알림 설정
- [x] **PWA 지원** - 홈 화면 추가, 오프라인 대응
- [x] **다크/라이트 테마** - 토글 버튼, localStorage 저장
- [x] **네비게이션** - 실제 라우팅 + 스크롤 네비게이션
- [x] **소셜 로그인** - Google/GitHub OAuth (NextAuth)

## 🛠 기술 스택

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Charts**: Recharts
- **Backend**: Next.js API Routes, Socket.io
- **Database**: AWS DynamoDB (PAY_PER_REQUEST)
- **Auth**: NextAuth.js v5
- **Icons**: Lucide React

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   ├── alerts/route.ts      # 가격 알림 CRUD API
│   │   ├── auth/[...nextauth]/  # NextAuth
│   │   ├── chat/route.ts        # 채팅 API
│   │   ├── news/route.ts        # 뉴스 API
│   │   └── stocks/route.ts      # 주식 데이터 API
│   ├── login/page.tsx           # 로그인 페이지
│   ├── screener/page.tsx        # 종목 스크리너
│   ├── sectors/page.tsx         # 섹터별 분석
│   ├── stock/[code]/page.tsx    # 종목 상세
│   ├── globals.css              # 글로벌 스타일 (다크/라이트)
│   ├── layout.tsx               # 루트 레이아웃 (PWA)
│   └── page.tsx                 # 대시보드
├── components/
│   ├── chat/ChatPanel.tsx       # 실시간 채팅
│   ├── layout/
│   │   ├── AuthButton.tsx       # 로그인 버튼
│   │   ├── Header.tsx           # 헤더 + 네비게이션
│   │   ├── SessionProvider.tsx  # NextAuth 세션
│   │   └── ThemeToggle.tsx      # 다크/라이트 토글
│   └── market/
│       ├── AlertModal.tsx       # 가격 알림 모달
│       ├── Heatmap.tsx          # 히트맵
│       ├── MarketOverview.tsx   # 시장 지수
│       ├── MarketTicker.tsx     # 실시간 티커
│       ├── NewsFeed.tsx         # 뉴스 피드
│       └── TrendingStocks.tsx   # 인기 종목
├── hooks/
│   └── useTheme.ts              # 테마 관리 훅
├── lib/
│   ├── auth.ts                  # NextAuth 설정
│   ├── dynamodb.ts              # DynamoDB 클라이언트
│   ├── mock-data.ts             # 목업 데이터
│   ├── stock-api.ts             # 주식 API 유틸
│   ├── stock-list.ts            # 100종목 데이터 (재무 포함)
│   └── utils.ts                 # 유틸 함수
├── types/index.ts               # TypeScript 타입
└── server.ts                    # Socket.io 서버
```

## 🚀 설치 & 실행

### 사전 요구사항

- Node.js 20+
- pnpm
- AWS CLI (DynamoDB 접근용)

### 설치

```bash
git clone <repo-url>
cd stockpulse
pnpm install
```

### 환경변수

`.env.local` 파일 생성:

```env
# AWS (DynamoDB)
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000/stockpulse
NEXTAUTH_SECRET=your-secret

# OAuth (선택)
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret
```

### 개발 서버

```bash
pnpm dev          # Next.js만 (포트 3000)
pnpm dev:server   # Socket.io 포함 서버
```

### 빌드 & 배포

```bash
pnpm build
pnpm start
```

## 📊 DynamoDB 테이블

| 테이블 | PK | SK | 용도 |
|--------|----|----|------|
| stockpulse-chat | room | timestamp | 채팅 메시지 |
| stockpulse-news | source | timestamp | 뉴스 |
| stockpulse-stocks | code | date | 주가 데이터 |
| stockpulse-users | userId | - | 사용자 |
| stockpulse-alerts | userId | createdAt | 가격 알림 |

모든 테이블은 `PAY_PER_REQUEST` 빌링 모드 (AWS 프리티어 내).

## ⚠️ 비용 최소화

- DynamoDB: PAY_PER_REQUEST (무료 25 RCU/WCU 내)
- Lambda: 사용하지 않음
- CloudFront: 프리티어 내
- basePath: `/stockpulse`

## 📱 PWA

- 홈 화면 추가 지원
- 테마 컬러: `#0a0a0f`
- 아이콘: SVG 기반

## 📄 License

MIT
