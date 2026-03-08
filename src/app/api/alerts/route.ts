export const dynamic = "force-static";

import { NextRequest, NextResponse } from "next/server";
import { getAlerts, putAlert, deleteAlert } from "@/lib/dynamodb";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }
    const alerts = await getAlerts(userId);
    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("GET alerts error:", error);
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, stockCode, stockName, targetPrice, direction } = body;

    if (!userId || !stockCode || !targetPrice || !direction) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const alert = await putAlert({
      userId,
      stockCode,
      stockName: stockName || stockCode,
      targetPrice: Number(targetPrice),
      direction: direction as "above" | "below",
    });

    return NextResponse.json({ alert });
  } catch (error) {
    console.error("POST alert error:", error);
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const createdAt = req.nextUrl.searchParams.get("createdAt");

    if (!userId || !createdAt) {
      return NextResponse.json({ error: "userId and createdAt required" }, { status: 400 });
    }

    await deleteAlert(userId, Number(createdAt));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE alert error:", error);
    return NextResponse.json({ error: "Failed to delete alert" }, { status: 500 });
  }
}
