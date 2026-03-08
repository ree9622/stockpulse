export const dynamic = "force-static";

import { NextRequest, NextResponse } from "next/server";
import { getAllNews, putNewsItem } from "@/lib/dynamodb";

// GET /api/news?limit=50
export async function GET(req: NextRequest) {
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");

  try {
    const news = await getAllNews(limit);
    return NextResponse.json({ news });
  } catch (error) {
    console.error("News GET error:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

// POST /api/news
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { source, title, tags, views, sentiment, url } = body;

    if (!source || !title) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const item = await putNewsItem({
      source,
      title,
      tags: tags || [],
      views: views || 0,
      sentiment: sentiment || "neutral",
      url,
    });
    return NextResponse.json({ item });
  } catch (error) {
    console.error("News POST error:", error);
    return NextResponse.json({ error: "Failed to post news" }, { status: 500 });
  }
}
