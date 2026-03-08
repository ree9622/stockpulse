/** 한국 주요 100종목 코드 + 이름 + 재무데이터 */
export interface StockListItem {
  code: string;
  name: string;
  per: number;
  pbr: number;
  marketCap: number; // 억 단위
  volume: number;
  sector: string;
  changePercent: number;
}

export type Sector =
  | "반도체"
  | "방산"
  | "에너지"
  | "자동차"
  | "금융"
  | "바이오"
  | "IT"
  | "항공"
  | "조선"
  | "화학"
  | "2차전지"
  | "엔터"
  | "게임"
  | "유통"
  | "통신"
  | "소비재"
  | "건설"
  | "철강"
  | "식품"
  | "보험"
  | "지주"
  | "ETF";

export const SECTORS: Sector[] = [
  "반도체", "방산", "에너지", "자동차", "금융", "바이오",
  "IT", "항공", "조선", "화학", "2차전지", "엔터", "게임",
  "유통", "통신", "소비재", "건설", "철강", "식품", "보험", "지주",
];

export const STOCK_LIST: StockListItem[] = [
  { code: "005930", name: "삼성전자", per: 12.5, pbr: 1.2, marketCap: 3500000, volume: 12500000, sector: "반도체", changePercent: 1.25 },
  { code: "000660", name: "SK하이닉스", per: 8.3, pbr: 1.8, marketCap: 1200000, volume: 3200000, sector: "반도체", changePercent: 2.15 },
  { code: "207940", name: "삼성바이오로직스", per: 65.2, pbr: 8.5, marketCap: 550000, volume: 85000, sector: "바이오", changePercent: -0.85 },
  { code: "005380", name: "현대차", per: 5.8, pbr: 0.6, marketCap: 480000, volume: 1500000, sector: "자동차", changePercent: 0.95 },
  { code: "000270", name: "기아", per: 5.2, pbr: 0.8, marketCap: 380000, volume: 2100000, sector: "자동차", changePercent: 1.45 },
  { code: "006400", name: "삼성SDI", per: 18.5, pbr: 1.5, marketCap: 350000, volume: 450000, sector: "2차전지", changePercent: -1.20 },
  { code: "051910", name: "LG화학", per: 25.3, pbr: 1.1, marketCap: 320000, volume: 280000, sector: "화학", changePercent: -0.55 },
  { code: "035420", name: "NAVER", per: 22.1, pbr: 1.6, marketCap: 310000, volume: 950000, sector: "IT", changePercent: 0.80 },
  { code: "035720", name: "카카오", per: 45.2, pbr: 2.1, marketCap: 200000, volume: 3500000, sector: "IT", changePercent: -2.10 },
  { code: "068270", name: "셀트리온", per: 32.1, pbr: 3.2, marketCap: 290000, volume: 1200000, sector: "바이오", changePercent: 0.65 },
  { code: "012450", name: "한화에어로스페이스", per: 35.8, pbr: 4.2, marketCap: 250000, volume: 1800000, sector: "방산", changePercent: 3.50 },
  { code: "105560", name: "KB금융", per: 5.5, pbr: 0.5, marketCap: 260000, volume: 1100000, sector: "금융", changePercent: 0.45 },
  { code: "055550", name: "신한지주", per: 5.8, pbr: 0.4, marketCap: 220000, volume: 1300000, sector: "금융", changePercent: 0.30 },
  { code: "003670", name: "포스코퓨처엠", per: 85.0, pbr: 3.5, marketCap: 150000, volume: 650000, sector: "2차전지", changePercent: -2.80 },
  { code: "028260", name: "삼성물산", per: 15.2, pbr: 0.9, marketCap: 280000, volume: 420000, sector: "건설", changePercent: 0.25 },
  { code: "032830", name: "삼성생명", per: 8.5, pbr: 0.4, marketCap: 180000, volume: 350000, sector: "보험", changePercent: -0.15 },
  { code: "010130", name: "고려아연", per: 12.8, pbr: 1.3, marketCap: 120000, volume: 180000, sector: "철강", changePercent: -1.50 },
  { code: "003490", name: "대한항공", per: 6.2, pbr: 1.1, marketCap: 110000, volume: 1500000, sector: "항공", changePercent: 1.80 },
  { code: "009540", name: "HD한국조선해양", per: 15.5, pbr: 1.4, marketCap: 95000, volume: 820000, sector: "조선", changePercent: 2.90 },
  { code: "047810", name: "한국항공우주", per: 42.0, pbr: 5.5, marketCap: 130000, volume: 2200000, sector: "방산", changePercent: 4.20 },
  { code: "096770", name: "SK이노베이션", per: 15.0, pbr: 0.7, marketCap: 100000, volume: 550000, sector: "에너지", changePercent: -0.90 },
  { code: "010950", name: "S-Oil", per: 8.5, pbr: 0.9, marketCap: 85000, volume: 320000, sector: "에너지", changePercent: 0.55 },
  { code: "042700", name: "한미반도체", per: 28.5, pbr: 6.8, marketCap: 75000, volume: 3800000, sector: "반도체", changePercent: 5.20 },
  { code: "006800", name: "미래에셋증권", per: 7.2, pbr: 0.5, marketCap: 55000, volume: 2500000, sector: "금융", changePercent: 0.70 },
  { code: "066570", name: "LG전자", per: 14.2, pbr: 0.8, marketCap: 160000, volume: 680000, sector: "IT", changePercent: 0.35 },
  { code: "005490", name: "POSCO홀딩스", per: 7.8, pbr: 0.4, marketCap: 200000, volume: 520000, sector: "철강", changePercent: -0.40 },
  { code: "034730", name: "SK", per: 9.5, pbr: 0.5, marketCap: 140000, volume: 180000, sector: "지주", changePercent: -0.25 },
  { code: "003550", name: "LG", per: 10.2, pbr: 0.7, marketCap: 120000, volume: 150000, sector: "지주", changePercent: 0.15 },
  { code: "030200", name: "KT", per: 7.5, pbr: 0.5, marketCap: 85000, volume: 1200000, sector: "통신", changePercent: 0.20 },
  { code: "017670", name: "SK텔레콤", per: 9.8, pbr: 0.8, marketCap: 95000, volume: 350000, sector: "통신", changePercent: 0.10 },
  { code: "000810", name: "삼성화재", per: 8.0, pbr: 0.7, marketCap: 150000, volume: 120000, sector: "보험", changePercent: 0.50 },
  { code: "018260", name: "삼성에스디에스", per: 16.5, pbr: 1.8, marketCap: 120000, volume: 95000, sector: "IT", changePercent: -0.30 },
  { code: "086790", name: "하나금융지주", per: 4.5, pbr: 0.4, marketCap: 160000, volume: 1400000, sector: "금융", changePercent: 0.85 },
  { code: "015760", name: "한국전력", per: 0, pbr: 0.3, marketCap: 130000, volume: 3500000, sector: "에너지", changePercent: -1.20 },
  { code: "033780", name: "KT&G", per: 9.2, pbr: 1.0, marketCap: 110000, volume: 480000, sector: "소비재", changePercent: 0.40 },
  { code: "034020", name: "두산에너빌리티", per: 55.0, pbr: 2.5, marketCap: 95000, volume: 4500000, sector: "에너지", changePercent: 3.80 },
  { code: "009150", name: "삼성전기", per: 15.5, pbr: 1.5, marketCap: 85000, volume: 420000, sector: "반도체", changePercent: 0.90 },
  { code: "011200", name: "HMM", per: 3.2, pbr: 0.8, marketCap: 75000, volume: 5500000, sector: "항공", changePercent: -0.60 },
  { code: "010140", name: "삼성중공업", per: 25.0, pbr: 2.0, marketCap: 70000, volume: 8500000, sector: "조선", changePercent: 3.20 },
  { code: "316140", name: "우리금융지주", per: 4.2, pbr: 0.3, marketCap: 120000, volume: 2800000, sector: "금융", changePercent: 0.55 },
  { code: "024110", name: "기업은행", per: 4.0, pbr: 0.3, marketCap: 75000, volume: 1200000, sector: "금융", changePercent: 0.25 },
  { code: "138040", name: "메리츠금융지주", per: 6.5, pbr: 1.2, marketCap: 140000, volume: 680000, sector: "금융", changePercent: 1.10 },
  { code: "000720", name: "현대건설", per: 6.8, pbr: 0.5, marketCap: 45000, volume: 850000, sector: "건설", changePercent: -0.75 },
  { code: "003410", name: "쌍용C&E", per: 8.5, pbr: 0.6, marketCap: 25000, volume: 320000, sector: "건설", changePercent: 0.30 },
  { code: "329180", name: "HD현대중공업", per: 22.0, pbr: 2.8, marketCap: 85000, volume: 950000, sector: "조선", changePercent: 2.50 },
  { code: "352820", name: "하이브", per: 52.0, pbr: 3.8, marketCap: 65000, volume: 1500000, sector: "엔터", changePercent: -3.20 },
  { code: "011170", name: "롯데케미칼", per: 0, pbr: 0.4, marketCap: 35000, volume: 450000, sector: "화학", changePercent: -1.80 },
  { code: "036570", name: "엔씨소프트", per: 18.5, pbr: 1.2, marketCap: 55000, volume: 520000, sector: "게임", changePercent: -1.50 },
  { code: "251270", name: "넷마블", per: 0, pbr: 1.5, marketCap: 35000, volume: 850000, sector: "게임", changePercent: -2.30 },
  { code: "259960", name: "크래프톤", per: 15.8, pbr: 2.2, marketCap: 120000, volume: 350000, sector: "게임", changePercent: 1.80 },
  { code: "263750", name: "펄어비스", per: 22.0, pbr: 1.8, marketCap: 18000, volume: 280000, sector: "게임", changePercent: -0.90 },
  { code: "112040", name: "위메이드", per: 0, pbr: 2.5, marketCap: 12000, volume: 1500000, sector: "게임", changePercent: -4.50 },
  { code: "041510", name: "에스엠", per: 18.0, pbr: 2.8, marketCap: 28000, volume: 450000, sector: "엔터", changePercent: 0.85 },
  { code: "122870", name: "와이지엔터테인먼트", per: 25.0, pbr: 2.2, marketCap: 15000, volume: 380000, sector: "엔터", changePercent: 1.20 },
  { code: "035900", name: "JYP Ent.", per: 22.5, pbr: 5.5, marketCap: 32000, volume: 520000, sector: "엔터", changePercent: 2.10 },
  { code: "180640", name: "한진칼", per: 8.5, pbr: 0.6, marketCap: 35000, volume: 220000, sector: "항공", changePercent: 0.95 },
  { code: "004020", name: "현대제철", per: 6.5, pbr: 0.3, marketCap: 45000, volume: 650000, sector: "철강", changePercent: -0.80 },
  { code: "011070", name: "LG이노텍", per: 10.5, pbr: 1.2, marketCap: 65000, volume: 280000, sector: "반도체", changePercent: 1.50 },
  { code: "090430", name: "아모레퍼시픽", per: 35.0, pbr: 1.8, marketCap: 45000, volume: 350000, sector: "소비재", changePercent: -1.10 },
  { code: "051900", name: "LG생활건강", per: 28.5, pbr: 2.2, marketCap: 55000, volume: 120000, sector: "소비재", changePercent: -0.65 },
  { code: "326030", name: "SK바이오팜", per: 85.0, pbr: 6.5, marketCap: 65000, volume: 550000, sector: "바이오", changePercent: 1.80 },
  { code: "302440", name: "SK바이오사이언스", per: 0, pbr: 3.2, marketCap: 28000, volume: 850000, sector: "바이오", changePercent: -2.50 },
  { code: "006280", name: "녹십자", per: 22.0, pbr: 1.5, marketCap: 18000, volume: 280000, sector: "바이오", changePercent: 0.45 },
  { code: "128940", name: "한미약품", per: 42.0, pbr: 3.8, marketCap: 35000, volume: 180000, sector: "바이오", changePercent: -0.35 },
  { code: "012330", name: "현대모비스", per: 7.5, pbr: 0.5, marketCap: 180000, volume: 350000, sector: "자동차", changePercent: 0.60 },
  { code: "161390", name: "한국타이어앤테크놀로지", per: 6.8, pbr: 0.7, marketCap: 45000, volume: 250000, sector: "자동차", changePercent: 0.40 },
  { code: "069500", name: "KODEX 200", per: 0, pbr: 0, marketCap: 65000, volume: 8500000, sector: "ETF", changePercent: 0.35 },
  { code: "005830", name: "DB손해보험", per: 6.2, pbr: 0.8, marketCap: 85000, volume: 280000, sector: "보험", changePercent: 0.55 },
  { code: "002790", name: "아모레G", per: 18.0, pbr: 0.5, marketCap: 15000, volume: 120000, sector: "소비재", changePercent: -0.85 },
  { code: "021240", name: "코웨이", per: 12.5, pbr: 3.5, marketCap: 55000, volume: 250000, sector: "소비재", changePercent: 0.70 },
  { code: "010620", name: "HD현대미포", per: 18.5, pbr: 1.8, marketCap: 45000, volume: 550000, sector: "조선", changePercent: 2.80 },
  { code: "011790", name: "SKC", per: 0, pbr: 0.8, marketCap: 18000, volume: 650000, sector: "화학", changePercent: -1.50 },
  { code: "047050", name: "포스코인터내셔널", per: 6.5, pbr: 0.7, marketCap: 55000, volume: 850000, sector: "철강", changePercent: 0.30 },
  { code: "361610", name: "SK아이이테크놀로지", per: 0, pbr: 2.5, marketCap: 25000, volume: 380000, sector: "2차전지", changePercent: -3.50 },
  { code: "267260", name: "HD현대일렉트릭", per: 32.0, pbr: 5.2, marketCap: 85000, volume: 1800000, sector: "에너지", changePercent: 4.50 },
  { code: "373220", name: "LG에너지솔루션", per: 120.0, pbr: 5.8, marketCap: 850000, volume: 250000, sector: "2차전지", changePercent: -1.80 },
  { code: "377300", name: "카카오페이", per: 0, pbr: 3.5, marketCap: 45000, volume: 1200000, sector: "IT", changePercent: -2.50 },
  { code: "323410", name: "카카오뱅크", per: 25.0, pbr: 2.8, marketCap: 55000, volume: 1500000, sector: "금융", changePercent: -1.20 },
  { code: "402340", name: "SK스퀘어", per: 8.5, pbr: 0.5, marketCap: 75000, volume: 650000, sector: "지주", changePercent: 0.80 },
  { code: "000100", name: "유한양행", per: 28.0, pbr: 2.2, marketCap: 45000, volume: 250000, sector: "바이오", changePercent: 1.20 },
  { code: "004990", name: "롯데지주", per: 12.0, pbr: 0.3, marketCap: 18000, volume: 180000, sector: "지주", changePercent: -0.55 },
  { code: "272210", name: "한화시스템", per: 45.0, pbr: 3.5, marketCap: 55000, volume: 2500000, sector: "방산", changePercent: 3.80 },
  { code: "009830", name: "한화솔루션", per: 0, pbr: 0.5, marketCap: 35000, volume: 1800000, sector: "에너지", changePercent: -2.20 },
  { code: "002380", name: "KCC", per: 5.5, pbr: 0.3, marketCap: 15000, volume: 55000, sector: "화학", changePercent: 0.25 },
  { code: "036460", name: "한국가스공사", per: 8.0, pbr: 0.3, marketCap: 25000, volume: 1500000, sector: "에너지", changePercent: 1.50 },
  { code: "078930", name: "GS", per: 6.5, pbr: 0.4, marketCap: 35000, volume: 180000, sector: "에너지", changePercent: 0.20 },
  { code: "001450", name: "현대해상", per: 5.2, pbr: 0.4, marketCap: 35000, volume: 450000, sector: "보험", changePercent: 0.65 },
  { code: "016360", name: "삼성증권", per: 7.8, pbr: 0.6, marketCap: 35000, volume: 280000, sector: "금융", changePercent: 0.40 },
  { code: "088350", name: "한화생명", per: 5.5, pbr: 0.2, marketCap: 18000, volume: 550000, sector: "보험", changePercent: -0.30 },
  { code: "001040", name: "CJ", per: 8.5, pbr: 0.4, marketCap: 25000, volume: 150000, sector: "지주", changePercent: 0.15 },
  { code: "097950", name: "CJ제일제당", per: 10.5, pbr: 0.7, marketCap: 35000, volume: 120000, sector: "식품", changePercent: -0.45 },
  { code: "004170", name: "신세계", per: 8.0, pbr: 0.4, marketCap: 18000, volume: 85000, sector: "유통", changePercent: -0.80 },
  { code: "069960", name: "현대백화점", per: 7.5, pbr: 0.3, marketCap: 12000, volume: 120000, sector: "유통", changePercent: -0.55 },
  { code: "023530", name: "롯데쇼핑", per: 0, pbr: 0.2, marketCap: 8000, volume: 95000, sector: "유통", changePercent: -1.20 },
  { code: "032640", name: "LG유플러스", per: 7.0, pbr: 0.5, marketCap: 35000, volume: 850000, sector: "통신", changePercent: 0.30 },
  { code: "003230", name: "삼양식품", per: 15.0, pbr: 3.8, marketCap: 28000, volume: 180000, sector: "식품", changePercent: 2.50 },
  { code: "241560", name: "두산밥캣", per: 8.0, pbr: 1.2, marketCap: 45000, volume: 220000, sector: "건설", changePercent: 0.85 },
  { code: "071050", name: "한국금융지주", per: 5.0, pbr: 0.4, marketCap: 35000, volume: 350000, sector: "금융", changePercent: 0.50 },
  { code: "005940", name: "NH투자증권", per: 6.8, pbr: 0.5, marketCap: 25000, volume: 550000, sector: "금융", changePercent: 0.35 },
];

