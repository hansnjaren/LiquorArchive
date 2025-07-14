import { useRef, useState, useEffect } from "react";
import useLockBodyScroll from "../hooks/useLockBodyScroll";
import { TITLE_COLOR } from "../constants";

interface DrinkType {
  id: string;
  name: string;
  abv: number;
  standardMl: number;
  iconUrl?: string | null;
}

interface DrinkLogAddModalProps {
  defaultDate?: Date;
  onAdd: (log: any) => void;
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

export default function DrinkLogAddModal({
  defaultDate = new Date(),
  onAdd,
  onClose,
  userId,
}: DrinkLogAddModalProps) {
  useLockBodyScroll(true);

  // 기존 상태
  const [date, setDate] = useState(() => getLocalDateString(defaultDate));
  const [time, setTime] = useState(() => getLocalTimeString(defaultDate));
  const [selectedBottleId, setSelectedBottleId] = useState<string | null>(null);
  const [drinkCount, setDrinkCount] = useState(""); // 병/캔 개수

  // 추가 상태
  const [locationName, setLocationName] = useState("");
  const [locationLat, setLocationLat] = useState("");
  const [locationLng, setLocationLng] = useState("");
  const [feelingScore, setFeelingScore] = useState("3"); // 1~5, 기본 3
  const [note, setNote] = useState("");

  // 주종 목록
  const [drinkTypes, setDrinkTypes] = useState<DrinkType[]>([]);
  const [loadingDrinks, setLoadingDrinks] = useState(true);

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

  // 주종 목록 불러오기
  useEffect(() => {
    setLoadingDrinks(true);
    fetch("/api/drinkTypes")
      .then(res => res.json())
      .then(data => {
        setDrinkTypes(data);
        setLoadingDrinks(false);
      })
      .catch(() => setLoadingDrinks(false));
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 방어 코드: 값 체크
    if (!selectedBottleId) {
      alert("술 종류를 선택하세요.");
      return;
    }
    if (!drinkCount || isNaN(Number(drinkCount)) || Number(drinkCount) < 1) {
      alert("병/캔 개수를 1개 이상 입력하세요.");
      return;
    }
    const bottle = drinkTypes.find((b) => b.id === selectedBottleId);
    if (!bottle || !bottle.standardMl || isNaN(Number(bottle.standardMl))) {
      alert("올바른 술 정보를 선택하세요.");
      return;
    }
    const logDate = new Date(`${date}T${time}`);
    if (logDate.getTime() > Date.now()) {
      alert("미래 시각의 기록은 추가할 수 없습니다.");
      return;
    }
    if (!feelingScore) {
      alert("기분 점수를 입력하세요.");
      return;
    }

    // 병/캔 개수 × standardMl로 변환 (항상 number)
    const amountMl = Number(drinkCount) * Number(bottle.standardMl);

    if (!amountMl || isNaN(amountMl) || amountMl < 1) {
      alert("음료 용량 계산에 실패했습니다. 입력값을 확인하세요.");
      return;
    }

    try {
      const res = await fetch("/api/drinkingLogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: logDate.toISOString(),
          locationName: locationName || undefined,
          locationLat: locationLat ? Number(locationLat) : undefined,
          locationLng: locationLng ? Number(locationLng) : undefined,
          feelingScore: Number(feelingScore),
          note: note || undefined,
          drinks: [
            { drinkTypeId: bottle.id, amountMl }
          ]
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("에러: " + (err.message ?? res.status));
        return;
      }

      const result = await res.json();
      // alert("추가된 음주 기록 정보:\n" + JSON.stringify(result, null, 2));
      onAdd(result);
      handleRequestClose();
    } catch (err) {
      alert("서버 오류: " + (err as any).toString());
    }
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
          {/* 술 종류 선택 */}
          <div>
            <label className="block text-sm font-semibold mb-1">술 종류</label>
            {loadingDrinks ? (
              <div className="text-gray-400 text-sm">불러오는 중...</div>
            ) : (
              <select
                className="w-full border rounded px-3 py-2"
                value={selectedBottleId || ""}
                onChange={e => setSelectedBottleId(e.target.value)}
                required
              >
                <option value="" disabled>
                  선택하세요
                </option>
                {drinkTypes.map((drink) => (
                  <option key={drink.id} value={drink.id}>
                    {drink.name} {drink.abv ? `(${drink.abv}%)` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>
          {/* 병/캔 개수 */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              {selectedBottleId
                ? `${drinkTypes.find((b) => b.id === selectedBottleId)?.name} 개수`
                : "병/캔 개수"}
            </label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={drinkCount}
              onChange={e => setDrinkCount(e.target.value)}
              min={1}
              required
              placeholder="몇 병/캔 마셨나요?"
            />
            {selectedBottleId && (() => {
              const drink = drinkTypes.find((b) => b.id === selectedBottleId);
              if (!drink) return <div className="text-xs text-gray-500 mt-1">선택된 주종 정보 없음</div>;
              if (!drink.standardMl) return <div className="text-xs text-gray-500 mt-1">용량 정보 없음</div>;
              const count = Number(drinkCount);
              const isValid = !isNaN(count) && count > 0;
              const totalMl = isValid ? count * Number(drink.standardMl) : null;
              return (
                <div className="text-xs text-gray-500 mt-1">
                  1개 = {Number(drink.standardMl)}ml
                  {isValid && (
                    <> &nbsp;|&nbsp; {count}개 = {totalMl}ml</>
                  )}
                </div>
              );
            })()}
          </div>
          {/* 장소명 */}
          <div>
            <label className="block text-sm font-semibold mb-1">장소명 (선택)</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={locationName}
              onChange={e => setLocationName(e.target.value)}
              placeholder="예: 홍대 주점"
            />
          </div>
          {/* 위도 */}
          <div>
            <label className="block text-sm font-semibold mb-1">위도 (선택)</label>
            <input
              type="number"
              step="any"
              className="w-full border rounded px-3 py-2"
              value={locationLat}
              onChange={e => setLocationLat(e.target.value)}
              placeholder="예: 37.55555"
            />
          </div>
          {/* 경도 */}
          <div>
            <label className="block text-sm font-semibold mb-1">경도 (선택)</label>
            <input
              type="number"
              step="any"
              className="w-full border rounded px-3 py-2"
              value={locationLng}
              onChange={e => setLocationLng(e.target.value)}
              placeholder="예: 126.9222"
            />
          </div>
          {/* 기분 점수 */}
          <div>
            <label className="block text-sm font-semibold mb-1">기분 점수 (1~5)</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={feelingScore}
              onChange={e => setFeelingScore(e.target.value)}
              required
            >
              <option value="1">1 (별로)</option>
              <option value="2">2</option>
              <option value="3">3 (보통)</option>
              <option value="4">4</option>
              <option value="5">5 (최고)</option>
            </select>
          </div>
          {/* 메모 */}
          <div>
            <label className="block text-sm font-semibold mb-1">메모 (선택)</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="메모를 입력하세요"
            />
          </div>
          <button
            type="submit"
            className="w-full text-white py-2 rounded transition font-bold cursor-pointer"
            style={{ backgroundColor: TITLE_COLOR }}
          >
            추가
          </button>
        </form>
      </div>
    </div>
  );
}
