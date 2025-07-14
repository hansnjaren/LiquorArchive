"use client";

import Link from "next/link";
import { useState } from "react";
import { TAB_LIST_COLOR } from "../constants";

export function Tab({ text, dir }: { text: string; dir: string }) {
  const [isHover, setIsHover] = useState(false);

  return (
    <Link href={dir}>
      <div
        className={
          "px-[32px] py-[16px] mx-[16px] inline-block cursor-pointer transition-colors" +
          (isHover ? " bg-gray-200" : ` ${TAB_LIST_COLOR}`)
        }
        onMouseOver={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {text}
      </div>
    </Link>
  );
}
