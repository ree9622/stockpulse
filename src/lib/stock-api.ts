import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

// ━━━ 한국 주요 종목 ━━━
export const KOREAN_STOCKS = [
  { code: "005930.KS", name: "삼성전자", sector: "반도체" },
  { code: "000660.KS", name: "SK하이닉스", sector: "반도체" },
  { code: "012450.KS", name: "한화에어로스페이스", sector: "방산" },
  { code: "010950.KS", name: "S-Oil", sector: "에너지" },
  { code: "003490.KS", name: "대한항공", sector: "항공" },
  { code: "042700.KS", name: "한미반도체", sector: "반도체" },
  { code: "006800.KS", name: "미래에셋증권", sector: "금융" },
  { code: "009540.KS", name: "HD한국조선해양", sector: "조선" },
  { code: "047810.KS", name: "한국항공우주", sector: "방산" },
  { code: "096770.KS", name: "SK이노베이션", sector: "에너지" },
] as const;

export const MARKET_INDICES = [
  { symbol: "^KS11", name: "KOSPI" },
  { symbol: "^KQ11", name: "KOSDAQ" },
  { symbol: "^GSPC", name: "S&P 500" },
  { symbol: "^IXIC", name: "NASDAQ" },
  { symbol: "KRW=X", name: "USD/KRW" },
  { symbol: "CL=F", name: "WTI" },
  { symbol: "GC=F", name: "Gold" },
  { symbol: "BTC-USD", name: "BTC/USD" },
] as const;

export interface QuoteResult {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
}

export interface IndexResult {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  status: "up" | "down" | "flat";
}

export interface StockDetail {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
  per: number | null;
  pbr: number | null;
  high52w: number | null;
  low52w: number | null;
  dayHigh: number | null;
  dayLow: number | null;
  prevClose: number | null;
}

/** Fetch quotes for trending Korean stocks */
export async function fetchTrendingStocks(): Promise<QuoteResult[]> {
  const symbols = KOREAN_STOCKS.map((s) => s.code);
  const results: QuoteResult[] = [];

  try {
    const quotes = await yahooFinance.quote(symbols);
    for (const q of quotes) {
      const meta = KOREAN_STOCKS.find((s) => s.code === q.symbol);
      if (!meta || !q.regularMarketPrice) continue;

      results.push({
        code: q.symbol.replace(".KS", ""),
        name: meta.name,
        price: q.regularMarketPrice,
        change: q.regularMarketChange ?? 0,
        changePercent: q.regularMarketChangePercent ?? 0,
        volume: q.regularMarketVolume ?? 0,
        marketCap: q.marketCap ?? 0,
        sector: meta.sector,
      });
    }
  } catch (err) {
    console.error("[stock-api] fetchTrendingStocks error:", err);
  }

  return results;
}

/** Fetch market indices */
export async function fetchMarketIndices(): Promise<IndexResult[]> {
  const symbols = MARKET_INDICES.map((i) => i.symbol);
  const results: IndexResult[] = [];

  try {
    const quotes = await yahooFinance.quote(symbols);
    for (const q of quotes) {
      const meta = MARKET_INDICES.find((i) => i.symbol === q.symbol);
      if (!meta || !q.regularMarketPrice) continue;

      const change = q.regularMarketChange ?? 0;
      results.push({
        name: meta.name,
        value: q.regularMarketPrice,
        change,
        changePercent: q.regularMarketChangePercent ?? 0,
        status: change > 0 ? "up" : change < 0 ? "down" : "flat",
      });
    }
  } catch (err) {
    console.error("[stock-api] fetchMarketIndices error:", err);
  }

  return results;
}

/** Fetch detailed quote for a single stock */
export async function fetchStockDetail(symbol: string): Promise<StockDetail | null> {
  try {
    const fullSymbol = symbol.includes(".") ? symbol : `${symbol}.KS`;
    const q = await yahooFinance.quote(fullSymbol);
    if (!q || !q.regularMarketPrice) return null;

    return {
      code: symbol.replace(".KS", ""),
      name: q.shortName || q.longName || symbol,
      price: q.regularMarketPrice,
      change: q.regularMarketChange ?? 0,
      changePercent: q.regularMarketChangePercent ?? 0,
      volume: q.regularMarketVolume ?? 0,
      marketCap: q.marketCap ?? 0,
      sector: "",
      per: q.trailingPE ?? null,
      pbr: q.priceToBook ?? null,
      high52w: q.fiftyTwoWeekHigh ?? null,
      low52w: q.fiftyTwoWeekLow ?? null,
      dayHigh: q.regularMarketDayHigh ?? null,
      dayLow: q.regularMarketDayLow ?? null,
      prevClose: q.regularMarketPreviousClose ?? null,
    };
  } catch (err) {
    console.error("[stock-api] fetchStockDetail error:", err);
    return null;
  }
}

/** Fetch historical prices (last N days) */
export async function fetchStockHistory(
  symbol: string,
  days = 30
): Promise<{ date: string; close: number }[]> {
  try {
    const fullSymbol = symbol.includes(".") ? symbol : `${symbol}.KS`;
    const now = new Date();
    const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const result = await yahooFinance.chart(fullSymbol, {
      period1: from,
      period2: now,
      interval: "1d",
    });

    if (!result.quotes) return [];

    return result.quotes
      .filter((q) => q.close != null)
      .map((q) => ({
        date: new Date(q.date).toISOString().split("T")[0],
        close: q.close as number,
      }));
  } catch (err) {
    console.error("[stock-api] fetchStockHistory error:", err);
    return [];
  }
}
