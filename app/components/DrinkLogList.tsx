import { format } from "date-fns";
import { DrinkLog } from "../types";

export default function DrinkLogList({
  selectedDateStr,
  logs,
  onEdit,
  onDelete,
}: {
  selectedDateStr: string | null;
  logs: DrinkLog[];
  onEdit: (log: DrinkLog) => void;
  onDelete: (id: string) => void;
}) {
  // 날짜 필터링
  const filteredLogs =
    logs && selectedDateStr
      ? logs.filter(
          (log) =>
            format(new Date(log.date), "yyyy-MM-dd") === selectedDateStr
        )
      : [];

  if (!filteredLogs || filteredLogs.length === 0)
    return <div className="text-gray-500 text-center">음주 기록이 없습니다.</div>;

  return (
    <ul className="space-y-2 mt-2">
      {filteredLogs.map((log) => (
        <li
          key={log.id}
          className="border rounded p-2 bg-gray-50 flex flex-col gap-1 group relative"
        >
          <div className="flex items-center">
            <div
              className="flex-1 cursor-pointer"
              onClick={() => onEdit(log)}
              title="수정"
            >
              <span className="font-semibold">{format(new Date(log.date), "HH시 mm분")}</span>
              {" · "}
              {log.drinks && log.drinks.length > 0 ? (
                log.drinks.map((drink, i) => (
                  <span key={drink.drinkTypeId + i}>
                    {drink.drinkType?.name || "-"} {drink.amountMl}ml
                    {i < log.drinks.length - 1 && ", "}
                  </span>
                ))
              ) : (
                <span>-</span>
              )}
            </div>
            <button
              className="ml-2 text-red-500 hover:text-red-700 text-lg font-bold px-2"
              title="삭제"
              onClick={() => {
                if (window.confirm("정말 삭제하시겠습니까?")) {
                  onDelete(log.id);
                }
              }}
            >
              ×
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
