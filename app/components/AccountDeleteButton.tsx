// components/AccountDeleteButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AccountDeleteButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!window.confirm("정말로 회원 탈퇴를 진행하시겠습니까?")) return;
    setLoading(true);
    setError("");

    try {
      // 1. 탈퇴 요청
      const res = await fetch("/api/user/me", {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        // 2. 로그아웃 요청 (next-auth 사용 기준)
        await signOut({ redirect: false });

        // 3. 홈 화면 리다이렉트
        router.push("/");
      } else {
        const data = await res.json();
        setError(data?.error ?? "회원 탈퇴에 실패했습니다.");
      }
    } catch (err: any) {
      setError(err?.message ?? "서버 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition disabled:opacity-50"
      >
        {loading ? "탈퇴 처리 중..." : "회원 탈퇴"}
      </button>
    </div>
  );
}
