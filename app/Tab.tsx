import Link from "next/link";

export function Tab({
  text,
  dir,
  isHover,
  onMouseOver,
  onMouseLeave,
}: {
  text: string;
  dir: string;
  isHover?: boolean;
  onMouseOver?: () => void;
  onMouseLeave?: () => void;
}) {
  return (
    <Link
      href={dir}
      className={
        "p-[16px] inline-block cursor-pointer transition-colors" +
        (isHover ? " bg-gray-200" : " bg-white")
      }
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      {text}
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