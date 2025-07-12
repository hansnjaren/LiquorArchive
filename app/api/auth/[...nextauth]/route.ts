// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline", // 오프라인 액세스 허용
          response_type: "code", // 코드 응답 타입
        },
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async signIn({ profile }: { profile?: any }) {
      if (!profile?.email) {
        console.error("소셜 로그인 실패: 이메일 정보가 없습니다.");
        return false; // 이메일이 없으면 로그인 실패
      }
      return true; // ✅ 소셜 유저는 가입 후 홈으로 리다이렉
    },

    async jwt({
      token,
      account,
      profile,
      isNewUser,
    }: {
      token: any;
      account: any;
      profile?: any;
      isNewUser?: boolean;
    }) {
      if (account && profile?.email) {
        const existingUser = await db.user.findFirst({
          where: { email: profile.email, deletedAt: null },
        });

        token.isNewUser = existingUser ? false : true;
        console.log(">>> isNewUser:", !existingUser);
        token.email = existingUser?.email || profile.email.toLowerCase();
        token.name = existingUser?.name || profile.name;
        token.userId = existingUser?.id || profile.sub;
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      console.log("session 콜백 토큰: ", token);
      const newSession = {
        ...session,
        user: {
          id: token.userId,
          email: token.email,
          name: token.name,
        },
        isNewUser: token.isNewUser,
      };
      console.log("세션 콜백 반환:", newSession);
      return newSession;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
