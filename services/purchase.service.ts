// services/purchase.service.ts
import { z } from "zod";
import { CreatePurchaseBody } from "@/types/purchase.types";
import {
  ParsedPurchaseData,
  createPurchaseWithValidation,
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
