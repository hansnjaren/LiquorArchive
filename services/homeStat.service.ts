// services/homeStat.service.ts

import { getHomeStatFromDB } from "@/repositories/homeStat.repository";
import { HomeStat } from "@/types/homeStat.types";
import { subDays, startOfDay } from "date-fns";

export async function getHomeStat(userId: string): Promise<HomeStat> {
  const now = new Date();
  const last30Start = startOfDay(subDays(now, 30));

  return await getHomeStatFromDB(userId, last30Start);
}
