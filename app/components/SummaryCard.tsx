export default function SummaryCard({
  totalQuantity,
  totalSpent,
}: {
  totalQuantity: number;
  totalSpent: number;
}) {
  return (
    <div className="bg-gray-50 rounded p-4 mb-6 flex gap-8">
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
