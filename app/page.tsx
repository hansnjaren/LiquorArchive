"use client";

import Image from "next/image";
import purchases from "./data/purchase.json";
import { userId } from "./constants";
import { BodySection } from "./components/BodySection";

const testTexts = [
  "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG.", 
  "다람쥐 헌 쳇바퀴에 타고파.",
  "the quick brown fox jumps over the lazy dog.",
  "따람쮜 헌 촀빠퀴예 따꼬파."
]

const colorList = [
  [26, 34, 54],    // 딥 네이비 (#1A2236)
  [35, 41, 70],    // 네이비 블루 (#232946)
  [245, 246, 250], // 라이트 그레이 (#F5F6FA)
  [255, 215, 0],   // 골드 (#FFD700)
  [178, 34, 52],   // 버건디 (#B22234)
  [132, 20, 34],   // 카민 (#841422)
];

export default function Home() {
  const takanashiHoshino = "/32.jpg";

  // 현재 날짜 (예: 서버 시간 또는 new Date())
  const now = new Date(); // 실제 서비스에서는 new Date() 사용

  // 해당 유저의 구매 내역만 추출
  const userPurchases = purchases.filter((p) => p.userId === userId);

  // 가장 최근 구입 일자 문자열 추출
  const latestPurchaseDateStr = userPurchases.length
    ? userPurchases
        .map((p) => p.purchaseDate)
        .sort((a, b) => (a > b ? -1 : 1))[0]
    : "";

  // 최근 30일간 구입 병 수 및 총액
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const recentPurchases = userPurchases.filter(
    (p) => new Date(p.purchaseDate) >= thirtyDaysAgo
  );

  const recentTotalQuantity = recentPurchases.reduce(
    (sum, p) => sum + (p.quantity ?? 0),
    0
  );
  const recentTotalSpent = recentPurchases.reduce(
    (sum, p) => sum + (p.price ?? 0) * (p.quantity ?? 0),
    0
  );

  return (
    <div className="grid place-items-center w-full">
      <BodySection
        videoSrc="title.mp4"
        latestPurchaseDateStr={latestPurchaseDateStr}
        recentTotalQuantity={recentTotalQuantity}
        recentTotalSpent={recentTotalSpent}
        formatDate={formatDate}
      />
      <div id="footer" className="w-[60%]">
        <div className="text-5xl">Placeholder</div>
        <div className="text-4xl">Smoooooooooooooth Operatooooor</div>
        <div className="m-16">
          <div className="text-5xl">Color Test</div>
          <div className="flex gap-2">
            {colorList.map((rgb) => (
              <div
                key={rgb.join('-')}
                className="w-16 h-16 rounded"
                style={{ backgroundColor: `rgb(${rgb.join(',')})` }}
              />
            ))}
          </div>
        </div>
        <Image
          src={takanashiHoshino}
          width={0}
          height={0}
          alt="23.jpg"
          style={{ width: "100%", height: "auto" }}
          sizes="100vw"
        ></Image>
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "구입 내역 없음";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "구입 내역 없음";

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}년 ${mm}월 ${dd}일`;
}

