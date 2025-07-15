// repositories/profileStat.repository.ts

import { db } from "@/lib/prisma";

export async function countTotalPurchases(userId: string): Promise<number> {
  return db.purchase.count({
    where: { userId },
  });
}

export async function countDistinctDrinkingDates(
  userId: string
): Promise<number> {
  const distinctDates = await db.drinkingLog.groupBy({
    by: ["date"],
    where: { userId },
  });
  return distinctDates.length; // 날짜별로만 중복 없이 집계
}
