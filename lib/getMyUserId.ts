// lib/getMyUserId.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function getMyUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized: no user id in session");
  }
  return session.user.id;
}
