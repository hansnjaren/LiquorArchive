import { useEffect, useState } from "react";
import { format, addDays, isSameDay, isSameMonth } from "date-fns";
import { TITLE_COLOR } from "../constants";
import { DrinkLog } from "../types";

export default function CalendarGrid({
  monthStart,
  monthEnd,
  today,
  onDateClick,
  currentMonth,
}: {
  monthStart: Date;
  monthEnd: Date;
  today: Date;
  onDateClick: (date: Date) => void;
  currentMonth: Date;
}) {
  // DB에서 기록 fetch
  const [userDrinkDates, setUserDrinkDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/drinkingLogs/me")
      .then(res => res.json())
      .then((logs: DrinkLog[]) => {
        // 이번 달에 해당하는 기록만 날짜 Set으로 만듦
        const monthStr = format(monthStart, "yyyy-MM");
        const dates = new Set(
          logs
            .map(log => format(new Date(log.date), "yyyy-MM-dd"))
            .filter(dateStr => dateStr.startsWith(monthStr))
        );
        setUserDrinkDates(dates);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [monthStart]);

  const startDate = new Date(monthStart);
  startDate.setDate(1 - startDate.getDay());
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const rows = [];
  let days = [];
  let day = new Date(startDate);

  const todayStr = format(today, "yyyy-MM-dd");

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const thisDay = new Date(day);
      const dayStr = format(thisDay, "yyyy-MM-dd");
      const hasDrinkLog = userDrinkDates.has(dayStr);
      const isFuture = dayStr > todayStr;
      days.push(
        <div
          key={thisDay.toString()}
          className={`relative flex items-center justify-center w-10 h-10 rounded-full
            ${isSameDay(thisDay, today) && isSameMonth(thisDay, monthStart) ? "font-bold bg-gray-300" : ""}
            ${!isSameMonth(thisDay, monthStart) ? "text-gray-300" : ""}
            ${isFuture ? "text-gray-300 opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-blue-100 transition"}
          `}
          onClick={() => {
            if (isFuture) return;
            onDateClick(thisDay);
          }}
          aria-disabled={isFuture}
          tabIndex={isFuture ? -1 : 0}
        >
          {format(thisDay, "d")}
          {hasDrinkLog && (
            <span 
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ backgroundColor: TITLE_COLOR }}
            ></span>
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

  return (
    <>
      <div className="grid grid-cols-7 mb-2 text-center text-gray-500">
        <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
      </div>
      {loading ? (
        <div className="text-center text-gray-400 py-8">불러오는 중...</div>
      ) : (
        <div>{rows}</div>
      )}
    </>
  );
}
