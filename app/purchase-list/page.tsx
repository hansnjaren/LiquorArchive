"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PurchaseList from "../components/PurchaseList";
import PurchaseHeader from "../components/PurchaseHeader";
import PurchaseSearchInput from "../components/PurchaseSearchInput";
import PurchaseModalManager from "../components/PurchaseModalManager";
import PurchaseSkeletonItem from "../components/PurchaseSkeletonItem";
import type { Purchase, Bottle } from "../types";

// DB 연동 fetch 함수
async function fetchPurchases(): Promise<Purchase[]> {
  const res = await fetch("/api/purchases/me", { credentials: "include" });
  // if (!res.ok) throw new Error("구매 내역을 불러오지 못했습니다.");
  return res.json();
}
async function fetchBottles(): Promise<Bottle[]> {
  const res = await fetch("/api/bottles");
  // if (!res.ok) throw new Error("술 목록을 불러오지 못했습니다.");
  return res.json();
}

export default function UserPurchaseListPage() {
  const { data: session, status } = useSession();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [search, setSearch] = useState("");

  // 최초 로딩
  useEffect(() => {
    if (status !== "authenticated") return;
    setLoading(true);
    Promise.all([fetchPurchases(), fetchBottles()])
      .then(([purchases, bottles]) => {
        setPurchases(purchases);
        setBottles(bottles);
      })
      .catch((e) => alert(e.message))
      .finally(() => setLoading(false));
  }, [status]);

  // 세션 유저 정보
  const userId = session?.user?.id;

  // 로딩 중 스켈레톤 출력
  if (status === "loading" || loading) {
    return (
      <div className="p-6 h-[calc(100vh-80px)] overflow-hidden transition-all duration-300">
        <PurchaseHeader count={0} onAdd={() => {}} />
        <PurchaseSearchInput value={search} onChange={setSearch} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <PurchaseSkeletonItem key={i} />
          ))}
        </div>
      </div>
    );
  }

  // 로그인 안 되어 있으면 안내
  if (!userId) {
    return <div className="p-6 text-red-500">로그인이 필요합니다.</div>;
  }

  // 유저 구매 내역 정렬
  const userPurchases = purchases
    .filter((p) => p.userId === userId)
    .sort(
      (a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
    );

  // 검색 필터
  const filteredPurchases = search
    ? userPurchases.filter((purchase) => {
        const bottle = bottles.find((b) => b.id === purchase.bottleId);
        if (!bottle) return false;
        const keyword = search.trim().toLowerCase();
        if (!keyword) return true;
        const isNumber = !isNaN(Number(keyword)) && keyword !== "";
        return (
          bottle.name?.toLowerCase().includes(keyword) ||
          bottle.category?.toLowerCase().includes(keyword) ||
          (bottle.country ?? "").toLowerCase().includes(keyword) ||
          purchase.place?.toLowerCase().includes(keyword) ||
          purchase.memo?.toLowerCase().includes(keyword) ||
          (isNumber &&
            purchase.price !== null &&
            purchase.price !== undefined &&
            purchase.price.toString().includes(keyword))
        );
      })
    : userPurchases;

  // CRUD 핸들러
  const handleAdd = async (
    newPurchase: Omit<Purchase, "id" | "createdAt" | "updatedAt" | "userId"> & {
      bottleId: string;
    }
  ) => {
    const res = await fetch("/api/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newPurchase),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert("추가 실패: " + (err.message ?? res.status));
      return;
    }
    const created = await res.json();
    setPurchases((prev) => [...prev, created]);
  };

  const handleEdit = async (updated: Purchase) => {
    const { id, bottleId, ...body } = updated;
    const res = await fetch(`/api/purchases/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert("수정 실패: " + (err.message ?? res.status));
      return;
    }
    const result = await res.json();
    setPurchases((prev) => prev.map((p) => (p.id === id ? result : p)));
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/purchases/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert("삭제 실패: " + (err.message ?? res.status));
      return;
    }
    setPurchases((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6 min-h-screen overflow-auto transition-all duration-300">
      <PurchaseHeader
        count={filteredPurchases.length}
        onAdd={() => setShowAddModal(true)}
      />
      <PurchaseSearchInput value={search} onChange={setSearch} />

      {filteredPurchases.length === 0 ? (
        <div className="text-gray-500 mt-4">구매 내역이 없습니다.</div>
      ) : (
        <PurchaseList
          purchases={filteredPurchases}
          bottles={bottles}
          onItemClick={(purchase) => {
            setSelectedPurchase(purchase);
            setShowDetailModal(true);
          }}
        />
      )}

      {/* 모달 매니저 */}
      <PurchaseModalManager
        showAdd={showAddModal}
        showDetail={showDetailModal}
        selected={selectedPurchase}
        bottles={bottles}
        onCloseAdd={() => setShowAddModal(false)}
        onSubmitAdd={async (newPurchase) => {
          await handleAdd(newPurchase);
          setShowAddModal(false);
        }}
        onCloseDetail={() => setShowDetailModal(false)}
        onEdit={async (updated) => {
          await handleEdit(updated);
          setShowDetailModal(false);
        }}
        onDelete={async (id) => {
          await handleDelete(id);
          setShowDetailModal(false);
        }}
      />
    </div>
  );
}
