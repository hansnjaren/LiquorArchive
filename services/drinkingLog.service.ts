// services/drinkingLog.service.ts

import { z } from "zod";
import { CreateDrinkingLogBody } from "@/types/drinkingLog.types";
import { createDrinkingLogWithDrinks } from "@/repositories/drinkingLog.repository";
import { db } from "@/lib/prisma";

const CreateDrinkingLogSchema = z.object({
  date: z.coerce.date(),
  locationName: z.string().optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  feelingScore: z.number().int().min(1).max(5),
  note: z.string().optional(),
  drinks: z
    .array(
      z.object({
        drinkTypeId: z.string().cuid(),
        amountMl: z.number().positive(),
      })
    )
    .nonempty(),
});

export async function createDrinkingLog(raw: unknown, userId: string) {
  const parsed: CreateDrinkingLogBody = {
    ...CreateDrinkingLogSchema.parse(raw),
    date: CreateDrinkingLogSchema.parse(raw).date.toISOString(),
  };

  const {
    date,
    locationName,
    locationLat,
    locationLng,
    feelingScore,
    note,
    drinks,
  } = parsed;

  // drinkTypeId 검증
  const drinkTypeIds = drinks.map((d) => d.drinkTypeId);
  const existingDrinkTypes = await db.drinkType.findMany({
    where: {
      id: { in: drinkTypeIds },
    },
    select: { id: true },
  });

  const existingDrinkTypeIds = new Set(existingDrinkTypes.map((d) => d.id));
  const invalidIds = drinkTypeIds.filter((id) => !existingDrinkTypeIds.has(id));
  if (invalidIds.length > 0) {
    throw new Error(`Invalid drinkTypeIds: ${invalidIds.join(", ")}`);
  }

  return await createDrinkingLogWithDrinks(
    userId,
    {
      date: new Date(date),
      locationName,
      locationLat,
      locationLng,
      feelingScore,
      note,
    },
    drinks
  );
}
