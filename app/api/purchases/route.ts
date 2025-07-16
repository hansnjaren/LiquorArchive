// app/api/purchases/route.ts

/**
 * @swagger
 * /api/purchases:
 *   post:
 *     summary: 구매 내역 추가
 *     description: 로그인한 유저의 구매 기록을 저장합니다. 세션 기반 인증이 필요합니다.
 *     tags:
 *       - Purchase
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bottleId
 *               - purchaseDate
 *               - quantity
 *             properties:
 *               bottleId:
 *                 type: string
 *                 example: "ckxyz123..."
 *               purchaseDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-13"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               price:
 *                 type: integer
 *                 example: 15000
 *               place:
 *                 type: string
 *                 example: "GS25"
 *               memo:
 *                 type: string
 *                 example: "할인해서 삼"
 *     responses:
 *       201:
 *         description: 구매 내역이 성공적으로 등록됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 bottleId:
 *                   type: string
 *                 purchaseDate:
 *                   type: string
 *                   format: date-time
 *                 quantity:
 *                   type: integer
 *                 price:
 *                   type: integer
 *                 place:
 *                   type: string
 *                 memo:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: 잘못된 요청 (JSON 형식 오류)
 *       401:
 *         description: 인증되지 않은 사용자
 *       500:
 *         description: 서버 오류
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { createPurchase } from "@/services/purchase.service";
import { CreatePurchaseBody } from "@/types/purchase.types";

export async function POST(req: NextRequest) {
  // 1. 세션에서 userId 확보
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // 2. 요청 body 파싱
  let body: CreatePurchaseBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  try {
    // 3. 서비스 호출 (Zod 파싱 & repo 처리 내부에서 수행)
    const result = await createPurchase(body, userId);
    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    console.error("Purchase creation error:", err);
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
