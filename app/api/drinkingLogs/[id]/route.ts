// app/api/drinkingLogs/[id]/route.ts

/**
 * @swagger
 * /api/drinkingLogs/{id}:
 *   patch:
 *     summary: 음주 기록 수정
 *     description: 특정 음주 기록의 일부 또는 전체를 수정합니다.
 *     tags: [DrinkingLogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 수정할 음주 기록의 ID
 *         schema:
 *           type: string
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
 *                 example: "2024-06-01T22:00:00.000Z"
 *               locationName:
 *                 type: string
 *                 example: "홍대 포차거리"
 *               locationLat:
 *                 type: number
 *                 format: float
 *                 example: 37.555
 *               locationLng:
 *                 type: number
 *                 format: float
 *                 example: 126.923
 *               feelingScore:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               note:
 *                 type: string
 *                 example: "재밌는 하루였다."
 *               drinks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     drinkTypeId:
 *                       type: string
 *                       example: "cmp9f8q000ucm2ewd0gsxct"
 *                     amountMl:
 *                       type: number
 *                       format: float
 *                       example: 500
 *     responses:
 *       200:
 *         description: 성공적으로 수정된 음주 기록
 *       400:
 *         description: 잘못된 입력 (ex. drinkTypeId가 유효하지 않음)
 *       401:
 *         description: 인증되지 않음
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 해당 음주 기록 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/drinkingLogs/{id}:
 *   delete:
 *     summary: 음주 기록 삭제
 *     description: 특정 음주 기록을 삭제합니다.
 *     tags: [DrinkingLogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 삭제할 음주 기록의 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 성공적으로 삭제됨
 *       401:
 *         description: 인증되지 않음
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 해당 음주 기록 없음
 *       500:
 *         description: 서버 오류
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  updateDrinkingLog,
  deleteDrinkingLog,
} from "@/services/drinkingLog.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const logId = params.id;
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  try {
    const updated = await updateDrinkingLog(userId, logId, body);
    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    if (err instanceof Error) {
      if (err.message === "NOT_FOUND") {
        return NextResponse.json(
          { message: "Drinking log not found" },
          { status: 404 }
        );
      }
      if (err.message === "FORBIDDEN") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
      if (err.message.startsWith("Invalid drinkTypeIds")) {
        return NextResponse.json({ message: err.message }, { status: 400 });
      }
    }

    console.error("PATCH /drinkingLogs/:id error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const logId = params.id;

  try {
    const deleted = await deleteDrinkingLog(userId, logId);
    return NextResponse.json(deleted, { status: 200 });
  } catch (err: any) {
    if (err instanceof Error) {
      if (err.message === "NOT_FOUND") {
        return NextResponse.json(
          { message: "Drinking log not found" },
          { status: 404 }
        );
      }
      if (err.message === "FORBIDDEN") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }

    console.error("DELETE /drinkingLogs/:id error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
