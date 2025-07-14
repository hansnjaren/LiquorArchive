// repositories/user.repository.ts
import { db } from "@/lib/prisma";
import { UserCreateInput } from "@/types/user.types";
import { id } from "zod/locales";

export async function createUserInDB(data: UserCreateInput) {
  return await db.user.create({
    data,
  });
}

export async function findUserByEmail(email: string) {
  return db.user.findFirst({
    where: {
      email: email.toLowerCase(), // 대소문자 구분 없이 처리
      deletedAt: null, // soft delete 고려
    },
  });
}

export async function updateUserInDB(
  id: string,
  data: { name?: string; image?: string | null; gender?: "MALE" | "FEMALE" }
) {
  const user = await db.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.deletedAt !== null) {
    throw new Error("User already deleted");
  }

  return db.user.update({
    where: { id },
    data,
  });
}

export async function softDeleteUser(id: string) {
  // deletedAt가 null이 아닌 경우에만 삭제할수 있도록
  const user = await db.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.deletedAt !== null) {
    throw new Error("User already deleted");
  }

  return db.user.update({
    where: { id },
    data: { deletedAt: new Date() }, // soft delete 처리
  });
}
