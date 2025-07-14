// app/social-signup/page.tsx
"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { set } from "zod";

export default function SocialSignupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const emailParam = params.get("email") ?? "";
  const [gender, setGender] = useState<"MALE" | "FEMALE" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ① 기존 유저면 홈으로 */
  useEffect(() => {
    console.log("Session status:", status, session);
    if (status === "loading") return; // 세션 로딩 중이면 아무것도 하지 않음
    if (status !== "authenticated") return;

    if (session?.isNewUser === true) {
      console.log("신규 소셜 유저입니다, stay");
      return;
    }

    console.log("이미 로그인된 유저입니다, redirecting to home");
    router.replace("/"); // 이미 로그인된 유저는 홈으로 리다이렉트
  }, [status, session, router]);

  /* ② 가입 완료 */
  const handleSubmit = async () => {
    if (!gender || !session?.user?.name || !session?.user?.email) return; // gender guard 추가
    setLoading(true);

    try {
      const res = await fetch("/api/user/social-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
          gender,
        }),
      });

      if (res.ok) {
        await signIn("google", { callbackUrl: "/", redirect: true });
      } else {
        let errorMessage = "가입 실패";
        try {
          const json = await res.json();
          errorMessage = json.error ?? errorMessage;
        } catch {}
        setError(errorMessage);
      }
    } catch {
      setError("네트워크 오류");
    } finally {
      setLoading(false);
    }
  };

  /* ③ 세션 없고 ?email 파라미터도 없는 경우 → 구글 버튼 */
  if (status === "unauthenticated" && !emailParam) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>소셜 회원가입</h1>
        <button
          onClick={() =>
            signIn("google", {
              callbackUrl: "/social-signup",
              prompt: "select_account",
              redirect: true,
            })
          }
        >
          Google로 계속하기
        </button>
      </main>
    );
  }

  /* 신규 유저 → 성별 입력 폼 */
  return (
    <main style={{ padding: "2rem" }}>
      <h1>추가 정보 입력</h1>
      <p>{session?.user?.name ?? "사용자"}님, 성별을 선택해주세요</p>

      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => setGender("MALE")}
          style={{
            background: gender === "MALE" ? "lightblue" : "white",
            marginRight: "1rem",
          }}
        >
          남성
        </button>
        <button
          onClick={() => setGender("FEMALE")}
          style={{ background: gender === "FEMALE" ? "lightpink" : "white" }}
        >
          여성
        </button>
      </div>

      <button disabled={!gender || loading} onClick={handleSubmit}>
        {loading ? "가입 중…" : "가입 완료"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}
