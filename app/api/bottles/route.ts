/**
 * @swagger
 * /api/bottles:
 *   get:
 *     summary: 등록된 모든 Bottle 목록 조회
 *     tags: [Bottle]
 *     parameters:
 *       - in: query
 *         name: skip
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: 건너뛸 개수
 *       - in: query
 *         name: take
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 32
 *         description: 가져올 개수 (기본 20)
 *     responses:
 *       200:
 *         description: 전체 Bottle 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/schemas/Bottle"
 *       500:
 *         description: 서버 오류
 */

import { NextRequest, NextResponse } from "next/server";
import { getAllBottles } from "@/services/bottle.service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const skip = Number(searchParams.get("skip") ?? 0);
  const takeRaw = Number(searchParams.get("take") ?? 20);
  const take = Math.min(Math.max(takeRaw, 1), 32);

  try {
    const bottles = await getAllBottles({ skip, take });
    return NextResponse.json(bottles, { status: 200 });
  } catch (err) {
    console.error("[GET /api/bottles] 전체 조회 실패:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
