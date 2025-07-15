import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getMonthlyDrinkingStats } from "@/services/drinkingLogStats.service";

/**
 * @swagger
 * /api/drinkingLogs/stats:
 *   get:
 *     summary: 월별 음주 통계
 *     description: 달력 표시·날짜별 알코올 섭취량·주종별 총량을 반환합니다.
 *     tags: [DrinkingLogs]
 *     parameters:
 *       - in: query
 *         name: month
 *         required: false
 *         description: 조회할 월 (YYYY-MM). 기본값은 이번 달.
 *         schema:
 *           type: string
 *           pattern: "^[0-9]{4}-[0-9]{2}$"
 *     responses:
 *       200:
 *         description: 월 통계
 *       401:
 *         description: 인증 필요
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const month =
    req.nextUrl.searchParams.get("month") ??
    new Date().toISOString().slice(0, 7); // YYYY-MM

  try {
    const stats = await getMonthlyDrinkingStats(session.user.id, month);
    return NextResponse.json(stats);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
