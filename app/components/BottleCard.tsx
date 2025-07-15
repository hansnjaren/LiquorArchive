import { getHomeStat } from "@/services/homeStat.service";
import { CARD_COLOR, TAB_LIST_COLOR } from "../constants";
import type { Bottle, Purchase } from "../types";
import { useSession } from "next-auth/react";

const PLACEHOLDER_IMAGE = "/noImage.png";

function formatDateKorean(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}년 ${mm}월 ${dd}일`;
}

export function BottleCard({
  bottle,
  purchases,
  userId,
}: {
  bottle: Bottle;
  purchases: Purchase[];
  userId: string;
}) {
  // 총 구매 병수
  const totalQuantity = purchases
    .filter((p) => p.userId === userId && p.bottleId === bottle.id)
    .reduce((sum, p) => sum + (p.quantity ?? 0), 0);

  // 가장 최근 구매일
  const latestPurchase = purchases
    .filter((p) => p.userId === userId && p.bottleId === bottle.id)
    .sort((a, b) => (a.purchaseDate > b.purchaseDate ? -1 : 1))[0];
  const latestPurchaseDate = latestPurchase
    ? formatDateKorean(latestPurchase.purchaseDate)
    : "-";
  
  return (
    <div
      className="border rounded-xl shadow p-4 flex flex-col gap-2"
      style={{ backgroundColor: TAB_LIST_COLOR }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = CARD_COLOR)}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = TAB_LIST_COLOR)}
    >
      <div className="w-full h-40 mb-2 flex items-center justify-center overflow-hidden rounded-lg">
        <img
          src={bottle.imageUrl ?? PLACEHOLDER_IMAGE}
          alt={bottle.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="text-lg font-bold">{bottle.name}</div>
      <div>
        <span className="font-semibold">카테고리:</span> {bottle.category}
      </div>
      <div>
        <span className="font-semibold">국가:</span> {bottle.country ?? "-"}
      </div>
      <div>
        <span className="font-semibold">내 구매 병수:</span>{" "}
        <span className="text-blue-600 font-bold">{totalQuantity}병</span>
      </div>
      <div>
        <span className="font-semibold">가장 최근 구매일:</span>{" "}
        <span className="text-green-700 font-semibold">
          {latestPurchaseDate}
        </span>
      </div>
    </div>
  );
}
