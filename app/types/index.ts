export interface Bottle {
  id: string;
  name: string;
  category: string;
  imageUrl?: string | undefined | null;
}

export interface Purchase {
  id: string;
  userId: string;
  bottleId: string;
  purchaseDate: string;
  price: number;
  place?: string | null;
  memo?: string | null;
  createdAt?: string;
  updatedAt?: string;
  quantity: number;
}

export interface DrinkType {
  id: string;
  name: string;
  abv: number;
  standardMl: number;
  iconUrl?: string | null;
}

export interface DrinkLogDrink {
  drinkTypeId: string;
  amountMl: number;
  drinkType?: DrinkType;
}

export interface DrinkLog {
  id: string;
  userId: string;
  date: string;
  locationName?: string;
  locationLat?: number;
  locationLng?: number;
  feelingScore?: number;
  note?: string;
  drinks: DrinkLogDrink[];
}