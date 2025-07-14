// app/api/purchases/collection/route.ts
/**
 * @swagger
 * /api/purchases/collection:
 *   get:
 *     summary: 구매 컬렉션 조회
 *     description: 로그인한 사용자의 구매 기록을 bottleId 기준으로 그룹화하여 보여줍니다. 동일한 술(bottleId)은 quantity를 합산합니다.
 *     tags:
 *       - Purchase
 *     responses:
 *       200:
 *         description: bottleId별 구매 합산 결과
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   bottleId:
 *                     type: string
 *                     example: "cmd1blrpm0001cmbs1gchneuy"
 *                   quantity:
 *                     type: integer
 *                     example: 5
 *       401:
 *         description: 인증되지 않은 사용자
 *       500:
 *         description: 서버 오류
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getMyPurchaseCollection } from "@/services/purchase.service";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const result = await getMyPurchaseCollection(userId);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("Get purchase collection error:", err);
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
