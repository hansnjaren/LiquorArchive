// services/profileStat.service.ts

import {
  countTotalPurchases,
  countDistinctDrinkingDates,
} from "@/repositories/profileStat.repository";

import { ProfileStat } from "@/types/profileStat.types";

export async function getProfileStat(userId: string): Promise<ProfileStat> {
  const [totalPurchaseCount, totalDrinkingDays] = await Promise.all([
    countTotalPurchases(userId),
    countDistinctDrinkingDates(userId),
  ]);

  return {
    totalPurchaseCount,
    totalDrinkingDays,
  };
}
