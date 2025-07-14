// services/drinkingLog.service.ts

import { z } from "zod";
import {
  CreateDrinkingLogBody,
  UpdateDrinkingLogBody,
} from "@/types/drinkingLog.types";
import {
  createDrinkingLogWithDrinks,
  findDrinkingLogsByUser,
  patchDrinkingLogWithDrinks,
} from "@/repositories/drinkingLog.repository";
import { db } from "@/lib/prisma";
import { userId } from "@/app/constants";

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

export async function getMyDrinkingLogs(userId: string) {
  const logs = await findDrinkingLogsByUser(userId);
  return logs;
}

const UpdateDrinkingLogSchema = CreateDrinkingLogSchema.partial().extend({
  drinks: z
    .array(
      z.object({
        drinkTypeId: z.string().cuid(),
        amountMl: z.number().positive(),
      })
    )
    .optional(),
});

export async function updateDrinkingLog(
  userId: string,
  logId: string,
  raw: unknown
) {
  // ✅ 1. 입력 파싱 & 검증
  const parsed = UpdateDrinkingLogSchema.parse(raw) as UpdateDrinkingLogBody;

  // ✅ 2. 로그 존재 & 소유자 확인
  const log = await db.drinkingLog.findUnique({ where: { id: logId } });
  if (!log) throw new Error("NOT_FOUND");
  if (log.userId !== userId) throw new Error("FORBIDDEN");

  // ✅ 3. drinks 유효성 검사
  if (parsed.drinks) {
    const ids = parsed.drinks.map((d) => d.drinkTypeId);
    const valid = await db.drinkType.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
    const invalid = ids.filter((id) => !valid.some((v) => v.id === id));
    if (invalid.length) {
      throw new Error(`Invalid drinkTypeIds: ${invalid.join(", ")}`);
    }
  }

  // ✅ 4. Prisma 업데이트용 데이터 분리
  const { drinks, ...logFields } = parsed;

  const updateData = {
    ...logFields,
    date: logFields.date ? new Date(logFields.date) : undefined,
  };

  // ✅ 5. repository 트랜잭션 실행
  await patchDrinkingLogWithDrinks(logId, updateData, drinks);

  // ✅ 6. 최종 결과 반환
  return await db.drinkingLog.findUnique({
    where: { id: logId },
    include: {
      drinks: {
        include: { drinkType: true },
      },
    },
  });
}
