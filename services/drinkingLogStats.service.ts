// services/drinkingLogStats.service.ts

import { startOfMonth, addMonths } from "date-fns";
import { fetchDrinkingLogsInRange } from "@/repositories/drinkingLogStats.repository";
import { DrinkingLogStatsResponse } from "@/types/drinkingLogStats.types";

const GRAM_PER_ML_ETOH = 0.789; // 밀리리터 → 그램 환산계수

export async function getMonthlyDrinkingStats(
  userId: string,
  yyyymm: string // "2025-07"
): Promise<DrinkingLogStatsResponse> {
  const start = startOfMonth(new Date(`${yyyymm}-01T00:00:00Z`));
  const end = addMonths(start, 1);

  const logs = await fetchDrinkingLogsInRange(userId, start, end);

  /* ① 달력용 날짜 */
  const datesWithDrinking = Array.from(
    new Set(logs.map((l) => l.date.toISOString().split("T")[0]))
  );

  /* ② 날짜별 알코올 g */
  const dailyMap = new Map<string, number>();
  for (const log of logs) {
    const day = log.date.toISOString().split("T")[0];
    let gSum = dailyMap.get(day) ?? 0;
    for (const d of log.drinks) {
      gSum +=
        Number(d.amountMl ?? 0) *
        (Number(d.drinkType.abv) / 100) *
        GRAM_PER_ML_ETOH;
    }
    dailyMap.set(day, +gSum.toFixed(1));
  }
  const dailyAlcoholGram = [...dailyMap]
    .map(([date, alcoholGram]) => ({ date, alcoholGram }))
    .sort((a, b) => (a.date > b.date ? 1 : -1));

  /* ③ 주종별 월 총량 */
  const typeMap = new Map<string, { name: string; ml: number }>();
  for (const log of logs) {
    for (const d of log.drinks) {
      const key = d.drinkTypeId;
      const cur = typeMap.get(key) ?? { name: d.drinkType.name, ml: 0 };
      cur.ml += Number(d.amountMl);
      typeMap.set(key, cur);
    }
  }
  const perDrinkTypeMl = [...typeMap].map(([drinkTypeId, { name, ml }]) => ({
    drinkTypeId,
    name,
    amountMl: ml,
  }));

  return { datesWithDrinking, dailyAlcoholGram, perDrinkTypeMl };
}
