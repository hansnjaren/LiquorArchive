"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { TAB_LIST_COLOR } from "../constants";
import { useSession } from "next-auth/react";

export function Tab({ text, dir }: { text: string; dir: string }) {
  const [isHover, setIsHover] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  // 현재 경로가 이 탭의 dir과 일치하면 하이라이트
  // (예: /collections, /purchase-list, /log-calendar)
  const isActive = pathname === `/${dir}`;

  // social-login 페이지에서는 어떤 탭도 하이라이트하지 않음
  const isSocialLogin = pathname === "/social-login";

  return (
    <Link
      href={session ? `/${dir}` : "/social-login"}
    >
      <span className="invisible font-bold absolute">{text}</span>
      <span
        className={
          "px-[12px] md:px-[32px] py-[16px] md:mx-[16px] inline-block cursor-pointer transition-colors" +
          (isActive && !isSocialLogin ? ` bg-gray-200 font-bold` : ` ${TAB_LIST_COLOR}`) +
          (isHover ? " bg-gray-200" : "")
        }
        onMouseOver={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {text}
      </span>
    </Link>
  );
}
