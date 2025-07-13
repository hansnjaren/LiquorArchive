// types/bottle.types.ts
export interface FindBottleByCategoryQuery {
  category?: string;
  skip: number;
  take: number;
}

export interface FindBottleBySearchQuery {
  q?: string; // 이름 검색 (부분 검색)
  category?: string; // 필터 (옵션)
  skip: number;
  take: number;
}

export interface FindBottleByIdParams {
  id: string;
}
