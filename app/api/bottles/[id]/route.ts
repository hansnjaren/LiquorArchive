// app/api/bottles/[id]/route.ts

/**
 * @swagger
 * /api/bottles/{id}:
 *   get:
 *     summary: Bottle 단건 조회
 *     tags: [Bottle]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 Bottle ID
 *     responses:
 *       200:
 *         description: Bottle 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/schemas/Bottle'
 *       404:
 *         description: 해당 Bottle이 존재하지 않음
 *       500:
 *         description: 서버 오류
 */

import { NextRequest, NextResponse } from "next/server";
import { getBottleById } from "@/services/bottle.service";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  // 동기처럼 params 사용하고 싶다면 await를 붙여야 합니다
  const { id } = await context.params;

  try {
    const bottle = await getBottleById({ id });
    if (!bottle) {
      return NextResponse.json({ error: "Bottle not found" }, { status: 404 });
    }
    return NextResponse.json(bottle);
  } catch (err) {
    console.error("[GET /api/bottles/:id] 오류:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
