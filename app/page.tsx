"use client"

import Image from "next/image";
import { Block } from "./components";
import purchases from "./data/purchase.json";
import { userId } from "./constants";

export default function Home() {
  const takanashiHoshino = "/32.jpg"

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
    (sum, p) => sum + ((p.price ?? 0) * (p.quantity ?? 0)),
    0
  );

  return (
    <div className="grid justify-center w-full">
      <div id="body">
        <div className="relative h-[50vh] w-[60vw] grid place-items-center bg-gray-500 overflow-hidden">
          <video className="absolute top-0 left-0 w-full h-full object-cover object-center" src="title.mp4" autoPlay loop muted playsInline></video>
          <div className="relative z-10 w-[530px] h-[190px] bg-gray-300/50 flex rounded">
            <Block title="최근 구입 일자" data={`${ formatDate(latestPurchaseDateStr) }`}></Block>
            <Block title="구입 병 수" data={`${ recentTotalQuantity } 병`}></Block>
            <Block title="구매액" data={`${ recentTotalSpent } 원`}></Block>
          </div>
        </div>
      </div>
      <div id="footer">
        <div className="text-5xl">Placeholder</div>
        <div className="text-4xl">Smoooooooooooooth Operatooooor</div>
        <Image src={takanashiHoshino} width={0} height={0} alt="23.jpg" style={{ width: '100%', height: 'auto' }} sizes="100vw"></Image>
      </div>
    </div>
  )
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "구입 내역 없음"; // 유효하지 않은 날짜 처리

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}년 ${mm}월 ${dd}일`;
}