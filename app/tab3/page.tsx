"use client";

import { useState } from "react";
import { userId } from "../constants";
import drinkLogsData from "../data/drinkLog.json";
import bottles from "../data/bottle.json";
import DrinkLogAddModal from "../components/DrinkLogAddModal";
import DrinkLogEditModal from "../components/DrinkLogEditModal";
import CalendarHeader from "../components/CalendarHeader";
import CalendarGrid from "../components/CalendarGrid";
import DrinkLogList from "../components/DrinkLogList";
import YearMonthPicker from "../components/YearMonthPicker";
import { useYearMonthOptions } from "../hooks/useYearMonthOptions";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
} from "date-fns";

export default function Calendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [logs, setLogs] = useState(drinkLogsData);
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [addLogDate, setAddLogDate] = useState<Date | null>(null);
  const [editLog, setEditLog] = useState<any | null>(null);

  const userDrinkLogs = logs.filter((log) => log.userId === userId);

  // 연/월 옵션 계산
  const { years, monthsByYear, minYear, minMonth } = useYearMonthOptions(userDrinkLogs, today);

  const selectedYear = currentMonth.getFullYear();
  const selectedMonth = currentMonth.getMonth() + 1;

  // 월 이동 제한
  const isPrevMonthDisabled =
    selectedYear < minYear ||
    (selectedYear === minYear && selectedMonth <= minMonth);

  const isNextMonthDisabled =
    selectedYear > today.getFullYear() ||
    (selectedYear === today.getFullYear() && selectedMonth >= today.getMonth() + 1);

  // 달력 렌더링 준비
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);

  // 음주 기록이 있는 날짜 Set (yyyy-MM-dd)
  const userDrinkDates = new Set(
    userDrinkLogs.map((log) => format(new Date(log.date), "yyyy-MM-dd"))
  );

  // 날짜별 음주 기록
  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const logsForSelectedDate = selectedDate
    ? userDrinkLogs
        .filter((log) => format(new Date(log.date), "yyyy-MM-dd") === selectedDateStr)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  const getBottleName = (bottleId: string) => {
    const bottle = bottles.find((b) => b.id === bottleId);
    return bottle ? bottle.name : "-";
  };

  // 모달 핸들러
  const handleAddLog = (newLog: any) => setLogs((prev) => [...prev, newLog]);
  const handleEditLog = (updatedLog: any) => setLogs((prev) => prev.map((log) => (log.id === updatedLog.id ? updatedLog : log)));
  const handleDeleteLog = (id: string) => setLogs((prev) => prev.filter((log) => log.id !== id));
  const handleAddTodayLog = () => { setAddLogDate(today); setShowAddLogModal(true); };
  const handleAddModalLog = (date: Date) => { setAddLogDate(date); setShowAddLogModal(true); };

  // 연/월 모달에서 선택
  const handleYearMonthSelect = (year: number, month: number) => {
    setCurrentMonth(new Date(year, month - 1, 1));
    setShowMonthPicker(false);
  };

  // 이전/다음 날짜로 이동
  const moveModalDate = (offset: number) => {
    if (!selectedDate) return;
    let newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + offset);
    const todayStr = format(today, "yyyy-MM-dd");
    if (format(newDate, "yyyy-MM-dd") > todayStr) return;
    if (
      newDate.getMonth() !== currentMonth.getMonth() ||
      newDate.getFullYear() !== currentMonth.getFullYear()
    ) {
      setCurrentMonth(newDate);
    }
    setSelectedDate(newDate);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {/* 상단: 버튼 우측정렬, 달력 컨트롤 */}
      <div className="mb-4">
        <div className="flex justify-end mb-2">
          <button
            onClick={handleAddTodayLog}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-bold"
          >
            음주 기록 추가
          </button>
        </div>
        <CalendarHeader
          currentMonth={currentMonth}
          onPrev={() => { if (!isPrevMonthDisabled) setCurrentMonth(prev => subMonths(prev, 1)); }}
          onNext={() => { if (!isNextMonthDisabled) setCurrentMonth(prev => addMonths(prev, 1)); }}
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
        userDrinkDates={userDrinkDates}
        onDateClick={setSelectedDate}
        currentMonth={currentMonth}
      />
      {/* 날짜 모달: 날짜 클릭 시 해당 날짜의 음주 기록 표시 + 날짜 이동 화살표 */}
      {selectedDate && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedDate(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2 w-full min-w-[220px] max-w-[340px] px-4">
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
              onClick={() => setSelectedDate(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
              aria-label="닫기"
            >
              ×
            </button>
            <button
              onClick={() => handleAddModalLog(selectedDate)}
              className="block mx-auto mb-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              음주 기록 추가
            </button>
            <DrinkLogList
              logs={logsForSelectedDate}
              getBottleName={getBottleName}
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
          onAdd={handleAddLog}
          onClose={() => setShowAddLogModal(false)}
          userId={userId}
        />
      )}
      {editLog && (
        <DrinkLogEditModal
          log={editLog}
          onEdit={handleEditLog}
          onClose={() => setEditLog(null)}
          userId={userId}
        />
      )}
    </div>
  );
}



