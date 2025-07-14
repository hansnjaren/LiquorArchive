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

export async function findDrinkingLogsByUser(userId: string) {
  return await db.drinkingLog.findMany({
    where: { userId },
    include: {
      drinks: {
        include: {
          drinkType: true, // 각 drinkType의 이름과 도수 정보도 포함
        },
      },
    },
    orderBy: { date: "desc" },
  });
}

export async function patchDrinkingLogWithDrinks(
  logId: string,
  data: Prisma.DrinkingLogUpdateInput,
  drinks?: { drinkTypeId: string; amountMl: number }[]
) {
  return await db.$transaction([
    // 1. 로그 정보 업데이트
    db.drinkingLog.update({
      where: { id: logId },
      data,
    }),

    // 2. drinks 교체 (있는 경우에만)
    ...(drinks
      ? [
          db.drinkingLogDrinkType.deleteMany({
            where: { drinkingLogId: logId },
          }),
          db.drinkingLogDrinkType.createMany({
            data: drinks.map((drink) => ({
              drinkingLogId: logId,
              drinkTypeId: drink.drinkTypeId,
              amountMl: drink.amountMl,
            })),
          }),
        ]
      : []),
  ]);
}
