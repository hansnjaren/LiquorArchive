import { db } from "@/lib/prisma";
import { HomeStat } from "@/types/homeStat.types";

export async function getHomeStatFromDB(
  userId: string,
  last30Start: Date
): Promise<HomeStat> {
  const [latestPurchase] = await db.purchase.findMany({
    where: { userId },
    orderBy: { purchaseDate: "desc" },
    take: 1,
    include: { bottle: { select: { name: true } } },
  });

  const drinkingLogs = await db.drinkingLog.findMany({
    where: {
      userId,
      date: { gte: last30Start },
    },
    select: { date: true },
  });

  const uniqueDays = new Set(
    drinkingLogs.map((log) => log.date.toISOString().split("T")[0])
  );

  return {
    recentPurchaseDate:
      latestPurchase?.purchaseDate.toISOString().split("T")[0] ?? "없음",
    recentPurchaseBottleName: latestPurchase?.bottle.name ?? "없음",
    drinkingDaysLast30: uniqueDays.size,
  };
}
