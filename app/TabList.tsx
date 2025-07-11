import React, { useState, ReactNode, ReactElement } from "react";

export function TabList({ children }: { children: ReactNode }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  // children에 idx를 자동 부여
  const childrenWithIdx = React.Children.map(children, (child, idx) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as ReactElement<any>, {
        idx,
        isHover: hoverIdx === idx,
        onMouseOver: () => setHoverIdx(idx),
        onMouseLeave: () => setHoverIdx(null),
      });
    }
    return child;
  });

  return (
    <div className="w-full flex justify-center">
      {childrenWithIdx}
    </div>
  );
}

// 마우스 클릭 시 회색 유지되는 버전
// import React, { useState, ReactNode, ReactElement } from "react";
// import { TabContext } from "./TabContext";

// export function TabList({ children }: { children: ReactNode }) {
//   const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
//   const [hoverIdx, setHoverIdx] = useState<number | null>(null);

//   const childrenWithIdx = React.Children.map(children, (child, idx) => {
//     if (React.isValidElement(child)) {
//       return React.cloneElement(child as ReactElement<any>, { idx });
//     }
//     return child;
//   });

//   return (
//     <TabContext.Provider
//       value={{ selectedIdx, setSelectedIdx, hoverIdx, setHoverIdx }}
//     >
//       <div className="w-full flex justify-center">
//         {childrenWithIdx}
//       </div>
//     </TabContext.Provider>
//   );
// }