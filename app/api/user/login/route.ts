// app/api/user/login/route.ts

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: 일반 로그인 (이메일/비밀번호)
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *       400:
 *         description: 잘못된 요청 형식
 *       401:
 *         description: 이메일 또는 비밀번호 불일치
 *       500:
 *         description: 서버 내부 오류
 */

import { userLoginSchema } from "@/validators/user.validator";
import { NextResponse } from "next/server";
import { loginUser } from "@/services/user.service";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = userLoginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  try {
    const token = await loginUser(email, password);
    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return NextResponse.json(
        { error: "이메일 또는 비밀번호가 잘못되었습니다." },
        { status: 401 }
      );
    }

    console.error("Unhandled error in POST /api/user/login:", error);
    return NextResponse.json(
      { error: "서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
