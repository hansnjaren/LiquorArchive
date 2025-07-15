// app/api/purchases/[id]/route.ts

/**
 * @swagger
 * /api/purchases/{id}:
 *   put:
 *     summary: 구매 내역 수정
 *     description: 특정 구매 ID에 해당하는 구매 내역을 수정합니다. bottleId는 수정할 수 없습니다.
 *     tags:
 *       - Purchases
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 수정할 구매 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               purchaseDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-07-14T09:00:00.000Z"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               price:
 *                 type: integer
 *                 example: 30000
 *               place:
 *                 type: string
 *                 example: "이마트"
 *               memo:
 *                 type: string
 *                 example: "할인 행사 중 구매"
 *     responses:
 *       200:
 *         description: 수정된 구매 내역 반환
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PurchaseResponse"
 *       401:
 *         description: 인증되지 않은 사용자
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * /api/purchases/{id}:
 *   delete:
 *     summary: 구매 내역 삭제
 *     description: 특정 구매 ID에 해당하는 구매 내역을 삭제합니다.
 *     tags: [Purchases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 삭제할 구매 ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: 삭제 완료
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 구매 내역 없음 또는 권한 없음
 *       500:
 *         description: 서버 오류
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { updatePurchase, deletePurchase } from "@/services/purchase.service";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id: purchaseId } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  try {
    const updated = await updatePurchase(body, purchaseId, session.user.id);
    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    console.error("Update error:", err);
    return NextResponse.json(
      { message: err.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id: purchaseId } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await deletePurchase(purchaseId, session.user.id);
    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    const msg = err.message ?? "Internal Server Error";
    const status = /not found|access denied/i.test(msg) ? 404 : 500;
    return NextResponse.json({ message: msg }, { status });
  }
}
