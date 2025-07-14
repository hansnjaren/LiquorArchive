import { useState, useRef, useEffect } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import DrinkLogList from "./DrinkLogList";
import YearMonthPicker from "./YearMonthPicker";
import DrinkLogAddModal from "./DrinkLogAddModal";
import DrinkLogEditModal from "./DrinkLogEditModal";
import { format, addMonths, subMonths } from "date-fns";
import { TAB_LIST_COLOR, TITLE_COLOR } from "../constants";
import { DrinkType } from "../types";

export default function CalendarView(props: any) {
  const {
    today,
    currentMonth,
    setCurrentMonth,
    showMonthPicker,
    setShowMonthPicker,
    selectedDate,
    setSelectedDate,
    showAddLogModal,
    setShowAddLogModal,
    addLogDate,
    editLog,
    setEditLog,
    years,
    monthsByYear,
    selectedYear,
    selectedMonth,
    isPrevMonthDisabled,
    isNextMonthDisabled,
    monthStart,
    monthEnd,
    handleAddLog,
    handleEditLog,
    handleDeleteLog,
    handleAddTodayLog,
    handleAddModalLog,
    handleYearMonthSelect,
    moveModalDate,
    userId,
  } = props;

  // 병(주종) 목록을 DB에서 fetch
  const [bottles, setBottles] = useState<DrinkType[]>([]);
  useEffect(() => {
    fetch("/api/drinkTypes")
      .then(res => {
        if (!res.ok) throw new Error("주종 목록을 불러오지 못했습니다.");
        return res.json();
      })
      .then(setBottles)
      .catch(e => alert(e.message));
  }, []);

  // 날짜 모달 닫힘 애니메이션
  const [dateModalClosing, setDateModalClosing] = useState(false);
  const dateModalBackdropRef = useRef<HTMLDivElement>(null);

  const handleDateModalRequestClose = () => {
    setDateModalClosing(true);
  };

  useEffect(() => {
    if (!dateModalClosing) return;
    const el = dateModalBackdropRef.current;
    if (!el) return;
    const handleAnimationEnd = () => {
      setDateModalClosing(false);
      setSelectedDate(null);
    };
    el.addEventListener("animationend", handleAnimationEnd);
    return () => {
      el.removeEventListener("animationend", handleAnimationEnd);
    };
  }, [dateModalClosing, setSelectedDate]);

  // 드래그 UX 개선
  const dateModalContentRef = useRef<HTMLDivElement>(null);
  const [dragStartedInside, setDragStartedInside] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (dateModalContentRef.current && dateModalContentRef.current.contains(e.target as Node)) {
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
    if (dateModalContentRef.current && !dateModalContentRef.current.contains(e.target as Node)) {
      handleDateModalRequestClose();
    }
  };

  // 선택한 날짜를 yyyy-MM-dd 문자열로 변환
  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;

  return (
    <div
      className="max-w-md mx-auto p-4 mt-[15vh] rounded-2xl"
      style={{ backgroundColor: `${TAB_LIST_COLOR}` }}>
      {/* 상단: 버튼 우측정렬, 달력 컨트롤 */}
      <div className="mb-4">
        <div className="flex justify-end mb-2">
          <button
            onClick={handleAddTodayLog}
            className="text-white px-4 py-2 rounded-lg transition cursor-pointer"
            style={{ backgroundColor: `${TITLE_COLOR}` }}
          >
            음주 기록 추가
          </button>
        </div>
        <CalendarHeader
          currentMonth={currentMonth}
          onPrev={() => { if (!isPrevMonthDisabled) setCurrentMonth((prev: Date) => subMonths(prev, 1)); }}
          onNext={() => { if (!isNextMonthDisabled) setCurrentMonth((prev: Date) => addMonths(prev, 1)); }}
          onShowPicker={() => setShowMonthPicker(true)}
          isPrevDisabled={isPrevMonthDisabled}
          isNextDisabled={isNextMonthDisabled}
        />
        <YearMonthPicker
          open={showMonthPicker}
          onClose={() => setShowMonthPicker(false)}
          onSelect={handleYearMonthSelect}
          years={years}
          monthsByYear={monthsByYear}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
      </div>
      <CalendarGrid
        monthStart={monthStart}
        monthEnd={monthEnd}
        today={today}
        onDateClick={setSelectedDate}
        currentMonth={currentMonth}
      />
      {/* 날짜 모달: 날짜 클릭 시 해당 날짜의 음주 기록 표시 + 날짜 이동 화살표 */}
      {selectedDate && (
        <div
          ref={dateModalBackdropRef}
          className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 ${
            dateModalClosing ? "animate-modal-out" : "animate-modal-in"
          }`}
          onMouseDown={handleMouseDown}
          onMouseUp={handleBackdropClick}
        >
          <div
            ref={dateModalContentRef}
            className="bg-white rounded-lg shadow-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2 min-w-[220px] w-[340px] px-4">
              <button
                onClick={() => moveModalDate(-1)}
                className="p-2 text-lg text-gray-600 hover:text-blue-600"
                aria-label="이전 날"
              >
                &#8592;
              </button>
              <h3 className="text-lg font-bold text-center flex-1 break-keep">
                {format(selectedDate, "yyyy년 MM월 dd일")} 음주 기록
              </h3>
              <button
                onClick={() => moveModalDate(1)}
                className={`p-2 text-lg ${
                  format(selectedDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                aria-label="다음 날"
                disabled={format(selectedDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")}
              >
                &#8594;
              </button>
            </div>
            <button
              onClick={handleDateModalRequestClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
              aria-label="닫기"
            >
              ×
            </button>
            <button
              onClick={() => handleAddModalLog(selectedDate)}
              className="block mx-auto mb-2 text-white px-4 py-2 rounded transition cursor-pointer"
              style={{ backgroundColor: `${TITLE_COLOR}` }}
            >
              음주 기록 추가
            </button>
            <DrinkLogList
              selectedDateStr={selectedDateStr}
              onEdit={setEditLog}
              onDelete={handleDeleteLog}
            />
          </div>
        </div>
      )}
      {/* 추가/수정 모달 */}
      {showAddLogModal && addLogDate && (
        <DrinkLogAddModal
          defaultDate={addLogDate}
          bottles={bottles}
          onAdd={handleAddLog}
          onClose={() => setShowAddLogModal(false)}
          userId={userId}
        />
      )}
      {editLog && (
        <DrinkLogEditModal
          log={editLog}
          bottles={bottles}
          onSubmit={handleEditLog}
          onClose={() => setEditLog(null)}
        />
      )}
    </div>
  );
}