// "use client";

// import { useState } from "react";
// import { userId } from "../constants";
// import drinkLogsData from "../data/drinkLog.json";
// import bottles from "../data/bottle.json";
// import DrinkLogAddModal from "../components/DrinkLogAddModal";
// import DrinkLogEditModal from "../components/DrinkLogEditModal";
// import YearMonthPicker from "../components/YearMonthPicker";
// import { useYearMonthOptions } from "../hooks/useYearMonthOptions";
// import {
//   format,
//   startOfMonth,
//   endOfMonth,
//   startOfWeek,
//   endOfWeek,
//   addDays,
//   addMonths,
//   subMonths,
//   isSameDay,
//   isSameMonth,
// } from "date-fns";

// export default function Calendar() {
//   const today = new Date();
//   const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
//   const [showMonthPicker, setShowMonthPicker] = useState(false);
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
//   const [logs, setLogs] = useState(drinkLogsData);
//   const [showAddLogModal, setShowAddLogModal] = useState(false);
//   const [addLogDate, setAddLogDate] = useState<Date | null>(null);
//   const [editLog, setEditLog] = useState<any | null>(null);

//   const userDrinkLogs = logs.filter((log) => log.userId === userId);

//   // 연/월 옵션 계산
//   const { years, monthsByYear, minYear, minMonth } = useYearMonthOptions(userDrinkLogs, today);

//   const selectedYear = currentMonth.getFullYear();
//   const selectedMonth = currentMonth.getMonth() + 1;

//   // 월 이동 제한
//   const isPrevMonthDisabled =
//     selectedYear < minYear ||
//     (selectedYear === minYear && selectedMonth <= minMonth);

//   const isNextMonthDisabled =
//     selectedYear > today.getFullYear() ||
//     (selectedYear === today.getFullYear() && selectedMonth >= today.getMonth() + 1);

//   // 달력 렌더링
//   const monthStart = startOfMonth(currentMonth);
//   const monthEnd = endOfMonth(monthStart);
//   const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
//   const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

//   const todayStr = format(today, "yyyy-MM-dd");
//   const userDrinkDates = new Set(
//     userDrinkLogs.map((log) => format(new Date(log.date), "yyyy-MM-dd"))
//   );
//   const rows = [];
//   let days = [];
//   let day = startDate;
//   while (day <= endDate) {
//     for (let i = 0; i < 7; i++) {
//       const thisDay = new Date(day);
//       const dayStr = format(thisDay, "yyyy-MM-dd");
//       const hasDrinkLog = userDrinkDates.has(dayStr);
//       const isFuture = dayStr > todayStr;
//       days.push(
//         <div
//           key={thisDay.toString()}
//           className={`relative flex items-center justify-center w-10 h-10 rounded-full
//             ${isSameDay(thisDay, today) && isSameMonth(thisDay, monthStart) ? "bg-blue-500 text-white font-bold" : ""}
//             ${!isSameMonth(thisDay, monthStart) ? "text-gray-300" : ""}
//             ${isFuture ? "text-gray-300 opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-blue-100 transition"}
//           `}
//           onClick={() => {
//             if (isFuture) return;
//             setSelectedDate(thisDay);
//           }}
//           aria-disabled={isFuture}
//           tabIndex={isFuture ? -1 : 0}
//         >
//           {format(thisDay, "d")}
//           {hasDrinkLog && (
//             <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
//           )}
//         </div>
//       );
//       day = addDays(day, 1);
//     }
//     rows.push(
//       <div className="flex justify-between" key={day.toString()}>
//         {days}
//       </div>
//     );
//     days = [];
//   }

