// types/drinkingLogStats.types.ts
export type DateAlcohol = { date: string; alcoholGram: number };
export type DrinkTypeMonth = {
  drinkTypeId: string;
  name: string;
  amountMl: number;
};

export type DrinkingLogStatsResponse = {
  datesWithDrinking: string[]; // "2025-07-02"
  dailyAlcoholGram: DateAlcohol[]; // 날짜별 g
  perDrinkTypeMl: DrinkTypeMonth[]; // 월 총 ml
};
