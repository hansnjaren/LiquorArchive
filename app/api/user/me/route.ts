// app/api/user/me/route.ts

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: 현재 로그인된 유저 정보 조회
 *     description: 세션 기반으로 현재 로그인된 유저의 정보를 반환합니다.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: 유저 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 gender:
 *                   type: string
 *                   enum: [MALE, FEMALE]
 *                 image:
 *                   type: string
 *                   nullable: true
 *       401:
 *         description: 로그인되지 않은 상태
 *       404:
 *         description: 유저를 찾을 수 없음
 *
 *   put:
 *     summary: 현재 로그인된 유저 정보 수정
 *     description: 이름, 성별, 프로필 이미지를 수정합니다.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 정태희
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE]
 *               image:
 *                 type: string
 *                 nullable: true
 *                 example: https://example.com/profile.png
 *     responses:
 *       200:
 *         description: 수정된 유저 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 image:
 *                   type: string
 *                   nullable: true
 *       401:
 *         description: 인증되지 않은 사용자
 *       404:
 *         description: 유저를 찾을 수 없음
 *
 *   delete:
 *     summary: 현재 로그인된 유저 탈퇴
 *     description: 세션을 기반으로 해당 유저를 soft delete 처리합니다.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: 회원 탈퇴 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 회원 탈퇴 완료
 *       401:
 *         description: 인증되지 않은 사용자
 *       404:
 *         description: 유저를 찾을 수 없음
 *       400:
 *         description: 이미 탈퇴한 유저입니다.
 */

import { getLoggedInUser } from "@/lib/auth";
import { updateUser, deleteUser } from "@/services/user.service";
import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const user = await getLoggedInUser();

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      gender: user.gender,
      image: user.image,
    });
  } catch (e: any) {
    const message = e.message || "Internal Server Error";
    const status =
      message === "Unauthorized"
        ? 401
        : message === "User not found"
        ? 404
        : 500;

    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getLoggedInUser();
    const form = await req.formData();
    const file = form.get("file") as Blob | null;
    let imageUrl: string | null = null;

    if (file) {
      const ext = file.type.split("/")[1] ?? "png";
      const path = `users/${user.id}/${Date.now()}.${ext}`;
      const { data: uploadData, error: uploadError } = await sb.storage
        .from("media")
        .upload(path, file, { upsert: true });
      if (uploadError)
        return NextResponse.json({ error: uploadError }, { status: 500 });

      const { data: urlData } = sb.storage
        .from("media")
        .getPublicUrl(uploadData.path);
      imageUrl = urlData.publicUrl;
    }

    const name = form.get("name");
    const gender = form.get("gender");

    const updated = await updateUser(user.id, {
      name: typeof name === "string" ? name : undefined,
      gender: typeof gender === "string" ? (gender as any) : undefined,
      image: imageUrl,
    });

    return NextResponse.json({
      id: updated.id,
      email: updated.email,
      name: updated.name,
      gender: updated.gender,
      image: updated.image,
    });
  } catch (e: any) {
    const status =
      e.message === "Unauthorized"
        ? 401
        : e.message === "User not found"
        ? 404
        : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}

export async function DELETE() {
  try {
    const user = await getLoggedInUser(); // 로그인 유저 가져오기
    await deleteUser(user.id);

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (e: any) {
    const message = e.message || "Internal Server Error";
    const status =
      message === "User not found"
        ? 404
        : message === "User already deleted"
        ? 400
        : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
