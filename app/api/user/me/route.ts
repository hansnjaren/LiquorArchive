// app/api/user/me/route.ts
import { getLoggedInUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getLoggedInUser();

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
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
