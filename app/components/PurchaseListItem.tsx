import { CARD_COLOR, TAB_LIST_COLOR } from "../constants";
import type { Bottle, Purchase } from "../types";

export default function PurchaseListItem({
  purchase,
  bottle,
  onClick,
}: {
  purchase: Purchase;
  bottle: Bottle | undefined;
  onClick: () => void;
}) {
  return (
    <li
      className="border rounded-lg shadow p-4 bg-white flex gap-4 items-center cursor-pointer"
      style={{ backgroundColor: `${TAB_LIST_COLOR}`}}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${CARD_COLOR}`)}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = `${TAB_LIST_COLOR}`)}
      onClick={onClick}
    >
      <div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
        <img
          src={bottle?.imageUrl ?? "/noImage.png"}
          alt={bottle?.name ?? "알 수 없음"}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex-1">
        <div className="text-lg font-bold">{bottle?.name ?? "알 수 없음"}</div>
        <div className="text-sm text-gray-600">
          카테고리: {bottle?.category ?? "-"}
        </div>
        <div className="text-sm text-gray-600">
          구매일: {purchase.purchaseDate?.slice(0, 16).replace("T", " ") ?? "-"}
        </div>
        <div className="text-sm text-gray-600">
          가격: {purchase.price ? `${purchase.price.toLocaleString()}원` : "-"}
        </div>
        <div className="text-sm text-gray-600">
          장소: {purchase.place ?? "-"}
        </div>
        <div className="text-sm text-blue-700 font-semibold">
          병 수: {purchase.quantity ?? 1}병
        </div>
        {purchase.memo && (
          <div className="text-xs text-gray-400 mt-1">
            메모: {purchase.memo}
          </div>
        )}
      </div>
    </li>
  );
}
