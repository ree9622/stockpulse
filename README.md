# StockPulse 📈

한국 주식 실시간 정보 & 커뮤니티 플랫폼

## 🌐 Live

- **Frontend**: https://ree9622.github.io/stockpulse/
- **API Server**: http://3.38.241.182

## ✨ Features

- ✅ **대시보드** — 시장 지수 (KOSPI/KOSDAQ), 실시간 티커, 인기 종목
- ✅ **히트맵** — 100종목 시가총액 기반 섹터별 히트맵
- ✅ **종목 상세** — 가격 차트 (Recharts), 재무 정보, 관련 뉴스
- ✅ **종목 검색** — 자동완성 검색 (100종목)
- ✅ **뉴스 피드** — 실시간 시장 뉴스
- ✅ **실시간 채팅** — Socket.io 기반 트래쉬토크
- ✅ **종목 스크리너** — PER/PBR/시가총액/등락률/거래량/섹터 필터 + 정렬
- ✅ **섹터별 분석** — 섹터 카드, 평균 등락률 차트, 종목 리스트
- ✅ **가격 알림** — DynamoDB 기반 목표가 알림 설정/관리
- ✅ **PWA** — 홈 화면 추가, 오프라인 대응
- ✅ **다크/라이트 테마** — 토글 버튼, localStorage 저장
- ✅ **소셜 로그인** — Kakao, Naver OAuth + 게스트 닉네임 로그인

## 🏗️ Architecture

```
                    ┌─────────────────────┐
                    │      사용자 (브라우저)     │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                                  ▼
   ┌─────────────────┐              ┌──────────────────┐
   │  GitHub Pages   │              │  EC2 t3.micro    │
   │  (정적 프론트)    │   API/WS    │  (API + Socket)  │
   │  Next.js Static │ ──────────▶ │  nginx → :3000   │
   └─────────────────┘              └────────┬─────────┘
                                             │
                              ┌──────────────┼──────────────┐
                              ▼              ▼              ▼
                       ┌───────────┐  ┌───────────┐  ┌───────────┐
                       │ DynamoDB  │  │ Secrets   │  │ Yahoo     │
                       │ (5 tables)│  │ Manager   │  │ Finance   │
                       └───────────┘  └───────────┘  └───────────┘
```

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Charts | Recharts |
| Backend | Next.js API Routes, Socket.io |
| Database | AWS DynamoDB (5 tables, PAY_PER_REQUEST) |
| Auth | NextAuth v5 (Kakao, Naver, Guest) |
| Data | Yahoo Finance API |
| Infra | AWS EC2, DynamoDB, Secrets Manager, GitHub Pages |
| CI/CD | GitHub Actions |

## 🗄️ AWS Infrastructure

### DynamoDB Tables (ap-northeast-2)

| Table | PK | SK | Purpose |
|-------|----|----|---------|
| stockpulse-chat | room (S) | timestamp (N) | 채팅 메시지 |
| stockpulse-news | source (S) | timestamp (N) | 뉴스 피드 |
| stockpulse-stocks | code (S) | date (S) | 종목 데이터 |
| stockpulse-users | userId (S) | — | 유저 정보 |
| stockpulse-alerts | userId (S) | stockCode#createdAt (S) | 가격 알림 |

### EC2 Instance

| 항목 | 값 |
|------|---|
| Instance ID | i-0a12c64061b063b45 |
| Type | t3.micro (Free Tier) |
| Region | ap-northeast-2 (Seoul) |
| OS | Amazon Linux 2023 (x86_64) |
| Elastic IP | 3.38.241.182 |
| Security Group | stockpulse-sg |
| Reverse Proxy | nginx → localhost:3000 |

### Secrets Manager

- **Secret**: `stockpulse/config`
- **Contains**: NEXTAUTH_SECRET, KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET, NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, AWS_REGION

### 월 예상 비용

| 리소스 | 프리티어 | 프리티어 이후 |
|--------|---------|-------------|
| EC2 t3.micro | $0 (12개월) | ~$8.50 |
| DynamoDB (PAY_PER_REQUEST) | $0 | ~$0.25 |
| Secrets Manager (1 secret) | $0.40 | $0.40 |
| Elastic IP (인스턴스 연결) | $0 | $0 |
| **합계** | **~$0.40/월** | **~$9.15/월** |

## 🚀 Getting Started

### Local Development

```bash
# 1. Clone
git clone https://github.com/ree9622/stockpulse.git
cd stockpulse

# 2. Install
pnpm install

# 3. Environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Run
pnpm dev          # Next.js only (port 3000)
pnpm dev:server   # Socket.io + Next.js (port 3000)
```

