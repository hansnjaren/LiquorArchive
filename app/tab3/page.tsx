"use client";

import { useState } from "react";
import { userId } from "../constants";
import drinkLogs from "../data/drinkLog.json";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
} from "date-fns";

export default function Calendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 해당 유저의 음주 기록만 추출
  const userDrinkLogs = drinkLogs.filter((log) => log.userId === userId);

  // 음주 기록이 있는 날짜 Set (yyyy-MM-dd)
  const userDrinkDates = new Set(
    userDrinkLogs.map((log) => format(new Date(log.date), "yyyy-MM-dd"))
  );

  // 달력 렌더링 준비
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const thisDay = new Date(day);
      const dayStr = format(thisDay, "yyyy-MM-dd");
      const hasDrinkLog = userDrinkDates.has(dayStr);

      days.push(
        <div
          key={thisDay.toString()}
          className={`relative flex items-center justify-center w-10 h-10 rounded-full cursor-pointer
                ${
                  isSameDay(thisDay, today) && isSameMonth(thisDay, monthStart)
                    ? "bg-blue-500 text-white font-bold"
                    : ""
                }
                ${!isSameMonth(thisDay, monthStart) ? "text-gray-300" : ""}
                hover:bg-blue-100 transition
            `}
          onClick={() => setSelectedDate(thisDay)}
        >
          {format(thisDay, "d")}
          {hasDrinkLog && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
          )}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="flex justify-between" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  // 선택한 날짜의 음주 기록만 추출 (시간순 정렬)
  const selectedDateStr = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : null;
  const logsForSelectedDate = selectedDate
    ? userDrinkLogs
        .filter(
          (log) => format(new Date(log.date), "yyyy-MM-dd") === selectedDateStr
        )
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  // 음주 기록이 있는 모든 날짜(yyyy-MM-dd) 배열, 정렬
  const allDrinkDates = Array.from(
    new Set(
      userDrinkLogs.map((log) => format(new Date(log.date), "yyyy-MM-dd"))
    )
  ).sort();

  // 현재 선택된 날짜의 인덱스
  const selectedIndex = selectedDateStr
    ? allDrinkDates.indexOf(selectedDateStr)
    : -1;

  // 이전/다음 날짜로 이동
  const moveModalDate = (offset: number) => {
    if (!selectedDate) return;
    let newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + offset);

    // 만약 월이 바뀌면, 달력 월도 자동 변경
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
      <div className="flex items-center justify-center mb-4 gap-4">
        <button
          onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
          className="p-2 rounded-full hover:bg-gray-200 transition"
          aria-label="이전 달"
        >
          &#8592;
        </button>
        <h2 className="text-xl font-bold text-center min-w-[140px]">
          {format(currentMonth, "yyyy년 MM월")}
        </h2>
        <button
          onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
          className="p-2 rounded-full hover:bg-gray-200 transition"
          aria-label="다음 달"
        >
          &#8594;
        </button>
      </div>
      <div className="grid grid-cols-7 mb-2 text-center text-gray-500">
        <div>일</div>
        <div>월</div>
        <div>화</div>
        <div>수</div>
        <div>목</div>
        <div>금</div>
        <div>토</div>
      </div>
      <div>{rows}</div>
      {/* 모달: 날짜 클릭 시 해당 날짜의 음주 기록 표시 + 날짜 이동 화살표 */}
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
                className="p-2 text-lg text-gray-600 hover:text-blue-600"
                aria-label="다음 날"
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
            {logsForSelectedDate.length === 0 ? (
              <div className="text-gray-500 text-center">
                이 날의 음주 기록이 없습니다.
              </div>
            ) : (
              <ul className="space-y-2 mt-2">
                {logsForSelectedDate.map((log) => (
                  <li
                    key={log.id}
                    className="border rounded p-2 bg-gray-50 flex flex-col gap-1"
                  >
                    <div>
                      <span className="font-semibold">
                        {format(new Date(log.date), "HH시 mm분")}
                      </span>
                      {" · "}
                      <span>{log.drinkType}</span>
                      {" · "}
                      <span>{log.amountMl}ml</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
