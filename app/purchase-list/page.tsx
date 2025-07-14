"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PurchaseList from "../components/PurchaseList";
import PurchaseHeader from "../components/PurchaseHeader";
import PurchaseSearchInput from "../components/PurchaseSearchInput";
import PurchaseModalManager from "../components/PurchaseModalManager";
import type { Purchase, Bottle } from "../types";

// DB 연동 fetch 함수
async function fetchPurchases(): Promise<Purchase[]> {
  const res = await fetch("/api/purchases/me", { credentials: "include" });
  if (!res.ok) throw new Error("구매 내역을 불러오지 못했습니다.");
  return res.json();
}
async function fetchBottles(): Promise<Bottle[]> {
  const res = await fetch("/api/bottles");
  if (!res.ok) throw new Error("술 목록을 불러오지 못했습니다.");
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
      .catch(e => alert(e.message))
      .finally(() => setLoading(false));
  }, [status]);

  // 세션에서 userId 추출
  const userId = session?.user?.id;

  // userId가 없는 경우(로그인 안됨)는 아무것도 보여주지 않음
  if (status === "loading" || loading) return <div className="p-6">로딩 중...</div>;
  if (!userId) return <div className="p-6 text-red-500">로그인이 필요합니다.</div>;

  // userId로 필터링 (혹시 API가 전체 구매 내역을 반환하는 경우를 대비)
  const userPurchases = purchases
    .filter((p) => p.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
    );

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
            purchase.price.toString().includes(keyword)
          )
        );
      })
    : userPurchases;

  // DB 연동 CRUD 핸들러
  const handleAdd = async (newPurchase: Omit<Purchase, "id" | "createdAt" | "updatedAt" | "userId"> & { bottleId: string }) => {
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
    // bottleId는 수정 불가이므로 제외
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
    <div className="p-6">
      <PurchaseHeader count={filteredPurchases.length} onAdd={() => setShowAddModal(true)} />
      <PurchaseSearchInput value={search} onChange={setSearch} />
      {filteredPurchases.length === 0 ? (
        <div className="text-gray-500">구매 내역이 없습니다.</div>
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