//   // 날짜별 음주 기록
//   const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
//   const logsForSelectedDate = selectedDate
//     ? userDrinkLogs
//         .filter((log) => format(new Date(log.date), "yyyy-MM-dd") === selectedDateStr)
//         .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
//     : [];

//   const getBottleName = (bottleId: string) => {
//     const bottle = bottles.find((b) => b.id === bottleId);
//     return bottle ? bottle.name : "-";
//   };

//   // 모달 핸들러
//   const handleAddLog = (newLog: any) => setLogs((prev) => [...prev, newLog]);
//   const handleEditLog = (updatedLog: any) => setLogs((prev) => prev.map((log) => (log.id === updatedLog.id ? updatedLog : log)));
//   const handleDeleteLog = (id: string) => setLogs((prev) => prev.filter((log) => log.id !== id));
//   const handleAddTodayLog = () => { setAddLogDate(today); setShowAddLogModal(true); };
//   const handleAddModalLog = (date: Date) => { setAddLogDate(date); setShowAddLogModal(true); };

//   // 연/월 모달에서 선택
//   const handleYearMonthSelect = (year: number, month: number) => {
//     setCurrentMonth(new Date(year, month - 1, 1));
//     setShowMonthPicker(false);
//   };

//   // 이전/다음 날짜로 이동
//   const moveModalDate = (offset: number) => {
//     if (!selectedDate) return;
//     let newDate = new Date(selectedDate);
//     newDate.setDate(selectedDate.getDate() + offset);
//     if (format(newDate, "yyyy-MM-dd") > todayStr) return;
//     if (
//       newDate.getMonth() !== currentMonth.getMonth() ||
//       newDate.getFullYear() !== currentMonth.getFullYear()
//     ) {
//       setCurrentMonth(newDate);
//     }
//     setSelectedDate(newDate);
//   };

