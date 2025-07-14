// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    // 구글 소셜 로그인
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
    // 일반 로그인
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "이메일" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "비밀번호",
        },
      },
      async authorize(credentials) {
        const user = await db.user.findFirst({
          where: { email: credentials?.email?.toLowerCase(), deletedAt: null },
        });
        if (!user || !user.password) {
          return null; // 유저가 없거나 비밀번호가 없는 경우
        }
        const isValidPassword = await bcrypt.compare(
          credentials!.password,
          user.password
        );
        if (!isValidPassword) {
          return null; // 비밀번호가 일치하지 않는 경우
        }
        return { id: user.id, email: user.email, name: user.name }; // 로그인 성공 시 유저 정보 반환
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async signIn({ account, profile }: { account?: any; profile?: any }) {
      //일반 로그인은 여기서 안따짐..
      if (account?.provider === "google") {
        if (!profile?.email) {
          console.error("소셜 로그인 실패: 이메일 정보가 없습니다.");
          return false; // 이메일이 없으면 로그인 실패
        }
      }
      return true; // ✅ 소셜 유저는 가입 후 홈으로 리다이렉
    },

    async jwt({
      token,
      account,
      profile,
      user,
    }: {
      token: any;
      account: any;
      profile?: any;
      user?: any;
    }) {
      if (account?.provider === "google" && profile?.email) {
        const existingUser = await db.user.findFirst({
          where: { email: profile.email, deletedAt: null },
        });

        token.isNewUser = existingUser ? false : true;
        console.log(">>> isNewUser:", !existingUser);
        token.email = existingUser?.email || profile.email.toLowerCase();
        token.name = existingUser?.name || profile.name;
        token.userId = existingUser?.id || profile.sub;
      }
      if (account?.provider === "credentials" && user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.isNewUser = false; // 일반 로그인은 신규 유저가 아님
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
