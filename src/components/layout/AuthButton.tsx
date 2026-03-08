"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  if (status === "loading") {
    return (
      <div className="w-16 h-8 bg-gray-800/50 rounded-lg animate-pulse" />
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="px-3 py-1.5 bg-emerald-500/15 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/25 transition-colors"
      >
        로그인
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-800/50 transition-colors"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt=""
            className="w-7 h-7 rounded-full"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
            {session.user.name?.[0] || "?"}
          </div>
        )}
        <span className="text-sm text-gray-300 hidden sm:block max-w-[80px] truncate">
          {session.user.name}
        </span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-48 bg-[#12121a] border border-gray-700/50 rounded-xl shadow-xl z-50 py-1">
            <div className="px-3 py-2 border-b border-gray-800/50">
              <div className="text-sm text-gray-200 font-medium truncate">
                {session.user.name}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {session.user.email || "게스트"}
              </div>
            </div>
            <button
              onClick={() => {
                setShowMenu(false);
                signOut({ callbackUrl: "/" });
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        </>
      )}
    </div>
  );
}
