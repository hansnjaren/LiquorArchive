import type { Bottle, Purchase } from "../types";
import { useState, useRef } from "react";
import useLockBodyScroll from "../hooks/useLockBodyScroll";
import PurchaseEditModal from "./PurchaseEditModal";

interface Props {
  purchase: Purchase;
  bottle: Bottle | undefined;
  onClose: () => void;
  bottles: Bottle[];
  onEdit: (updated: Purchase) => void;
  onDelete: (id: string) => void;
}

export default function PurchaseDetailModal({
  purchase,
  bottle,
  onClose,
  bottles,
  onEdit,
  onDelete,
}: Props) {
  useLockBodyScroll(true); // body 스크롤 막기

  const [showEditModal, setShowEditModal] = useState(false);

  // 드래그 UX 개선
  const modalRef = useRef<HTMLDivElement>(null);
  const [dragStartedInside, setDragStartedInside] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current && modalRef.current.contains(e.target as Node)) {
      setDragStartedInside(true);
    } else {
      setDragStartedInside(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (dragStartedInside) {
      setDragStartedInside(false);
      return;
    }
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-modal-in"
        onMouseDown={handleMouseDown}
        onMouseUp={handleBackdropClick}
      >
        <div
          ref={modalRef}
          className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
            aria-label="닫기"
          >
            ×
          </button>
          <h3 className="text-xl font-bold mb-4 text-center">구매 내역 상세</h3>
          <div className="space-y-2 mb-6">
            <div>
              <strong>병 이름:</strong> {bottle?.name ?? "알 수 없음"}
            </div>
            <div>
              <strong>카테고리:</strong> {bottle?.category ?? "-"}
            </div>
            <div>
              <strong>구매일:</strong>{" "}
              {purchase.purchaseDate?.slice(0, 16).replace("T", " ") ?? "-"}
            </div>
            <div>
              <strong>가격:</strong>{" "}
              {purchase.price ? `${purchase.price.toLocaleString()}원` : "-"}
            </div>
            <div>
              <strong>장소:</strong> {purchase.place ?? "-"}
            </div>
            <div>
              <strong>병 수:</strong> {purchase.quantity ?? 1}병
            </div>
            {purchase.memo && (
              <div>
                <strong>메모:</strong> {purchase.memo}
              </div>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              onClick={() => setShowEditModal(true)}
            >
              수정
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => {
                if (window.confirm("정말 삭제하시겠습니까?")) {
                  onDelete(purchase.id);
                }
              }}
            >
              삭제
            </button>
          </div>
        </div>
      </div>
      {showEditModal && (
        <PurchaseEditModal
          purchase={purchase}
          bottles={bottles}
          onClose={() => setShowEditModal(false)}
          onSubmit={(updated) => {
            onEdit(updated);
          }}
        />
      )}
    </>
  );
}
