import { useRef, useState } from "react";
import useLockBodyScroll from "../hooks/useLockBodyScroll";
import BottleDropdown from "./BottleDropdown";
import bottles from "../data/bottle.json";

interface DrinkLogAddModalProps {
  defaultDate?: Date;
  onAdd: (log: any) => void;
  onClose: () => void;
  userId: string;
}

// 로컬 날짜 문자열 생성 (YYYY-MM-DD)
function getLocalDateString(date = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate())
  );
}

// 로컬 시간 문자열 생성 (HH:mm)
function getLocalTimeString(date = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function DrinkLogAddModal({
  defaultDate = new Date(),
  onAdd,
  onClose,
  userId,
}: DrinkLogAddModalProps) {
  useLockBodyScroll(true);

  // 날짜/시간 input 상태 (로컬 기준)
  const [date, setDate] = useState(() => getLocalDateString(defaultDate));
  const [time, setTime] = useState(() => getLocalTimeString(defaultDate));

  // 병 선택 드롭다운 상태
  const [bottleSearch, setBottleSearch] = useState("");
  const [selectedBottleId, setSelectedBottleId] = useState<string | null>(null);
  const [bottleDropdownOpen, setBottleDropdownOpen] = useState(false);

  const [amountMl, setAmountMl] = useState("");

  // 드래그 UX
  const modalRef = useRef<HTMLDivElement>(null);
  const [dragStartedInside, setDragStartedInside] = useState(false);

  // 오늘 날짜와 현재 시각
  const now = new Date();
  const todayStr = getLocalDateString(now);
  const maxTime =
    date === todayStr
      ? getLocalTimeString(now)
      : undefined;
  const maxDate = todayStr; // 미래 날짜 선택 제한

  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current && modalRef.current.contains(e.target as Node)) {
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
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // 병 선택 핸들러
  const handleBottleSelect = (id: string, name: string) => {
    setSelectedBottleId(id);
    setBottleSearch(name);
    setBottleDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBottleId || !amountMl) {
      alert("술 종류와 양을 입력하세요.");
      return;
    }
    const bottle = bottles.find((b) => b.id === selectedBottleId);
    if (!bottle) {
      alert("올바른 술을 선택하세요.");
      return;
    }
    // 날짜+시간을 합쳐서 Date 객체 생성 (로컬 타임존 기준)
    const logDate = new Date(`${date}T${time}`);
    if (logDate.getTime() > Date.now()) {
      alert("미래 시각의 기록은 추가할 수 없습니다.");
      return;
    }

    const newLog = {
      id: Math.random().toString(36).slice(2),
      userId,
      date: logDate.toISOString(),
      bottleId: bottle.id,
      amountMl: Number(amountMl),
    };

    alert("추가된 음주 기록 정보:\n" + JSON.stringify(newLog, null, 2));
    onAdd(newLog);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onMouseDown={handleMouseDown}
      onMouseUp={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg max-w-xs w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          aria-label="닫기"
        >
          ×
        </button>
        <h3 className="text-lg font-bold mb-4 text-center">
          음주 기록 추가
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* 날짜 선택 */}
          <div>
            <label className="block text-sm font-semibold mb-1">날짜</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              max={maxDate}
            />
          </div>
          {/* 시간 선택 */}
          <div>
            <label className="block text-sm font-semibold mb-1">시간</label>
            <input
              type="time"
              className="w-full border rounded px-3 py-2"
              value={time}
              onChange={e => setTime(e.target.value)}
              required
              max={maxTime}
            />
          </div>
          {/* 병 선택 (검색 드롭다운) */}
          <div>
            <label className="block text-sm font-semibold mb-1">술 종류 (검색)</label>
            <BottleDropdown
              bottles={bottles}
              search={bottleSearch}
              setSearch={setBottleSearch}
              selectedBottleId={selectedBottleId}
              setSelectedBottleId={handleBottleSelect}
              open={bottleDropdownOpen}
              setOpen={setBottleDropdownOpen}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">양(ml)</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={amountMl}
              onChange={e => setAmountMl(e.target.value)}
              min={1}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-bold"
          >
            추가
          </button>
        </form>
      </div>
    </div>
  );
}
