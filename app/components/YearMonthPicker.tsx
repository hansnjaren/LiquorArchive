import { useEffect, useState } from "react";

// props:
// - open: 모달 열림 여부
// - onClose: 닫기 함수
// - onSelect: (year, month) => void
// - years: 선택 가능한 연 배열 (오름차순, 예: [2019, 2020, ..., 올해])
// - monthsByYear: { [year: number]: number[] } (각 연에 대해 선택 가능한 월 배열, 1~12)
// - currentYear: 올해(숫자)
// - currentMonth: 현재 달(1~12)
// - selectedYear: 선택된 연
// - selectedMonth: 선택된 월
export default function YearMonthPicker({
  open,
  onClose,
  onSelect,
  years,
  monthsByYear,
//   currentYear,
//   currentMonth,
  selectedYear,
  selectedMonth,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (year: number, month: number) => void;
  years: number[];
  monthsByYear: { [year: number]: number[] };
//   currentYear: number;
//   currentMonth: number;
  selectedYear: number;
  selectedMonth: number;
}) {
  const [year, setYear] = useState(selectedYear);
  const [month, setMonth] = useState(selectedMonth);

  // 연이 바뀌면 월을 1월 또는 해당 연의 마지막 월로 자동 조정
  useEffect(() => {
    const months = monthsByYear[year] || [];
    if (!months.includes(month)) {
      setMonth(months[months.length - 1] || 1);
    }
  }, [year, monthsByYear, month]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6" onClick={e => e.stopPropagation()}>
        <div className="mb-2 font-bold text-lg">연/월 선택</div>
        <div className="flex gap-4">
          <select
            className="border rounded px-2 py-1"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
          >
            {years.map(y => (
              <option key={y} value={y}>{y}년</option>
            ))}
          </select>
          <select
            className="border rounded px-2 py-1"
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
          >
            {(monthsByYear[year] || []).map(m => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 mt-6 justify-end">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white font-bold"
            onClick={() => {
              onSelect(year, month);
              onClose();
            }}
          >
            이동
          </button>
        </div>
      </div>
    </div>
  );
}
