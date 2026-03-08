"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Users, ChevronDown, Flame, Hash } from "lucide-react";
import { mockMessages, chatRooms } from "@/lib/mock-data";
import type { ChatMessage } from "@/types";
import { timeAgo } from "@/lib/utils";

export default function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeRoom, setActiveRoom] = useState("trashtalk");
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [input, setInput] = useState("");
  const [showRooms, setShowRooms] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentRoom = chatRooms.find((r) => r.id === activeRoom)!;
  const roomMessages = messages.filter((m) => m.room === activeRoom);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [roomMessages.length, isOpen]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      userId: "me",
      nickname: "나",
      content: input.trim(),
      timestamp: new Date(),
      room: activeRoom,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ━━━ 닫힌 상태: 플로팅 버튼 ━━━
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-50 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {roomMessages.length}
        </span>
        {/* Pulse */}
        <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping" />
      </button>
    );
  }

  // ━━━ 열린 상태: 채팅 패널 ━━━
  return (
    <div
      className={`fixed z-50 bg-[#0d0d14] border border-gray-700/50 rounded-t-2xl shadow-2xl shadow-black/50 transition-all duration-300 ${
        isExpanded
          ? "bottom-0 right-0 left-0 top-[10vh] rounded-t-2xl"
          : "bottom-0 right-4 w-[380px] h-[520px] rounded-t-2xl"
      }`}
    >
      {/* ━━━ Header ━━━ */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/50 cursor-pointer select-none">
        <div className="flex items-center gap-2" onClick={() => setShowRooms(!showRooms)}>
          <span className="text-lg">{currentRoom.icon}</span>
          <span className="text-sm font-bold text-gray-200">{currentRoom.name}</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showRooms ? "rotate-180" : ""}`} />
          <span className="flex items-center gap-1 text-xs text-gray-500 ml-2">
            <Users className="w-3 h-3" />
            {currentRoom.userCount}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 rounded-lg transition-colors text-xs"
          >
            {isExpanded ? "축소" : "확대"}
          </button>
          <button
            onClick={() => { setIsOpen(false); setIsExpanded(false); }}
            className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ━━━ Room Selector ━━━ */}
      {showRooms && (
        <div className="absolute top-[52px] left-0 right-0 bg-[#0d0d14] border-b border-gray-800/50 z-10 p-2 space-y-1">
          {chatRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => { setActiveRoom(room.id); setShowRooms(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeRoom === room.id
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
              }`}
            >
              <span className="text-lg">{room.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium">{room.name}</div>
                <div className="text-xs text-gray-500">{room.description}</div>
              </div>
              <span className="text-xs text-gray-600">{room.userCount}</span>
            </button>
          ))}
        </div>
      )}

      {/* ━━━ Messages ━━━ */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ height: isExpanded ? "calc(100% - 120px)" : "390px" }}>
        {roomMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Hash className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">아직 메시지가 없습니다</p>
          </div>
        ) : (
          roomMessages.map((msg) => (
            <div key={msg.id} className="group">
              <div className="flex items-start gap-2">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {msg.nickname[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${msg.userId === "me" ? "text-emerald-400" : "text-gray-300"}`}>
                      {msg.nickname}
                    </span>
                    <span className="text-[10px] text-gray-600">{timeAgo(msg.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-0.5 break-words">{msg.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ━━━ Input ━━━ */}
      <div className="px-3 py-3 border-t border-gray-800/50">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`${currentRoom.name}에 메시지 입력...`}
            className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
