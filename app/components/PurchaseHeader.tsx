import { TITLE_COLOR } from "../constants";

export default function PurchaseHeader({ count, onAdd }: { count: number; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold">
        내 구매 내역 ({count})
      </h2>
      <button
        onClick={onAdd}
        className="text-white px-4 py-2 rounded cursor-pointer transition"
        style={{ backgroundColor: `${TITLE_COLOR}`}}
      >
        구매 내역 추가
      </button>
    </div>
  );
}
