import { format } from "date-fns";

export default function CalendarHeader({
  currentMonth,
  onPrev,
  onNext,
  onShowPicker,
  isPrevDisabled,
  isNextDisabled,
}: {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
  onShowPicker: () => void;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onPrev}
        className={`p-2 rounded-full transition ${
          isPrevDisabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-200"
        }`}
        aria-label="이전 달"
        disabled={isPrevDisabled}
      >
        &#8592;
      </button>
      <div
        className="text-xl font-bold text-center min-w-[140px] cursor-pointer"
        onClick={onShowPicker}
        title="연/월 선택"
      >
        {format(currentMonth, "yyyy년 MM월")}
      </div>
      <button
        onClick={onNext}
        className={`p-2 rounded-full transition ${
          isNextDisabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-200"
        }`}
        aria-label="다음 달"
        disabled={isNextDisabled}
      >
        &#8594;
      </button>
    </div>
  );
}
