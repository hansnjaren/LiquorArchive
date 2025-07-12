// app/social-login/page.tsx
"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SocialLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ✅ 이미 로그인되어 있으면 홈으로 이동
  useEffect(() => {
    if (status === "unauthenticated") return;

    if (status === "authenticated") {
      if (session?.isNewUser === true) {
        console.log("신규 소셜 유저입니다.");
        router.replace("/social-signup"); // 신규 유저는 가입 페이지로 이동
        return;
      }
      router.replace("/"); // 이미 로그인된 유저는 홈으로 리다이렉트
    }
  }, [status, router]);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>로그인</h1>
      <button
        onClick={() =>
          signIn("google", {
            callbackUrl: "/social-login", // 로그인 후 다시 이 페이지로 돌아오게, 그다음 이제 홈으로 redirection
            prompt: "select_account", // 계정 선택 UI 항상 뜨게
          })
        }
      >
        Google로 로그인
      </button>
    </main>
  );
}
