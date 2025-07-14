import { format, addDays, isSameDay, isSameMonth } from "date-fns";
import { TITLE_COLOR } from "../constants";

export default function CalendarGrid({
  monthStart,
  monthEnd,
  today,
  userDrinkDates,
  onDateClick,
  currentMonth,
}: {
  monthStart: Date;
  monthEnd: Date;
  today: Date;
  userDrinkDates: Set<string>;
  onDateClick: (date: Date) => void;
  currentMonth: Date;
}) {
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
            ${isSameDay(thisDay, today) && isSameMonth(thisDay, monthStart) ? "text-white font-bold" : ""}
            ${!isSameMonth(thisDay, monthStart) ? "text-gray-300" : ""}
            ${isFuture ? "text-gray-300 opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-blue-100 transition"}
          `}
          style={
            isSameDay(thisDay, today) && isSameMonth(thisDay, monthStart)
                ? { backgroundColor: TITLE_COLOR }
                : { backgroundColor: undefined }
          }
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
      <div>{rows}</div>
    </>
  );
}
