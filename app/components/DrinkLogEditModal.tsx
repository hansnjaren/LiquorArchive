import { useRef, useState, useEffect } from "react";
import useLockBodyScroll from "../hooks/useLockBodyScroll";
import BottleDropdown from "./BottleDropdown";
import bottles from "../data/bottle.json";

interface DrinkLogEditModalProps {
  log: any;
  onEdit: (updatedLog: any) => void;
  onClose: () => void;
  userId: string;
}

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

function getLocalTimeString(date = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function DrinkLogEditModal({
  log,
  onEdit,
  onClose,
  userId,
}: DrinkLogEditModalProps) {
  useLockBodyScroll(true);

  const logDateObj = new Date(log.date);

  const [date, setDate] = useState(getLocalDateString(logDateObj));
  const [time, setTime] = useState(getLocalTimeString(logDateObj));
  const [bottleSearch, setBottleSearch] = useState(() => {
    const bottle = bottles.find((b) => b.id === log.bottleId);
    return bottle?.name ?? "";
  });
  const [selectedBottleId, setSelectedBottleId] = useState<string | null>(log.bottleId);
  const [bottleDropdownOpen, setBottleDropdownOpen] = useState(false);
  const [amountMl, setAmountMl] = useState(String(log.amountMl));

  // 애니메이션 상태
  const [closing, setClosing] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

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
  const maxDate = todayStr;

  // 닫기 요청 → 애니메이션
  const handleRequestClose = () => {
    setClosing(true);
  };

  useEffect(() => {
    if (!closing) return;
    const el = backdropRef.current;
    if (!el) return;
    const handleAnimationEnd = () => {
      onClose();
    };
    el.addEventListener("animationend", handleAnimationEnd);
    return () => {
      el.removeEventListener("animationend", handleAnimationEnd);
    };
  }, [closing, onClose]);

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
      handleRequestClose();
    }
  };

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
    const logDate = new Date(`${date}T${time}`);
    if (logDate.getTime() > Date.now()) {
      alert("미래 시각의 기록은 추가할 수 없습니다.");
      return;
    }

    const updatedLog = {
      ...log,
      userId,
      date: logDate.toISOString(),
      bottleId: bottle.id,
      amountMl: Number(amountMl),
    };

    alert("수정된 음주 기록 정보:\n" + JSON.stringify(updatedLog, null, 2));
    onEdit(updatedLog);
    handleRequestClose();
  };

  return (
    <div
      ref={backdropRef}
      className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 ${
        closing ? "animate-modal-out" : "animate-modal-in"
      }`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg max-w-xs w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleRequestClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          aria-label="닫기"
        >
          ×
        </button>
        <h3 className="text-lg font-bold mb-4 text-center">
          음주 기록 수정
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
            저장
          </button>
        </form>
      </div>
    </div>
  );
}
