//app/api/homeStates/route.ts

/**
 * @swagger
 * /api/homeStats:
 *   get:
 *     summary: 홈 통계 정보 조회
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: 홈 통계
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recentPurchaseDate:
 *                   type: string
 *                   example: "2025-06-20"
 *                 recentPurchaseBottleName:
 *                   type: string
 *                   example: "Absolut Vodka"
 *                 drinkingDaysLast30:
 *                   type: number
 *                   example: 10
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getHomeStat } from "@/services/homeStat.service";

export async function GET(_: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const stat = await getHomeStat(userId);
  return NextResponse.json(stat);
}
