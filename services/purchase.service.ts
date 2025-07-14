// services/purchase.service.ts
import { z } from "zod";
import {
  CreatePurchaseBody,
  PurchaseCollectionItem,
  UpdatePurchaseBody,
} from "@/types/purchase.types";
import {
  ParsedPurchaseData,
  createPurchaseWithValidation,
  findPurchaseByUserId,
  getPurchaseCollectionByUser,
  updatePurchaseById,
  deletePurchaseById,
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

// ✅ Zod 스키마 정의
const UpdatePurchaseSchema = z.object({
  purchaseDate: z.coerce.date().optional(), // ✅ string → Date 자동 변환
  quantity: z.number().int().positive().optional(),
  price: z.number().int().positive().optional(),
  place: z.string().optional(),
  memo: z.string().optional(),
});

// 파싱 결과용 type
export type ParsedUpdatePurchaseData = {
  purchaseDate?: Date;
  quantity?: number;
  price?: number;
  place?: string;
  memo?: string;
};

export async function updatePurchase(
  raw: unknown,
  purchaseId: string,
  userId: string
) {
  const parsed: ParsedUpdatePurchaseData = UpdatePurchaseSchema.parse(raw);
  return await updatePurchaseById(purchaseId, userId, {
    ...parsed,
    purchaseDate: parsed.purchaseDate
      ? parsed.purchaseDate.toISOString()
      : undefined,
  });
}

export async function deletePurchase(purchaseId: string, userId: string) {
  return await deletePurchaseById(purchaseId, userId);
}
