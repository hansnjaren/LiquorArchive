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
