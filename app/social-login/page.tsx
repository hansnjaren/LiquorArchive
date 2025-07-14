// app/social-login/page.tsx
"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SocialLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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

  const handleGeneralLogin = async () => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      console.log("일반 로그인 성공!");
      setError("");
      router.replace("/");
    } else {
      setError("로그인 실패: 아이디 또는 비밀번호가 잘못되었습니다.");
    }
  };
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
      <hr style={{ margin: "2rem 0" }} />

      {/* 일반 로그인 */}
      <div>
        <h2>일반 로그인</h2>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", marginBottom: "1rem", width: "100%" }}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", marginBottom: "1rem", width: "100%" }}
        />
        <button onClick={handleGeneralLogin}>일반 로그인</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </main>
  );
}
