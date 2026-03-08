import { createServer } from "http";
import next from "next";
import { Server as SocketServer } from "socket.io";
import { putChatMessage, getChatMessages } from "./lib/dynamodb";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// 방별 접속자 수 추적
const roomUsers = new Map<string, Set<string>>();

function getRoomUserCount(room: string): number {
  return roomUsers.get(room)?.size ?? 0;
}

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new SocketServer(httpServer, {
    path: "/stockpulse/socket.io",
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    let currentRoom: string | null = null;

    // ━━━ 방 입장 ━━━
    socket.on("join-room", async (room: string) => {
      // 기존 방에서 나가기
      if (currentRoom) {
        socket.leave(currentRoom);
        roomUsers.get(currentRoom)?.delete(socket.id);
        io.to(currentRoom).emit("user-count", {
          room: currentRoom,
          count: getRoomUserCount(currentRoom),
        });
      }

      currentRoom = room;
      socket.join(room);

      if (!roomUsers.has(room)) roomUsers.set(room, new Set());
      roomUsers.get(room)!.add(socket.id);

      // 접속자 수 브로드캐스트
      io.to(room).emit("user-count", {
        room,
        count: getRoomUserCount(room),
      });

      // 최근 50개 메시지 로드
      try {
        const messages = await getChatMessages(room, 50);
        socket.emit("recent-messages", messages);
      } catch (err) {
        console.error("[socket] getChatMessages error:", err);
        socket.emit("recent-messages", []);
      }
    });

    // ━━━ 방 퇴장 ━━━
    socket.on("leave-room", () => {
      if (currentRoom) {
        socket.leave(currentRoom);
        roomUsers.get(currentRoom)?.delete(socket.id);
        io.to(currentRoom).emit("user-count", {
          room: currentRoom,
          count: getRoomUserCount(currentRoom),
        });
        currentRoom = null;
      }
    });

    // ━━━ 메시지 전송 ━━━
    socket.on(
      "send-message",
      async (data: { room: string; userId: string; nickname: string; content: string }) => {
        const { room, userId, nickname, content } = data;

        // DynamoDB 저장
        try {
          const saved = await putChatMessage({ room, userId, nickname, content });
          const msg = {
            id: `${saved.timestamp}-${userId}`,
            ...saved,
          };
          io.to(room).emit("new-message", msg);
        } catch (err) {
          console.error("[socket] putChatMessage error:", err);
          // 저장 실패해도 메시지는 전달
          io.to(room).emit("new-message", {
            id: `${Date.now()}-${userId}`,
            room,
            userId,
            nickname,
            content,
            timestamp: Date.now(),
          });
        }
      }
    );

    // ━━━ 연결 해제 ━━━
    socket.on("disconnect", () => {
      if (currentRoom) {
        roomUsers.get(currentRoom)?.delete(socket.id);
        io.to(currentRoom).emit("user-count", {
          room: currentRoom,
          count: getRoomUserCount(currentRoom),
        });
      }
    });
  });

  httpServer.listen(port, () => {
    console.log(`> StockPulse ready on http://${hostname}:${port}`);
  });
});
