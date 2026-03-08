"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { TrendingUp } from "lucide-react";

export default function LoginPage() {
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState("");

  const handleOAuth = (provider: string) => {
    setLoading(provider);
    signIn(provider, { callbackUrl: "/" });
  };

  const handleGuest = () => {
    if (nickname.length < 2) return;
    setLoading("credentials");
    signIn("credentials", { nickname, callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-8 h-8 text-emerald-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              주식갤
            </span>
          </div>
          <p className="text-sm text-gray-500">한국 주식 실시간 정보 & 트래쉬토크</p>
        </div>

        {/* OAuth 로그인 */}
        <div className="space-y-3">
          <button
            onClick={() => handleOAuth("kakao")}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 bg-[#FEE500] text-[#191919] font-semibold rounded-xl py-3 px-4 hover:bg-[#FDD835] transition-colors disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 3C5.58 3 2 5.92 2 9.48c0 2.27 1.51 4.26 3.78 5.39l-.96 3.56c-.08.3.26.54.52.37l4.26-2.82c.13.01.27.02.4.02 4.42 0 8-2.92 8-6.52C18 5.92 14.42 3 10 3z" fill="#191919"/>
            </svg>
            {loading === "kakao" ? "연결 중..." : "카카오로 시작"}
          </button>

          <button
            onClick={() => handleOAuth("naver")}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 bg-[#03C75A] text-white font-semibold rounded-xl py-3 px-4 hover:bg-[#02b351] transition-colors disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13.36 10.53L6.4 3H3v14h3.64V9.47L13.6 17H17V3h-3.64v7.53z" fill="white"/>
            </svg>
            {loading === "naver" ? "연결 중..." : "네이버로 시작"}
          </button>
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-xs text-gray-500">또는</span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>

        {/* 게스트 로그인 */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="닉네임 입력 (2자 이상)"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGuest()}
            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
            maxLength={12}
          />
          <button
            onClick={handleGuest}
            disabled={nickname.length < 2 || !!loading}
            className="w-full bg-gray-800 text-gray-200 font-medium rounded-xl py-3 px-4 hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading === "credentials" ? "입장 중..." : "게스트로 입장"}
          </button>
        </div>

        <p className="text-[11px] text-gray-600 text-center">
          로그인 시 서비스 이용약관에 동의하는 것으로 간주합니다.
        </p>
      </div>
    </div>
  );
}
