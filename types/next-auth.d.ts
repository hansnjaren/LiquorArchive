// src/types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    /** 신규 소셜 유저 여부 */
    isNewUser?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** 신규 소셜 유저 여부 */
    isNewUser?: boolean;
    /** DB 저장된 유저 ID */
    userId?: string;
  }
}
