import { BottleCategory, Prisma } from "@prisma/client";
import { db } from "@/lib/prisma";
import { FindBottleByCategoryQuery } from "@/types/bottle.types";

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
