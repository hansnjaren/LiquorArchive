// app/api/drinkingLogs/me/route.ts

/**
 * @swagger
 * /api/drinkingLogs/me:
 *   get:
 *     summary: 나의 술자리 기록 전체 조회
 *     description: 로그인한 사용자의 술자리 기록을 날짜 기준으로 내림차순 정렬하여 반환합니다.
 *     tags:
 *       - DrinkingLogs
 *     responses:
 *       200:
 *         description: 유저의 술자리 기록 배열
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "log123"
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-07-14T21:00:00.000Z"
 *                   locationName:
 *                     type: string
 *                     example: "강남역 포차"
 *                   locationLat:
 *                     type: number
 *                     example: 37.498
 *                   locationLng:
 *                     type: number
 *                     example: 127.0276
 *                   feelingScore:
 *                     type: integer
 *                     example: 4
 *                   note:
 *                     type: string
 *                     example: "좋은 사람들과 함께한 술자리"
 *                   drinks:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         drinkTypeId:
 *                           type: string
 *                           example: "drink123"
 *                         amountMl:
 *                           type: number
 *                           example: 500
 *                         drinkType:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               example: "소주"
 *                             abv:
 *                               type: number
 *                               example: 16.5
 *                             standardMl:
 *                               type: number
 *                               example: 360
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getMyDrinkingLogs } from "@/services/drinkingLog.service";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const logs = await getMyDrinkingLogs(session.user.id);
    return NextResponse.json(logs, { status: 200 });
  } catch (err: any) {
    console.error("Get logs error:", err);
    return NextResponse.json(
      { message: err.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}
