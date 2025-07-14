// services/purchase.service.ts
import { z } from "zod";
import {
  CreatePurchaseBody,
  PurchaseCollectionItem,
} from "@/types/purchase.types";
import {
  ParsedPurchaseData,
  createPurchaseWithValidation,
  findPurchaseByUserId,
  getPurchaseCollectionByUser,
} from "@/repositories/purchase.repository";

// ✅ Zod 스키마 정의 (string → Date 변환)
const CreatePurchaseSchema = z.object({
  bottleId: z.string(),
  purchaseDate: z.coerce.date(),
  quantity: z.number().int().positive(),
  price: z.number().int().positive().optional(),
  place: z.string().optional(),
  memo: z.string().optional(),
});

export async function createPurchase(raw: CreatePurchaseBody, userId: string) {
  const parsed: ParsedPurchaseData = CreatePurchaseSchema.parse(raw); // purchaseDate: Date
  return await createPurchaseWithValidation(userId, parsed);
}

export async function getMyPurchases(userId: string) {
  // 유저의 모든 구매 내역 조회
  return await findPurchaseByUserId(userId);
}

export async function getMyPurchaseCollection(
  userId: string
): Promise<PurchaseCollectionItem[]> {
  const raw = await getPurchaseCollectionByUser(userId);

  // Prisma 결과 → 우리가 정의한 응답 형식으로 변환
  return raw.map((item) => ({
    bottleId: item.bottleId,
    quantity: item._sum.quantity ?? 0, // 혹시 null이면 0으로
  }));
}
