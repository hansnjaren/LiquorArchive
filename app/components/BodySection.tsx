// components/BodySection.tsx
"use client"

import { OVERLAY_BG_LIGHT, OVERLAY_BG_DARK } from "../constants";

interface BodySectionProps {
  videoSrc: string;
  latestPurchaseDateStr: string;
  recentTotalQuantity: number;
  recentTotalSpent: number;
  formatDate: (dateStr: string) => string;
}

export function BodySection({
  videoSrc,
  latestPurchaseDateStr,
  recentTotalQuantity,
  recentTotalSpent,
  formatDate,
}: BodySectionProps) {
  return (
    <div id="body" className="w-full">
      <div className="relative h-[50vh] w-full grid place-items-center bg-gray-500 overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover object-center"
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
        ></video>
        <div 
            className="relative z-10 flex rounded-xl"
            style={{backgroundColor: OVERLAY_BG_LIGHT}}>
            <Block
                title="최근 구입 일자"
                data={formatDate(latestPurchaseDateStr)}
            />
            <Block
                title="구입 병 수"
                data={`${recentTotalQuantity} 병`}
            />
            <Block
                title="구매액"
                data={`${recentTotalSpent} 원`}
            />
        </div>
      </div>
    </div>
  );
}

function Block({ title, data }: { title: string; data: string }) {
  return (
    <div 
      className="w-[200px] h-[200px] mx-[20px] my-[20px] flex flex-col justify-center items-center rounded-lg"
      style={{backgroundColor: OVERLAY_BG_DARK}}>
      <div
        className={`text-center text-white w-full text-2xl m-[8px]`}
      >
        {title}
      </div>
      <div
        className={`text-center text-white w-full text-xl`}
      >
        {data}
      </div>
    </div>
  );
}
