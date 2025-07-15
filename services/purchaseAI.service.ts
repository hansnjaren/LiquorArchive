// services/purchaseAI.service.ts
import { db } from "@/lib/prisma";
import { findPurchaseByUserIdRecent10 } from "@/repositories/purchase.repository";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface PurchaseWithBottle {
  purchaseDate: Date;
  quantity: number;
  price?: number | null;
  bottle: {
    name: string;
    category: string;
  };
}

export async function buildPurchaseSummary(userId: string): Promise<string> {
  const purchases = await findPurchaseByUserIdRecent10(userId);

  if (purchases.length === 0) {
    return "최근 구매 내역이 없습니다.";
  }

  const list = purchases
    .map((p: PurchaseWithBottle) => {
      const date = p.purchaseDate.toISOString().slice(0, 10);
      const { name, category } = p.bottle;
      return `• ${name} (${category}) ${p.quantity}개 – ${
        p.price ?? "?"
      }₩ @ ${date}`;
    })
    .join("\n");

  const messages = [
    {
      role: "system" as const,
      content:
        "당신은 친절하고 전문적인 한국인 소믈리에입니다. 사용자가 남긴 최근 구매 내역을 바탕으로, 어울리는 술을 2가지 추천해 주세요. 추천 시 각 술이 어울리는 이유를 간단하고 설득력 있게 설명해 주세요. 추천은 한국어로 제공해야 합니다.",
    },
    {
      role: "user" as const,
      content: `최근 구매 내역입니다:\n${list}\n\n이 내역을 바탕으로 어울리는 술을 2가지 추천해 주세요 (이유 포함, 한국어로 답변)`,
    },
  ];

  const { choices } = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  const content = choices[0]?.message?.content;
  if (!content) return "AI 응답이 없습니다.";
  return content.trim();
}
