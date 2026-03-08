import type { Stock, MarketIndex, NewsItem, ChatMessage, ChatRoom, HeatmapItem } from "@/types";

// ━━━ 시장 지수 ━━━
export const marketIndices: MarketIndex[] = [
  { name: "KOSPI", value: 2687.44, change: -32.15, changePercent: -1.18, status: "down" },
  { name: "KOSDAQ", value: 861.23, change: 5.67, changePercent: 0.66, status: "up" },
  { name: "S&P 500", value: 5892.12, change: -45.33, changePercent: -0.76, status: "down" },
  { name: "NASDAQ", value: 18562.78, change: -189.45, changePercent: -1.01, status: "down" },
  { name: "USD/KRW", value: 1486.50, change: 12.30, changePercent: 0.84, status: "up" },
  { name: "WTI", value: 90.90, change: 9.89, changePercent: 12.21, status: "up" },
  { name: "Gold", value: 5171.83, change: -107.38, changePercent: -2.03, status: "down" },
  { name: "BTC/USD", value: 67925.0, change: -2325.0, changePercent: -3.31, status: "down" },
];

// ━━━ 인기 종목 ━━━
export const trendingStocks: Stock[] = [
  { code: "005930", name: "삼성전자", price: 78200, change: -4800, changePercent: -5.78, volume: 45123456, marketCap: 466800000, sector: "반도체" },
  { code: "000660", name: "SK하이닉스", price: 178500, change: -15200, changePercent: -7.84, volume: 12345678, marketCap: 129800000, sector: "반도체" },
  { code: "012450", name: "한화에어로스페이스", price: 485000, change: 89000, changePercent: 22.47, volume: 8901234, marketCap: 48500000, sector: "방산" },
  { code: "010950", name: "S-Oil", price: 78900, change: 12100, changePercent: 18.12, volume: 5678901, marketCap: 8890000, sector: "에너지" },
  { code: "003490", name: "대한항공", price: 24350, change: -3650, changePercent: -13.04, volume: 9876543, marketCap: 9120000, sector: "항공" },
  { code: "042700", name: "한미반도체", price: 112300, change: -8900, changePercent: -7.34, volume: 3456789, marketCap: 11200000, sector: "반도체" },
  { code: "006800", name: "미래에셋증권", price: 8950, change: -420, changePercent: -4.48, volume: 2345678, marketCap: 5430000, sector: "금융" },
  { code: "009540", name: "HD한국조선해양", price: 218000, change: 28000, changePercent: 14.74, volume: 4567890, marketCap: 15400000, sector: "조선" },
  { code: "047810", name: "한국항공우주", price: 72400, change: 9800, changePercent: 15.65, volume: 6789012, marketCap: 14800000, sector: "방산" },
  { code: "096770", name: "SK이노베이션", price: 125600, change: 15400, changePercent: 13.97, volume: 3214567, marketCap: 11800000, sector: "에너지" },
];

// ━━━ 히트맵 데이터 ━━━
export const heatmapData: HeatmapItem[] = [
  { code: "005930", name: "삼성전자", sector: "반도체", changePercent: -5.78, marketCap: 466800000 },
  { code: "000660", name: "SK하이닉스", sector: "반도체", changePercent: -7.84, marketCap: 129800000 },
  { code: "005380", name: "현대차", sector: "자동차", changePercent: -3.21, marketCap: 52300000 },
  { code: "012450", name: "한화에어로", sector: "방산", changePercent: 22.47, marketCap: 48500000 },
  { code: "035420", name: "NAVER", sector: "IT", changePercent: -2.15, marketCap: 42100000 },
  { code: "051910", name: "LG화학", sector: "화학", changePercent: -4.56, marketCap: 35200000 },
  { code: "006400", name: "삼성SDI", sector: "2차전지", changePercent: -3.89, marketCap: 31500000 },
  { code: "035720", name: "카카오", sector: "IT", changePercent: -1.23, marketCap: 28900000 },
  { code: "105560", name: "KB금융", sector: "금융", changePercent: -2.87, marketCap: 27800000 },
  { code: "055550", name: "신한지주", sector: "금융", changePercent: -2.34, marketCap: 24500000 },
  { code: "010950", name: "S-Oil", sector: "에너지", changePercent: 18.12, marketCap: 8890000 },
  { code: "096770", name: "SK이노", sector: "에너지", changePercent: 13.97, marketCap: 11800000 },
  { code: "009540", name: "HD한국조선", sector: "조선", changePercent: 14.74, marketCap: 15400000 },
  { code: "047810", name: "한국항공우주", sector: "방산", changePercent: 15.65, marketCap: 14800000 },
  { code: "003490", name: "대한항공", sector: "항공", changePercent: -13.04, marketCap: 9120000 },
  { code: "028260", name: "삼성물산", sector: "건설", changePercent: -1.45, marketCap: 21300000 },
  { code: "207940", name: "삼성바이오", sector: "바이오", changePercent: 0.89, marketCap: 53200000 },
  { code: "068270", name: "셀트리온", sector: "바이오", changePercent: 1.23, marketCap: 32100000 },
  { code: "010130", name: "고려아연", sector: "비철금속", changePercent: 5.67, marketCap: 12300000 },
  { code: "032830", name: "삼성생명", sector: "보험", changePercent: -1.78, marketCap: 18900000 },
];

