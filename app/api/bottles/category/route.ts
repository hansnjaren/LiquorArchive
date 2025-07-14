// app/api/bottles/category/route.ts

/**
 * @swagger
 * /api/bottles/category:
 *   get:
 *     summary: 카테고리로 Bottle 목록 조회
 *     tags: [Bottle]
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [WHISKY, WINE, BRANDY, RUM, TEQUILA, SAKE, TRADITIONAL, CHINESE, OTHER]
 *         description: 조회할 카테고리
 *       - in: query
 *         name: skip
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: 건너뛸 개수 (페이지네이션 시작점)
 *       - in: query
 *         name: take
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 32
 *         description: 조회할 개수 (기본 20, 최대 32)
 *     responses:
 *       200:
 *         description: Bottle 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/schemas/Bottle'
 *       400:
 *         description: 카테고리 누락
 *       500:
 *         description: 서버 오류
 */

import { NextRequest, NextResponse } from "next/server";
import { getBottlesByCategory } from "@/services/bottle.service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const skip = Number(searchParams.get("skip") ?? 0);
  const takeRaw = Number(searchParams.get("take") ?? 20);
  const take = Math.min(Math.max(takeRaw, 1), 32); // 1~32 제한

  if (!category) {
    return NextResponse.json(
      { error: "category 쿼리 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const bottles = await getBottlesByCategory({ category, skip, take });
    return NextResponse.json(bottles, { status: 200 });
  } catch (err) {
    console.error("[GET /api/bottles/category] 에러:", err);
    return NextResponse.json(
      { error: "서버 내부 오류로 데이터를 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}
