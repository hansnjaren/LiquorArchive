// app/api/profileStats/route.ts

/**
 * @swagger
 * /api/profileStats:
 *   get:
 *     summary: 유저의 총 구매 병 수 및 음주 일 수 통계 조회
 *     description: 로그인한 유저의 전체 주류 구매 횟수 및 음주한 날짜 수를 반환합니다.
 *     tags: [ProfileStats]
 *     responses:
 *       200:
 *         description: 유저 통계 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPurchaseCount:
 *                   type: integer
 *                   example: 12
 *                   description: 유저가 구입한 총 병 수
 *                 totalDrinkingDays:
 *                   type: integer
 *                   example: 8
 *                   description: 유저가 음주한 날짜 수
 *       401:
 *         description: 인증되지 않음
 *       500:
 *         description: 서버 오류
 */

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { getProfileStat } from "@/services/profileStat.service";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  // 유저가 로그인하지 않은 경우
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await getProfileStat(userId);
    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /profileStats error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
