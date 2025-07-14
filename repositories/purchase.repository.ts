// repositories/purchase.repository.ts

import { db } from "@/lib/prisma";

export type ParsedPurchaseData = {
  bottleId: string;
  purchaseDate: Date;
  quantity: number;
  price?: number;
  place?: string;
  memo?: string;
};

export async function createPurchaseWithValidation(
  userId: string,
  data: ParsedPurchaseData
) {
  // ✅ 유저 존재 여부 확인
  const user = await db.user.findUnique({
    where: { id: userId, deletedAt: null },
    select: { id: true },
  });
  if (!user) throw new Error("User not found");

  // ✅ Bottle 존재 여부 확인
  const bottle = await db.bottle.findUnique({
    where: { id: data.bottleId },
    select: { id: true },
  });
  if (!bottle) throw new Error("Bottle not found");

  // ✅ 실제 저장
  return await db.purchase.create({
    data: {
      ...data,
      userId,
    },
  });
}