/** 검색 함수: 이름 또는 코드에 query 포함 */
export function searchStocks(query: string): StockListItem[] {
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();
  return STOCK_LIST.filter(
    (s) => s.name.toLowerCase().includes(q) || s.code.includes(q)
  ).slice(0, 10);
}

/** 섹터별 종목 그룹핑 */
export function getStocksBySector(sector: string): StockListItem[] {
  return STOCK_LIST.filter((s) => s.sector === sector);
}

/** 섹터별 평균 등락률 */
export function getSectorStats() {
  const sectorMap = new Map<string, StockListItem[]>();
  for (const stock of STOCK_LIST) {
    if (stock.sector === "ETF") continue;
    const list = sectorMap.get(stock.sector) || [];
    list.push(stock);
    sectorMap.set(stock.sector, list);
  }

  return Array.from(sectorMap.entries()).map(([sector, stocks]) => {
    const avgChange = stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length;
    const topStocks = [...stocks].sort((a, b) => b.marketCap - a.marketCap).slice(0, 3);
    return {
      sector,
      avgChange: Math.round(avgChange * 100) / 100,
      stockCount: stocks.length,
      topStocks,
      totalMarketCap: stocks.reduce((sum, s) => sum + s.marketCap, 0),
    };
  }).sort((a, b) => b.totalMarketCap - a.totalMarketCap);
}