### EC2 Deployment

```bash
# Initial setup (SSH into EC2 first)
ssh -i ~/.ssh/stockpulse-key.pem ec2-user@3.38.241.182
bash scripts/ec2-setup.sh

# Subsequent deploys (from local)
./scripts/deploy-ec2.sh
```

## 📁 Project Structure

```
stockpulse/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── alerts/route.ts        # 가격 알림 CRUD
│   │   │   ├── chat/route.ts          # 채팅 API
│   │   │   ├── news/route.ts          # 뉴스 API
│   │   │   └── stocks/route.ts        # 주식 데이터 API
│   │   ├── login/page.tsx             # 로그인 페이지
│   │   ├── screener/page.tsx          # 종목 스크리너
│   │   ├── sectors/page.tsx           # 섹터별 분석
│   │   ├── stock/[code]/page.tsx      # 종목 상세
│   │   ├── layout.tsx                 # 루트 레이아웃 (PWA)
│   │   └── page.tsx                   # 대시보드 (메인)
│   ├── components/
│   │   ├── chat/ChatPanel.tsx         # 실시간 채팅
│   │   ├── layout/
│   │   │   ├── AuthButton.tsx         # 로그인/아웃 버튼
│   │   │   ├── Header.tsx             # 헤더 + 네비게이션
│   │   │   ├── SessionProvider.tsx    # NextAuth 세션
│   │   │   └── ThemeToggle.tsx        # 다크/라이트 토글
│   │   └── market/
│   │       ├── AlertModal.tsx         # 가격 알림 모달
│   │       ├── Heatmap.tsx            # 시가총액 히트맵
│   │       ├── MarketOverview.tsx     # 시장 지수
│   │       ├── MarketTicker.tsx       # 실시간 티커
│   │       ├── NewsFeed.tsx           # 뉴스 피드
│   │       └── TrendingStocks.tsx     # 인기 종목
│   ├── hooks/useTheme.ts             # 테마 관리 훅
│   ├── lib/
│   │   ├── auth.ts                    # NextAuth 설정
│   │   ├── dynamodb.ts                # DynamoDB 클라이언트
│   │   ├── secrets.ts                 # AWS Secrets Manager 유틸
│   │   ├── stock-api.ts               # Yahoo Finance API 래퍼
│   │   ├── stock-list.ts              # 100종목 데이터
│   │   └── utils.ts                   # 유틸 함수
│   ├── types/index.ts                 # TypeScript 타입 정의
│   └── server.ts                      # Socket.io 서버 (진입점)
├── scripts/
│   ├── ec2-setup.sh                   # EC2 초기 설정 스크립트
│   ├── deploy-ec2.sh                  # EC2 배포 스크립트
│   ├── deploy.sh                      # GitHub Pages 배포
│   └── build-static.sh                # 정적 빌드
├── public/                            # 정적 파일 (PWA manifest, icons)
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|------------|----------|
| `NEXTAUTH_SECRET` | NextAuth 암호화 키 | ✅ |
| `NEXTAUTH_URL` | NextAuth 콜백 URL | ✅ |
| `KAKAO_CLIENT_ID` | Kakao OAuth 앱 키 | OAuth 사용시 |
| `KAKAO_CLIENT_SECRET` | Kakao OAuth 시크릿 | OAuth 사용시 |
| `NAVER_CLIENT_ID` | Naver OAuth 클라이언트 ID | OAuth 사용시 |
| `NAVER_CLIENT_SECRET` | Naver OAuth 시크릿 | OAuth 사용시 |
| `AWS_REGION` | AWS 리전 | ✅ (ap-northeast-2) |
| `AWS_ACCESS_KEY_ID` | AWS 액세스 키 (로컬 개발) | 로컬 |
| `AWS_SECRET_ACCESS_KEY` | AWS 시크릿 키 (로컬 개발) | 로컬 |

> EC2에서는 IAM Role 또는 AWS Secrets Manager로 자동 주입됩니다.

## 📋 Roadmap

- [ ] SSL/HTTPS (Let's Encrypt + certbot)
- [ ] GitHub Actions CD → EC2 자동 배포
- [ ] 실시간 WebSocket 주가 스트리밍
- [ ] 포트폴리오 관리 기능
- [ ] 종목 비교 차트
- [ ] 커뮤니티 게시판
- [ ] 모바일 앱 (React Native)
- [ ] 관심 종목 저장 (DynamoDB)

## 📄 License

MIT
