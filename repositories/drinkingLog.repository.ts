// repositories/drinkingLog.repository.ts

import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function createDrinkingLogWithDrinks(
  userId: string,
  data: Omit<Prisma.DrinkingLogCreateInput, "user" | "drinks">,
  drinks: { drinkTypeId: string; amountMl: number }[]
) {
  return await db.drinkingLog.create({
    data: {
      ...data,
      user: { connect: { id: userId } },
      drinks: {
        create: drinks.map((d) => ({
          drinkType: { connect: { id: d.drinkTypeId } },
          amountMl: d.amountMl,
        })),
      },
    },
    include: {
      drinks: true,
    },
  });
}
