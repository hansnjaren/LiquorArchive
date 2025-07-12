// repositories/user.repository.ts
import { db } from "@/lib/prisma";
import { UserCreateInput } from "@/types/user.types";

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
