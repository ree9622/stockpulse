import { NextRequest, NextResponse } from "next/server";
import { getBriefings, getRecentBriefings, putBriefing } from "@/lib/dynamodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const limit = parseInt(searchParams.get("limit") || "10");

    let briefings;
    if (date) {
      briefings = await getBriefings(date, limit);
    } else {
      briefings = await getRecentBriefings(limit);
    }

    return NextResponse.json({ briefings });
  } catch (error) {
    console.error("Briefings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch briefings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, threads, marketData, generatedBy } = body;

    if (!date || !threads) {
      return NextResponse.json({ error: "date and threads required" }, { status: 400 });
    }

    const result = await putBriefing({ date, threads, marketData, generatedBy });
    return NextResponse.json({ success: true, briefing: result });
  } catch (error) {
    console.error("Briefings POST error:", error);
    return NextResponse.json({ error: "Failed to save briefing" }, { status: 500 });
  }
}
