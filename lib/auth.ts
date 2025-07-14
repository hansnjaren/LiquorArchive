// lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "./prisma";

export async function getLoggedInUser() {
  const session = await getServerSession(authOptions);
  console.log("세션 정보:", session);

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findFirst({
    where: {
      email: session.user.email,
      deletedAt: null,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
