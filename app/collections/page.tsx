"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BottleSearchInput } from "../components/BottleSearchInput";
import { BottleGrid } from "../components/BottleGrid";
import type { Bottle, Purchase } from "../types";

async function fetchBottles(): Promise<Bottle[]> {
  const res = await fetch("/api/bottles");
  if (!res.ok) throw new Error("술 목록을 불러오지 못했습니다.");
  return res.json();
}
async function fetchPurchases(): Promise<Purchase[]> {
  const res = await fetch("/api/purchases/me", { credentials: "include" });
  if (!res.ok) throw new Error("구매 내역을 불러오지 못했습니다.");
  return res.json();
}

export default function BottleListPage() {
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;
    setLoading(true);
    Promise.all([fetchBottles(), fetchPurchases()])
      .then(([bottles, purchases]) => {
        setBottles(bottles);
        setPurchases(purchases);
      })
      .catch(e => alert(e.message))
      .finally(() => setLoading(false));
  }, [status]);

  const userId = session?.user?.id;

  if (status === "loading" || loading) return <div className="p-6">로딩 중...</div>;
  if (!userId) return <div className="p-6 text-red-500">로그인이 필요합니다.</div>;

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
      (bottle.country ?? "").toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="p-6">
      <BottleSearchInput value={search} onChange={setSearch} />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <BottleGrid bottles={filteredBottles} purchases={purchases} userId={userId} />
      </div>
    </div>
  );
}
