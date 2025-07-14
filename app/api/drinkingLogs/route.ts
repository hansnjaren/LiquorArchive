// app/api/drinkingLogs/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createDrinkingLog } from "@/services/drinkingLog.service";

/**
 * @swagger
 * /api/drinkingLogs:
 *   post:
 *     summary: 음주 기록 생성
 *     description: 사용자의 음주 기록(언제, 어디서, 얼마나 마셨는지)을 생성합니다.
 *     tags:
 *       - DrinkingLogs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-07-14T22:00:00.000Z"
 *               locationName:
 *                 type: string
 *                 example: "홍대 주점"
 *               locationLat:
 *                 type: number
 *                 example: 37.55555
 *               locationLng:
 *                 type: number
 *                 example: 126.9222
 *               feelingScore:
 *                 type: integer
 *                 example: 4
 *               note:
 *                 type: string
 *                 example: "즐거운 술자리였음"
 *               drinks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     drinkTypeId:
 *                       type: string
 *                       example: "abc123"
 *                     amountMl:
 *                       type: number
 *                       example: 500
 *     responses:
 *       201:
 *         description: 생성된 음주 기록 반환
 *       401:
 *         description: 인증되지 않음
 *       500:
 *         description: 서버 오류
 */

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  try {
    const result = await createDrinkingLog(body, userId);
    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    console.error("Drinking log creation error:", err);
    return NextResponse.json(
      { message: err.message ?? "Server error" },
      { status: 500 }
    );
  }
}
