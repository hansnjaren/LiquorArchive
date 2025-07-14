"use client";

import { useState } from "react";
import bottles from "../data/bottle.json";
import purchases from "../data/purchase.json";
import { userId } from "../constants";
import { BottleSearchInput } from "../components/BottleSearchInput";
import { BottleGrid } from "../components/BottleGrid";

export default function BottleListPage() {
  const [search, setSearch] = useState("");

  // 구매 병수가 1병 이상인 bottle만 추려서 표시
  const bottlesWithPurchase = bottles.filter((bottle) => {
    const totalQuantity = purchases
      .filter((p) => p.userId === userId && p.bottleId === bottle.id)
      .reduce((sum, p) => sum + (p.quantity ?? 0), 0);
    return totalQuantity > 0;
  });

  // 실시간 검색 필터
  const filteredBottles = bottlesWithPurchase.filter((bottle) => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return true;
    return (
      bottle.name?.toLowerCase().includes(keyword) ||
      bottle.category?.toLowerCase().includes(keyword) ||
      (bottle.country ?? "").toLowerCase().includes(keyword) ||
      (bottle.abv !== undefined && bottle.abv !== null && bottle.abv.toString().includes(keyword)) ||
      (bottle.volumeMl !== undefined && bottle.volumeMl !== null && bottle.volumeMl.toString().includes(keyword))
    );
  });

  return (
    <div className="p-6">
      <BottleSearchInput value={search} onChange={setSearch} />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <BottleGrid bottles={filteredBottles} />
      </div>
    </div>
  );
}
