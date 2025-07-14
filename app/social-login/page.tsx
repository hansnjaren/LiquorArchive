// app/social-login/page.tsx
"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TITLE_COLOR } from "../constants";
import Image from "next/image";

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
    <div className="p-8 w-[40%] min-w-[300px] justify-center mx-auto">
      <div 
        id="login-title"
        className="flex text-3xl w-full p-8 justify-center"
        >
        Login
      </div>
      <div
        id="login-default"
        className="w-full my-2"
      >
        <div>Email</div>
        <input
          className="block w-full p-2 border border-black rounded-xl"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div
          className="mt-4"
        >
          Password
        </div>
        <input
          className="block w-full p-2 border border-black rounded-xl"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          id="login-button"
          className="flex justify-center w-full mt-8 p-2 text-white rounded-xl cursor-pointer"
          style={{ backgroundColor: TITLE_COLOR }}
          onClick={handleGeneralLogin}
        >
          로그인
        </button>
        <div
          className="pt-2"
          style={{ 
            color: TITLE_COLOR,
          }}
        >
          {error ? error : <span style={{ opacity: 0 }}>placeholder</span>}
        </div>
      </div>
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div 
        id="social-login"
        className="relative w-full rounded-xl flex justify-center items-center cursor-pointer p-2 text-white"
        style={{backgroundColor: TITLE_COLOR}}
        onClick={() =>
          signIn("google", {
            callbackUrl: "/social-login", // 로그인 후 다시 이 페이지로 돌아오게, 그다음 이제 홈으로 redirection
            prompt: "select_account", // 계정 선택 UI 항상 뜨게
          })
        }
      >
        <Image 
          src="/GoogleLogo.png"
          alt="/noImage.png"
          width={24}
          height={24}
          className="mr-2"
        ></Image>
        <div>
          Google로 로그인
        </div>
      </div>
        <div style={{
          width: "100px",
          height: "100px",
          backgroundImage: "url('/GoogleLogo.png')",
        }}></div>
        
    </div>
  );
}