// types/homeStat.types.ts

export type HomeStat = {
  recentPurchaseDate: string; // ISO date string (e.g., "2025-06-20")
  recentPurchaseBottleName: string; // e.g., "Absolut Vodka"
  drinkingDaysLast30: number; // e.g., 10
};