//   return (
//     <div className="max-w-md mx-auto p-4">
//       {/* 상단: 버튼 우측정렬, 월/화살표 중앙정렬, 연월 텍스트 + 모달 */}
//       <div className="mb-4">
//         <div className="flex justify-end mb-2">
//           <button
//             onClick={handleAddTodayLog}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-bold"
//           >
//             음주 기록 추가
//           </button>
//         </div>
//         <div className="flex items-center justify-center gap-4">
//           <button
//             onClick={() => {
//               if (!isPrevMonthDisabled) setCurrentMonth(prev => subMonths(prev, 1));
//             }}
//             className={`p-2 rounded-full transition ${
//               isPrevMonthDisabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-200"
//             }`}
//             aria-label="이전 달"
//             disabled={isPrevMonthDisabled}
//           >
//             &#8592;
//           </button>
//           <div
//             className="text-xl font-bold text-center min-w-[140px] cursor-pointer"
//             onClick={() => setShowMonthPicker(true)}
//             title="연/월 선택"
//           >
//             {format(currentMonth, "yyyy년 MM월")}
//           </div>
//           <button
//             onClick={() => {
//               if (!isNextMonthDisabled) setCurrentMonth(prev => addMonths(prev, 1));
//             }}
//             className={`p-2 rounded-full transition ${
//               isNextMonthDisabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-200"
//             }`}
//             aria-label="다음 달"
//             disabled={isNextMonthDisabled}
//           >
//             &#8594;
//           </button>
//         </div>
//         <YearMonthPicker
//           open={showMonthPicker}
//           onClose={() => setShowMonthPicker(false)}
//           onSelect={handleYearMonthSelect}
//           years={years}
//           monthsByYear={monthsByYear}
//           selectedYear={selectedYear}
//           selectedMonth={selectedMonth}
//         />
//       </div>
//       <div className="grid grid-cols-7 mb-2 text-center text-gray-500">
//         <div>일</div>
//         <div>월</div>
//         <div>화</div>
//         <div>수</div>
//         <div>목</div>
//         <div>금</div>
//         <div>토</div>
//       </div>
//       <div>{rows}</div>
//       {/* 날짜 모달: 날짜 클릭 시 해당 날짜의 음주 기록 표시 + 날짜 이동 화살표 */}
//       {selectedDate && (
//         <div
//           className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//           onClick={() => setSelectedDate(null)}
//         >
//           <div
//             className="bg-white rounded-lg shadow-lg p-6 relative"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center justify-between mb-2 w-full min-w-[220px] max-w-[340px] px-4">
//               <button
//                 onClick={() => moveModalDate(-1)}
//                 className="p-2 text-lg text-gray-600 hover:text-blue-600"
//                 aria-label="이전 날"
//               >
//                 &#8592;
//               </button>
//               <h3 className="text-lg font-bold text-center flex-1 break-keep">
//                 {format(selectedDate, "yyyy년 MM월 dd일")} 음주 기록
//               </h3>
//               <button
//                 onClick={() => moveModalDate(1)}
//                 className={`p-2 text-lg ${
//                   format(selectedDate, "yyyy-MM-dd") === todayStr
//                     ? "text-gray-300 cursor-not-allowed"
//                     : "text-gray-600 hover:text-blue-600"
//                 }`}
//                 aria-label="다음 날"
//                 disabled={format(selectedDate, "yyyy-MM-dd") === todayStr}
//               >
//                 &#8594;
//               </button>
//             </div>
//             <button
//               onClick={() => setSelectedDate(null)}
//               className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
//               aria-label="닫기"
//             >
//               ×
//             </button>
//             <button
//               onClick={() => handleAddModalLog(selectedDate)}
//               className="block mx-auto mb-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//             >
//               음주 기록 추가
//             </button>
//             {logsForSelectedDate.length === 0 ? (
//               <div className="text-gray-500 text-center">
//                 음주 기록이 없습니다.
//               </div>
//             ) : (
//               <ul className="space-y-2 mt-2">
//                 {logsForSelectedDate.map((log) => (
//                   <li
//                     key={log.id}
//                     className="border rounded p-2 bg-gray-50 flex flex-col gap-1 group relative"
//                   >
//                     <div className="flex items-center">
//                       <div
//                         className="flex-1 cursor-pointer"
//                         onClick={() => setEditLog(log)}
//                         title="수정"
//                       >
//                         <span className="font-semibold">
//                           {format(new Date(log.date), "HH시 mm분")}
//                         </span>
//                         {" · "}
//                         <span>{getBottleName(log.bottleId)}</span>
//                         {" · "}
//                         <span>{log.amountMl}ml</span>
//                       </div>
//                       <button
//                         className="ml-2 text-red-500 hover:text-red-700 text-lg font-bold px-2"
//                         title="삭제"
//                         onClick={() => {
//                           if (
//                             window.confirm("정말 삭제하시겠습니까?") &&
//                             window.confirm("삭제 후 복구할 수 없습니다. 정말로 삭제할까요?")
//                           ) {
//                             handleDeleteLog(log.id);
//                           }
//                         }}
//                       >
//                         ×
//                       </button>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}
//       {/* 추가/수정 모달 */}
//       {showAddLogModal && addLogDate && (
//         <DrinkLogAddModal
//           defaultDate={addLogDate}
//           onAdd={handleAddLog}
//           onClose={() => setShowAddLogModal(false)}
//           userId={userId}
//         />
//       )}
//       {editLog && (
//         <DrinkLogEditModal
//           log={editLog}
//           onEdit={handleEditLog}
//           onClose={() => setEditLog(null)}
//           userId={userId}
//         />
//       )}
//     </div>
//   );
// }
