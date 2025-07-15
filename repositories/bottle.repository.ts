// repositories/bottle.repository.ts

import { BottleCategory, Prisma } from "@prisma/client";
import { db } from "@/lib/prisma";
import {
  FindBottleByCategoryQuery,
  FindBottleBySearchQuery,
  FindBottleByIdParams,
  FindAllBottleParams,
} from "@/types/bottle.types";

export async function findByCategory(params: FindBottleByCategoryQuery) {
  const { category, skip, take } = params;

  const where: Prisma.BottleWhereInput = {
    category: category as BottleCategory,
  };

  return db.bottle.findMany({
    where,
    skip,
    take,
    orderBy: { name: "asc" },
  });
}

// 성능을 생각해서 일단 front...
export async function findBySearch(params: FindBottleBySearchQuery) {
  const { q, category, skip, take } = params;

  const where: Prisma.BottleWhereInput = {
    name: {
      contains: q,
      mode: "insensitive", // 대소문자 구분 없이 검색
    },
    ...(category && { category: category as BottleCategory }), // 카테고리 필터링
  };

  console.log("검색 조건 : ", where);

  return db.bottle.findMany({
    where,
    skip,
    take,
    orderBy: { name: "asc" },
  });
}

export async function findById(params: FindBottleByIdParams) {
  const { id } = params;

  return db.bottle.findUnique({
    where: { id },
  });
}

export async function findAllBottles(params: FindAllBottleParams) {
  const { skip, take } = params;
  return db.bottle.findMany({
    skip,
    take,
    orderBy: { name: "asc" },
  });
}
