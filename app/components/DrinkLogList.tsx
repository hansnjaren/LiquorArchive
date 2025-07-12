import { format } from "date-fns";

export default function DrinkLogList({
  logs,
  getBottleName,
  onEdit,
  onDelete,
}: {
  logs: any[];
  getBottleName: (bottleId: string) => string;
  onEdit: (log: any) => void;
  onDelete: (id: string) => void;
}) {
  return logs.length === 0 ? (
    <div className="text-gray-500 text-center">음주 기록이 없습니다.</div>
  ) : (
    <ul className="space-y-2 mt-2">
      {logs.map((log) => (
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
              <span>{getBottleName(log.bottleId)}</span>
              {" · "}
              <span>{log.amountMl}ml</span>
            </div>
            <button
              className="ml-2 text-red-500 hover:text-red-700 text-lg font-bold px-2"
              title="삭제"
              onClick={() => {
                if (
                  window.confirm("정말 삭제하시겠습니까?")
                ) {
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
