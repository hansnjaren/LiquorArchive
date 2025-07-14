// repositories/drinkingLogStats.repository.ts

import { db } from "@/lib/prisma";

export async function fetchDrinkingLogsInRange(
  userId: string,
  start: Date,
  end: Date
) {
  return db.drinkingLog.findMany({
    where: { userId, date: { gte: start, lt: end } },
    include: {
      drinks: {
        include: { drinkType: { select: { name: true, abv: true } } },
      },
    },
    orderBy: { date: "asc" },
  });
}
