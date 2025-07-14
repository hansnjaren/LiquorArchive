// types/purchase.types.ts

export type CreatePurchaseBody = {
  bottleId: string;
  purchaseDate: string;
  quantity: number;
  price?: number;
  place?: string;
  memo?: string;
};

export type PurchaseResponse = {
  id: string;
  userId: string;
  bottleId: string;
  purchaseDate: string;
  quantity: number;
  price?: number;
  place?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};
