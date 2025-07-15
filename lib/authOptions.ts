// lib/authOptions.ts
import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { db } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    /* ───────── Google OAuth ───────── */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    /* ───────── 일반 로그인 ───────── */
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
        if (!user || !user.password) return null;
        const ok = await bcrypt.compare(credentials!.password, user.password);
        return ok ? { id: user.id, email: user.email, name: user.name } : null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && !profile?.email) return false;
      return true;
    },
    async jwt({ token, account, profile, user }) {
      if (account?.provider === "google" && profile?.email) {
        const existing = await db.user.findFirst({
          where: { email: profile.email, deletedAt: null },
        });
        token.isNewUser = !existing;
        token.email = existing?.email || profile.email.toLowerCase();
        token.name = existing?.name || profile.name;
        token.userId = existing?.id || profile.sub;
      }
      if (account?.provider === "credentials" && user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.isNewUser = false;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: { id: token.userId, email: token.email, name: token.name },
        isNewUser: token.isNewUser,
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
