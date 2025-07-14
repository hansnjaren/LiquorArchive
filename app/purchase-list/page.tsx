"use client";
import { useState } from "react";
import bottles from "../data/bottle.json";
import initialPurchases from "../data/purchase.json";
import { userId } from "../constants";
import PurchaseList from "../components/PurchaseList";
import PurchaseHeader from "../components/PurchaseHeader";
import PurchaseSearchInput from "../components/PurchaseSearchInput";
import PurchaseModalManager from "../components/PurchaseModalManager";
import type { Purchase } from "../types";

export default function UserPurchaseListPage() {
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [search, setSearch] = useState("");

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

      // 숫자 입력 시 가격도 검사
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

  const handleAdd = (newPurchase: Purchase) => {
    setPurchases((prev) => [...prev, newPurchase]);
  };

  const handleEdit = (updated: Purchase) => {
    setPurchases((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleDelete = (id: string) => {
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
        onSubmitAdd={(newPurchase) => {
          handleAdd(newPurchase);
          setShowAddModal(false);
          alert("추가 완료!\n" + JSON.stringify(newPurchase, null, 2));
        }}
        onCloseDetail={() => setShowDetailModal(false)}
        onEdit={(updated) => {
          handleEdit(updated);
          setShowDetailModal(false);
          alert("수정 완료!\n" + JSON.stringify(updated, null, 2));
        }}
        onDelete={(id) => {
          handleDelete(id);
          setShowDetailModal(false);
          alert("삭제 완료!\n" + id);
        }}
      />
    </div>
  );
}
