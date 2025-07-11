"use client"

import Link from "next/link"
import { Dispatch, SetStateAction, useState } from "react"

export function Block( { text }: { text: string } ) {
    return (
          <div className="w-[100px] h-[100px] bg-gray-300 ml-[10px] mt-[10px] flex justify-center items-center rounded">
            <span className="text-center w-full">{ text }</span>
          </div>
    )
}

const tabList = [
  { text: "Tab 1", dir: "one" },
  { text: "Tab 2", dir: "two" },
  { text: "Tab 3", dir: "three" },
];

// export default function TabGroup() {
//   const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
//   const [hoverIdx, setHoverIdx] = useState<number | null>(null);

//   return (
//     <div className="w-full flex justify-center">
//       {tabList.map((tab, idx) => (
//         <Tab
//           key={tab.dir}
//           text={tab.text}
//           dir={tab.dir}
//           isSelected={selectedIdx === idx && hoverIdx === null}
//           isHover={hoverIdx === idx}
//           onMouseOver={() => {
//                 setHoverIdx(idx)
//                 setSelectedIdx(null)
//             }}
//           onMouseLeave={() => setHoverIdx(null)}
//           onClick={() => setSelectedIdx(idx)}
//         />
//       ))}
//     </div>
//   );
// }

// export function Tab({
//   text,
//   dir,
//   isSelected,
//   isHover,
//   onMouseOver,
//   onMouseLeave,
//   onClick,
// }: {
//   text: string;
//   dir: string;
//   isSelected: boolean;
//   isHover: boolean;
//   onMouseOver: () => void;
//   onMouseLeave: () => void;
//   onClick: () => void;
// }) {
//   return (
//     <div
//       className={
//         "p-[16px] inline-block cursor-pointer transition-colors" +
//         (isHover
//           ? " bg-gray-200"
//           : isSelected
//           ? " bg-gray-200"
//           : " bg-white")
//       }
//       onMouseOver={onMouseOver}
//       onMouseLeave={onMouseLeave}
//       onClick={onClick}
//     >
//       {text}
//     </div>
//   );
// }


function tabClick( setClicked: Dispatch<SetStateAction<boolean>>) {
    setClicked(true)
}

function tabOnMouse( text: string ) {
    alert(`Hello, you're coming into ${ text }`)
}

function tabOutMouse( text: string ) {
    alert(`Bye, you're leaving ${ text }`)
}