// ━━━ 뉴스 ━━━
export const newsItems: NewsItem[] = [
  {
    id: "1", title: "테헤란 정유공장 피격 후 화재 발생 - 국영 TV",
    source: "로이터", timestamp: new Date(Date.now() - 34 * 60000),
    tags: ["속보", "헤드라인"], views: 175, sentiment: "negative",
  },
  {
    id: "2", title: "사우디, 이란에 에너지 부문 추가 공격 시 '맞대응' 경고",
    source: "파이낸셜주스", timestamp: new Date(Date.now() - 9 * 60000),
    tags: ["속보", "헤드라인"], views: 103, sentiment: "negative",
  },
  {
    id: "3", title: "이란 랄리지아니, 미군 포로 다수 확보 주장",
    source: "파이낸셜주스", timestamp: new Date(Date.now() - 14 * 60000),
    tags: ["속보", "헤드라인"], views: 154, sentiment: "negative",
  },
  {
    id: "4", title: "OpenAI 로보틱스 책임자, 국방부와 계약 후 사임",
    source: "로이터", timestamp: new Date(Date.now() - 27 * 60000),
    tags: ["헤드라인"], views: 177, sentiment: "neutral",
  },
  {
    id: "5", title: "미군 기지 드론 공격, 에르빌 공항 인근서 발생",
    source: "로이터", timestamp: new Date(Date.now() - 39 * 60000),
    tags: ["속보", "헤드라인"], views: 189, sentiment: "negative",
  },
  {
    id: "6", title: "바그다드 미 대사관에 카추사 로켓 공격",
    source: "로이터", timestamp: new Date(Date.now() - 19 * 60000),
    tags: ["속보"], views: 92, sentiment: "negative",
  },
  {
    id: "7", title: "카타르 에미르-트럼프, 이란 공격 등 현안 논의",
    source: "로이터·FJ", timestamp: new Date(Date.now() - 2 * 60000),
    tags: ["속보", "헤드라인"], views: 14, sentiment: "neutral",
  },
  {
    id: "8", title: "테헤란 정유공장 완전 가동, 피해 없어 - ISNA",
    source: "파이낸셜주스", timestamp: new Date(Date.now() - 14 * 60000),
    tags: ["속보"], views: 99, sentiment: "positive",
  },
];

// ━━━ 채팅방 ━━━
export const chatRooms: ChatRoom[] = [
  { id: "general", name: "자유토론", icon: "💬", userCount: 342, description: "자유롭게 토론하세요" },
  { id: "kospi", name: "코스피", icon: "📈", userCount: 189, description: "코스피 종목 토론" },
  { id: "kosdaq", name: "코스닥", icon: "📊", userCount: 156, description: "코스닥 종목 토론" },
  { id: "crypto", name: "코인", icon: "₿", userCount: 234, description: "암호화폐 토론" },
  { id: "trashtalk", name: "트래쉬토크", icon: "🔥", userCount: 567, description: "마음껏 떠들어" },
];

// ━━━ 채팅 메시지 ━━━
export const mockMessages: ChatMessage[] = [
  { id: "1", userId: "u1", nickname: "불타는곰", content: "WTI 90달러 ㅋㅋㅋ 에너지주 안 산 사람 손들어", timestamp: new Date(Date.now() - 5 * 60000), room: "trashtalk" },
  { id: "2", userId: "u2", nickname: "삼전만년", content: "삼전 8만원도 못 지키네... 7만전자 가나", timestamp: new Date(Date.now() - 4 * 60000), room: "trashtalk" },
  { id: "3", userId: "u3", nickname: "방산드림", content: "한화에어로 +22% 레전드 ㄷㄷ 아직도 안 늦음", timestamp: new Date(Date.now() - 3 * 60000), room: "trashtalk" },
  { id: "4", userId: "u4", nickname: "개미투자자", content: "내일 코스피 갭다운 각인데 지금 현금비중 높여야 하나?", timestamp: new Date(Date.now() - 2 * 60000), room: "trashtalk" },
  { id: "5", userId: "u5", nickname: "차트쟁이", content: "코스피 5500 지지선 깨지면 5000까지 열리는데...", timestamp: new Date(Date.now() - 1 * 60000), room: "trashtalk" },
  { id: "6", userId: "u1", nickname: "불타는곰", content: "대한항공 -13%면 물타기 해볼만?? 전쟁 끝나면 반등 올 텐데", timestamp: new Date(Date.now() - 30000), room: "trashtalk" },
  { id: "7", userId: "u6", nickname: "워렌이형", content: "전쟁 때 주식 사라고 했지? 난 에너지주로 갈아타는 중", timestamp: new Date(Date.now() - 15000), room: "trashtalk" },
];
