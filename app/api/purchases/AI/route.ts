/**
 * @swagger
 * /api/purchases/AI:
 *   get:
 *     summary: 구매 요약 및 추천 AI 분석
 *     description: 최근 10건 구매 데이터를 GPT로 요약하고, 추천을 포함한 인사이트를 반환합니다.
 *     tags:
 *       - Purchase
 *     responses:
 *       200:
 *         description: AI 분석 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 insights:
 *                   type: string
 *                   example: "요약 및 추천 텍스트..."
 *       401:
 *         description: 인증되지 않은 사용자
 *       500:
 *         description: 서버 오류 또는 AI 분석 실패
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { buildPurchaseSummary } from "@/services/purchaseAI.service";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const insights = await buildPurchaseSummary(session.user.id);
    return NextResponse.json({ insights }, { status: 200 });
  } catch (err: any) {
    console.error("Get AI insights error:", err);
    return NextResponse.json(
      { message: err.message || "AI 분석 실패" },
      { status: 500 }
    );
  }
}
