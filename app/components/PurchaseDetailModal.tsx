import type { Bottle, Purchase } from "../types";

export default function PurchaseDetailModal({
  purchase,
  bottle,
  onClose,
}: {
  purchase: Purchase;
  bottle: Bottle | undefined;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          aria-label="닫기"
        >
          ×
        </button>
        <h3 className="text-xl font-bold mb-4 text-center">구매 내역 상세</h3>
        <div className="space-y-2">
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
      </div>
    </div>
  );
}
