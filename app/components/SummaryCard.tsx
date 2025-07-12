import { CARD_COLOR, TAB_LIST_COLOR } from "../constants";

export default function SummaryCard({
  totalQuantity,
  totalSpent,
}: {
  totalQuantity: number;
  totalSpent: number;
}) {
  return (
    <div 
        className="rounded p-4 mb-6 flex gap-8"
        style={{ backgroundColor: `${TAB_LIST_COLOR}`}}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${CARD_COLOR}`)}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = `${TAB_LIST_COLOR}`)}>
      <div>
        <div className="text-gray-500 text-sm">총 구입 병 수</div>
        <div className="text-xl font-bold text-blue-700">
          {totalQuantity}병
        </div>
      </div>
      <div>
        <div className="text-gray-500 text-sm">총 지출 금액</div>
        <div className="text-xl font-bold text-red-700">
          {totalSpent.toLocaleString()}원
        </div>
      </div>
    </div>
  );
}
