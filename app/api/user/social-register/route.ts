// app/api/user/social-register/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { socialUserCreateSchema } from "@/validators/user.validator";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("수신된 body:", body);

    const parsed = socialUserCreateSchema.safeParse(body);
    if (!parsed.success) {
      console.log("유효성 검사 실패:", parsed.error);
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { email, name, gender } = parsed.data;

    // 중복 검사
    const existingUser = await db.user.findFirst({
      where: { email: email.toLowerCase(), deletedAt: null },
    });

    if (existingUser) {
      if (existingUser.password === null) {
        return NextResponse.json(
          { error: "이미 소셜 가입이 완료된 계정입니다." },
          { status: 409 }
        );
      } else {
        return NextResponse.json(
          { error: "이미 일반 가입이 완료된 계정입니다." },
          { status: 409 }
        );
      }
    }

    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        gender,
        password: null, // 소셜 가입이므로 패스워드는 null
      },
    });
    console.log("새 유저 생성 완료!:", user.id);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("소셜 회원가입 실패:", error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
