// repositories/drinkType.repository.ts

import { db } from "@/lib/prisma";
import { DrinkTypeSummary } from "@/types/drinkType.types";

export async function getAllDrinkTypes(): Promise<DrinkTypeSummary[]> {
  const drinkTypes = await db.drinkType.findMany({
    select: {
      id: true,
      name: true,
      abv: true,
      standardMl: true,
      iconUrl: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return drinkTypes.map((drinkType) => ({
    ...drinkType,
    abv: drinkType.abv.toNumber(),
    standardMl: drinkType.standardMl.toNumber(),
  }));
}
