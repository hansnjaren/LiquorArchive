// app api/purchases/me/route.ts

/**
 * @swagger
 * /api/purchases/me:
 *   get:
 *     summary: 나의 구매 내역 조회
 *     description: 로그인한 사용자의 전체 구매 기록을 반환합니다.
 *     tags:
 *       - Purchase
 *     responses:
 *       200:
 *         description: 구매 내역 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "ckxyz789..."
 *                   userId:
 *                     type: string
 *                   bottleId:
 *                     type: string
 *                   purchaseDate:
 *                     type: string
 *                     format: date-time
 *                   quantity:
 *                     type: integer
 *                     example: 2
 *                   price:
 *                     type: integer
 *                     example: 15000
 *                   place:
 *                     type: string
 *                     example: "GS25"
 *                   memo:
 *                     type: string
 *                     example: "특가로 구입함"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: 인증되지 않은 사용자
 *       500:
 *         description: 서버 오류
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getMyPurchases } from "@/services/purchase.service";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const result = await getMyPurchases(userId);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("Get purchases error:", err);
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
