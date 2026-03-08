import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";
import Credentials from "next-auth/providers/credentials";

export const authConfig: NextAuthConfig = {
  providers: [
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    Naver({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
    // 게스트 로그인 (닉네임만)
    Credentials({
      name: "게스트",
      credentials: {
        nickname: { label: "닉네임", type: "text", placeholder: "닉네임 입력" },
      },
      async authorize(credentials) {
        const nickname = credentials?.nickname as string;
        if (!nickname || nickname.length < 2) return null;
        return {
          id: `guest_${Date.now()}`,
          name: nickname,
          image: null,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).id = token.userId;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "stockpulse-dev-secret-change-in-prod",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
