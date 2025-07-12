// app/api/user/route.ts

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Create a new user
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
 *               - name
 *               - gender
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE]
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Email already exists
 */

import { userCreateSchema } from "@/validators/user.validator";
import { NextResponse } from "next/server";
import { createUser } from "@/services/user.service";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = userCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const user = await createUser(parsed.data);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "이미 사용 중인 이메일입니다."
    ) {
      return NextResponse.json(
        { error: "이미 가입된 이메일!" },
        { status: 409 }
      );
    }

    console.error("Unhanled error in POST /api/user:", error);
    return NextResponse.json(
      { error: "아직 해결이 되지 않은 오류" },
      { status: 500 }
    );
  }
}
