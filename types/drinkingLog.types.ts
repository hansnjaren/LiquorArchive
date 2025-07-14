// types/drinkingLog.types.ts

export type DrinkInput = {
  drinkTypeId: string;
  amountMl: number;
};

export type CreateDrinkingLogBody = {
  date: string;
  locationName?: string;
  locationLat?: number;
  locationLng?: number;
  feelingScore: number;
  note?: string;
  drinks: DrinkInput[];
};
