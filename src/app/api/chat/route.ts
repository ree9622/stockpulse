import { NextRequest, NextResponse } from "next/server";
import { getChatMessages, putChatMessage } from "@/lib/dynamodb";

// GET /api/chat?room=trashtalk&limit=50
export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get("room") || "trashtalk";
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");

  try {
    const messages = await getChatMessages(room, limit);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Chat GET error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// POST /api/chat
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { room, userId, nickname, content } = body;

    if (!room || !userId || !nickname || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const message = await putChatMessage({ room, userId, nickname, content });
    return NextResponse.json({ message });
  } catch (error) {
    console.error("Chat POST error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
