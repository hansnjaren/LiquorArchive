"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BottleSearchInput } from "../components/BottleSearchInput";
import { BottleGrid } from "../components/BottleGrid";
import { BottleSkeletonCard } from "../components/BottleSkeletonCard";
import type { Bottle, Purchase } from "../types";

async function fetchBottles(): Promise<Bottle[]> {
  const res = await fetch("/api/bottles");
  // if (!res.ok) throw new Error("술 목록을 불러오지 못했습니다.");
  return res.json();
}
async function fetchPurchases(): Promise<Purchase[]> {
  const res = await fetch("/api/purchases/me", { credentials: "include" });
  // if (!res.ok) throw new Error("구매 내역을 불러오지 못했습니다.");
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
      .catch((e) => alert(e.message))
      .finally(() => setLoading(false));
  }, [status]);

  const userId = session?.user?.id;

  // ✅ 여기서부터 스켈레톤 보여주기
  if (status === "loading" || loading) {
    return (
      <div className="p-6 h-[calc(100vh-80px)] overflow-hidden">
        <BottleSearchInput value={search} onChange={setSearch} />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <BottleSkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!userId) {
    return <div className="p-6 text-red-500">로그인이 필요합니다.</div>;
  }

  // 필터링된 구매 병 bottle 목록
  const bottlesWithPurchase = bottles.filter((bottle) => {
    const totalQuantity = purchases
      .filter((p) => p.userId === userId && p.bottleId === bottle.id)
      .reduce((sum, p) => sum + (p.quantity ?? 0), 0);
    return totalQuantity > 0;
  });

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
    <div className="p-6 min-h-screen overflow-auto transition-all duration-300">
      <BottleSearchInput value={search} onChange={setSearch} />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-4">
        <BottleGrid
          bottles={filteredBottles}
          purchases={purchases}
          userId={userId}
        />
      </div>
    </div>
  );
}
