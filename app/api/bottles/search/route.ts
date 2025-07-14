// app/api/bottles/search/route.ts

/**
 * @swagger
 * /api/bottles/search:
 *   get:
 *     summary: 이름 + 카테고리로 Bottle 검색 (이름은 부분검색 가능! 일단 영어만 ㅠㅠ)
 *     tags: [Bottle]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: false
 *         description: 이름 검색어 (부분 일치, 대소문자 무시)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [WHISKY, WINE, BRANDY, RUM, TEQUILA, SAKE, TRADITIONAL, CHINESE, OTHER]
 *         required: false
 *         description: 카테고리 필터
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           minimum: 0
 *         required: false
 *         description: 건너뛸 개수
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         required: false
 *         description: 가져올 개수 (기본 20)
 *     responses:
 *       200:
 *         description: 검색된 Bottle 목록
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
import { getBottlesBySearch } from "@/services/bottle.service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const skip = Number(searchParams.get("skip") ?? 0);
  const takeRaw = Number(searchParams.get("take") ?? 999);
  const take = Math.min(Math.max(takeRaw, 1), 999); // 1~32 제한

  try {
    const bottles = await getBottlesBySearch({ q, category, skip, take });
    return NextResponse.json(bottles, { status: 200 });
  } catch (err) {
    console.error("[GET /api/bottles/search] 에러:", err);
    return NextResponse.json({ error: "검색 실패" }, { status: 500 });
  }
}
