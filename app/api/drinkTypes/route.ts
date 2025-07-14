// app/api/drinkTypes/route.ts

/**
 * @swagger
 * /api/drinkTypes:
 *   get:
 *     summary: 주종 목록 조회 (드롭다운용)
 *     description: 드롭다운 등에서 사용될 전체 주종 리스트를 반환합니다.
 *     tags: [DrinkType]
 *     responses:
 *       200:
 *         description: 주종 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "cmp9f8q000ucm2ewd0gsxct"
 *                   name:
 *                     type: string
 *                     example: "소주"
 *                   abv:
 *                     type: number
 *                     format: float
 *                     example: 17.0
 *                   iconUrl:
 *                     type: string
 *                     nullable: true
 *                     example: "https://example.com/icons/soju.png"
 *       500:
 *         description: 서버 오류
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchAllDrinkTypes } from "@/services/drinkType.service";

export async function GET(req: NextRequest) {
  try {
    const result = await fetchAllDrinkTypes();
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("GET /drinkTypes error:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
