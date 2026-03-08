export const dynamic = "force-static";

import { NextRequest, NextResponse } from "next/server";
import {
  fetchTrendingStocks,
  fetchMarketIndices,
  fetchStockDetail,
  fetchStockHistory,
} from "@/lib/stock-api";


export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") || "trending";

  try {
    switch (type) {
      case "trending": {
        const stocks = await fetchTrendingStocks();
        return NextResponse.json({ stocks });
      }
      case "indices": {
        const indices = await fetchMarketIndices();
        return NextResponse.json({ indices });
      }
      case "detail": {
        const code = searchParams.get("code");
        if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });
        const detail = await fetchStockDetail(code);
        if (!detail) return NextResponse.json({ error: "not found" }, { status: 404 });
        return NextResponse.json({ detail });
      }
      case "history": {
        const code = searchParams.get("code");
        const days = parseInt(searchParams.get("days") || "30", 10);
        if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });
        const history = await fetchStockHistory(code, days);
        return NextResponse.json({ history });
      }
      default:
        return NextResponse.json({ error: "invalid type" }, { status: 400 });
    }
  } catch (err) {
    console.error("[api/stocks] error:", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
