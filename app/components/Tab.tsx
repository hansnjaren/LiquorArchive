"use client";

import Link from "next/link";
import { useState } from "react";

export function Tab({ text, dir }: { text: string; dir: string }) {
  const [isHover, setIsHover] = useState(false);

  return (
    <Link href={dir}>
      <div
        className={
          "p-[16px] inline-block cursor-pointer transition-colors" +
          (isHover ? " bg-gray-200" : " bg-white")
        }
        onMouseOver={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {text}
      </div>
    </Link>
  );
}

// 마우스 클릭 시 회색 유지되는 버전
// import { useTabContext } from "./TabContext";

// export function Tab({ text, dir, idx }: { text: string; dir: string; idx?: number }) {
//   const { selectedIdx, setSelectedIdx, hoverIdx, setHoverIdx } = useTabContext();
//   const myIdx = idx!;

// //   const isSelected = selectedIdx === myIdx && hoverIdx === null;
//   const isHover = hoverIdx === myIdx;

//   return (
//     <div
//       className={
//         "p-[16px] inline-block cursor-pointer transition-colors" +
//         (isHover
//           ? " bg-gray-200"
//         //   : isSelected
//         //   ? " bg-gray-200"
//           : " bg-white")
//       }
//       onMouseOver={() => {
//         setHoverIdx(myIdx);
//         setSelectedIdx(null);
//       }}
//       onMouseLeave={() => setHoverIdx(null)}
//       onClick={() => setSelectedIdx(myIdx)}
//     >
//       {text}
//     </div>
//   );
// }
