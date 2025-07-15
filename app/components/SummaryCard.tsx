import { CARD_COLOR, TAB_LIST_COLOR } from "../constants";

export default function SummaryCard({
  totalPurchaseCount,
  totalDrinkingDays,
}: {
  totalPurchaseCount: number;
  totalDrinkingDays: number;
}) {
  return (
    <div 
      className="rounded-lg p-4 mb-6 flex gap-8"
      style={{ backgroundColor: `${TAB_LIST_COLOR}` }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${CARD_COLOR}`)}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = `${TAB_LIST_COLOR}`)}>
      <div>
        <div className="text-gray-500 text-sm">총 구입 병 수</div>
        <div className="text-xl font-bold text-blue-700">
          {totalPurchaseCount}병
        </div>
      </div>
      <div>
        <div className="text-gray-500 text-sm">총 음주일</div>
        <div className="text-xl font-bold text-green-700">
          {totalDrinkingDays}일
        </div>
      </div>
    </div>
  );
}
