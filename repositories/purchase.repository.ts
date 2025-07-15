// repositories/purchase.repository.ts

import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { UpdatePurchaseBody } from "@/types/purchase.types";

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

export async function findPurchaseByUserId(userId: string) {
  // 유저의 모든 구매 내역 조회
  return await db.purchase.findMany({
    where: { userId },
    orderBy: { purchaseDate: "desc" },
  });
}

// repositories/purchase.repository.ts

export async function getPurchaseCollectionByUser(userId: string) {
  return await db.purchase.groupBy({
    by: ["bottleId"],
    where: { userId },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc", // 혹은 최신순 정렬은 이후에 고려
      },
    },
  });
}

export async function updatePurchaseById(
  purchaseId: string,
  userId: string,
  updateData: Omit<UpdatePurchaseBody, "bottleId">
) {
  // 1️⃣ 존재 + 본인 소유 여부 확인
  const existing = await db.purchase.findUnique({
    where: { id: purchaseId },
    select: { userId: true },
  });

  if (!existing || existing.userId !== userId) {
    throw new Error("Purchase not found or access denied");
  }

  // 2️⃣ 실제 수정
  return await db.purchase.update({
    where: { id: purchaseId },
    data: {
      ...updateData,
      purchaseDate: updateData.purchaseDate
        ? new Date(updateData.purchaseDate)
        : undefined,
    },
  });
}

export async function deletePurchaseById(purchaseId: string, userId: string) {
  // 1️⃣ 존재 + 본인 소유 여부 확인
  const existing = await db.purchase.findUnique({
    where: { id: purchaseId },
    select: { userId: true },
  });

  if (!existing || existing.userId !== userId) {
    throw new Error("Purchase not found or access denied");
  }

  // 2️⃣ 실제 삭제
  return await db.purchase.delete({
    where: { id: purchaseId },
  });
}

export async function findPurchaseByUserIdRecent10(userId: string) {
  // 유저의 최근 10개 구매 내역 조회
  return await db.purchase.findMany({
    where: { userId },
    orderBy: { purchaseDate: "desc" },
    take: 10,
    include: {
      bottle: true, // 병 정보도 포함
    },
  });
}
