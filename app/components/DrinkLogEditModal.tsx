import { useEffect, useRef, useState } from "react";
import useLockBodyScroll from "../hooks/useLockBodyScroll";
import { TITLE_COLOR } from "../constants";
import type { DrinkType, DrinkLog } from "../types/index"

interface Props {
  log: DrinkLog;
  bottles: DrinkType[];
  onClose: () => void;
  onSubmit: (updated: DrinkLog) => void;
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
  return pad(date.getHours()) + ":" + pad(date.getMinutes());
}

function getInitialDrinks(log: DrinkLog, bottles: DrinkType[]) {
  let arr: { bottleId: string; count: string }[] =
    log.drinks && Array.isArray(log.drinks) && log.drinks.length > 0
      ? log.drinks.map((d) => {
          const bottle = d.drinkType || bottles.find((b) => b.id === d.drinkTypeId);
          let count = "";
          if (bottle && bottle.standardMl) {
            count = String(Math.round(Number(d.amountMl) / Number(bottle.standardMl)));
          }
          return {
            bottleId: d.drinkTypeId,
            count,
          };
        })
      : [];
  if (
    arr.length === 0 ||
    (arr[arr.length - 1].bottleId && arr[arr.length - 1].count)
  ) {
    arr.push({ bottleId: "", count: "" });
  }
  return arr;
}

export default function DrinkLogEditModal({ log, bottles, onClose, onSubmit }: Props) {
  useLockBodyScroll(true);

  // 날짜/시간 input 분리
  const logDateObj = new Date(log.date);
  const [date, setDate] = useState(getLocalDateString(logDateObj));
  const [time, setTime] = useState(getLocalTimeString(logDateObj));

  const [locationName, setLocationName] = useState(log.locationName ?? "");
  const [locationLat, setLocationLat] = useState(
    log.locationLat !== undefined && log.locationLat !== null ? String(log.locationLat) : ""
  );
  const [locationLng, setLocationLng] = useState(
    log.locationLng !== undefined && log.locationLng !== null ? String(log.locationLng) : ""
  );
  const [feelingScore, setFeelingScore] = useState(
    log.feelingScore !== undefined && log.feelingScore !== null ? String(log.feelingScore) : "3"
  );
  const [note, setNote] = useState(log.note ?? "");

  // 항상 마지막에 빈 입력란이 있도록!
  const [drinks, setDrinks] = useState<{ bottleId: string; count: string }[]>(
    () => getInitialDrinks(log, bottles)
  );

  // bottles이 비동기로 바뀔 수 있으므로, log/bottles이 바뀌면 drinks도 갱신
  useEffect(() => {
    setDrinks(getInitialDrinks(log, bottles));
    // eslint-disable-next-line
  }, [log, bottles]);

  // 애니메이션/드래그
  const [closing, setClosing] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [dragStartedInside, setDragStartedInside] = useState(false);

  // 오늘 날짜와 현재 시각 (로컬)
  const now = new Date();
  const todayStr = getLocalDateString(now);
  const maxTime = date === todayStr ? getLocalTimeString(now) : undefined;
  const maxDate = todayStr;

  const handleRequestClose = () => setClosing(true);
  useEffect(() => {
    if (!closing) return;
    const el = backdropRef.current;
    if (!el) return;
    const handleAnimationEnd = () => onClose();
    el.addEventListener("animationend", handleAnimationEnd);
    return () => el.removeEventListener("animationend", handleAnimationEnd);
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

  // drinks 입력 변경 핸들러 (항상 마지막에 빈 입력란이 있도록 보장)
  const handleDrinkChange = (idx: number, key: "bottleId" | "count", value: string) => {
    setDrinks(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: value };
      if (
        next.length < 10 &&
        next[next.length - 1].bottleId &&
        next[next.length - 1].count
      ) {
        next.push({ bottleId: "", count: "" });
      }
      // 여러 개 입력 후 중간 행을 비우면, 마지막에 빈 칸이 2개 이상 생길 수 있으므로, 
      // 마지막 한 칸만 빈 칸이 되도록 정리
      while (
        next.length > 1 &&
        !next[next.length - 1].bottleId &&
        !next[next.length - 1].count &&
        !next[next.length - 2].bottleId &&
        !next[next.length - 2].count
      ) {
        next.pop();
      }
      return next;
    });
  };

  // 입력행 삭제
  const handleRemoveDrink = (idx: number) => {
    setDrinks(prev => {
      let next = prev.filter((_, i) => i !== idx);
      // 항상 마지막에 빈 칸이 있도록
      if (
        next.length === 0 ||
        (next[next.length - 1].bottleId && next[next.length - 1].count)
      ) {
        next.push({ bottleId: "", count: "" });
      }
      return next;
    });
  };

  // PATCH 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // drinks 배열에서 유효한 입력만 추출
    const validDrinks = drinks
      .filter(d => d.bottleId && d.count && !isNaN(Number(d.count)) && Number(d.count) > 0)
      .map(d => {
        const bottle = bottles.find(b => b.id === d.bottleId);
        if (!bottle) return null;
        return {
          drinkTypeId: bottle.id,
          amountMl: Number(d.count) * Number(bottle.standardMl),
        };
      })
      .filter((d): d is { drinkTypeId: string; amountMl: number } => d !== null);

    if (validDrinks.length === 0) {
      alert("술 종류와 개수를 1개 이상 입력하세요.");
      return;
    }

    const newDateObj = new Date(`${date}T${time}`);
    if (newDateObj.getTime() > Date.now()) {
      alert("미래 시각의 기록은 수정할 수 없습니다.");
      return;
    }
    const fullDate = newDateObj.toISOString();

    // PATCH API 호출
    try {
      const res = await fetch(`/api/drinkingLogs/${log.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: fullDate,
          locationName: locationName || undefined,
          locationLat: locationLat ? Number(locationLat) : undefined,
          locationLng: locationLng ? Number(locationLng) : undefined,
          feelingScore: Number(feelingScore),
          note: note || undefined,
          drinks: validDrinks,
        }),
      });

      if (!res.ok) {
        let errMsg = "에러: " + res.status;
        try {
          const err = await res.json();
          errMsg = "에러: " + (err.message ?? res.status);
        } catch {}
        alert(errMsg);
        return;
      }

      const updatedLog: DrinkLog = await res.json();
      onSubmit(updatedLog);
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
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleRequestClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          aria-label="닫기"
        >
          ×
        </button>
        <h3 className="text-xl font-bold mb-4 text-center">음주 기록 수정</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 날짜/시간 분리 */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              날짜
            </label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              max={maxDate}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              시간
            </label>
            <input
              type="time"
              className="w-full border rounded px-3 py-2"
              value={time}
              onChange={e => setTime(e.target.value)}
              required
              max={maxTime}
            />
          </div>
          {/* 여러 술 입력란 */}
          <div>
            <label className="block text-sm font-semibold mb-1">술 종류 및 개수</label>
            {drinks.map((drink, idx) => (
              <div key={idx} className="flex items-end gap-2 mb-2">
                <select
                  className="border rounded px-2 py-1 flex-1"
                  value={drink.bottleId}
                  onChange={e => handleDrinkChange(idx, "bottleId", e.target.value)}
                  required={idx === 0}
                >
                  <option value="" disabled>술 종류</option>
                  {bottles.map(bottle => (
                    <option key={bottle.id} value={bottle.id}>
                      {bottle.name} {bottle.abv ? `(${bottle.abv}%)` : ""}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  className="border rounded px-2 py-1 w-20"
                  value={drink.count}
                  onChange={e => handleDrinkChange(idx, "count", e.target.value)}
                  placeholder="개수"
                  required={idx === 0}
                />
                <span className="text-xs text-gray-500 ml-1 min-w-[90px] inline-block">
                  {drink.bottleId
                    ? (() => {
                        const bottle = bottles.find(b => b.id === drink.bottleId);
                        const count = Number(drink.count);
                        const isValid = !isNaN(count) && count > 0 && bottle;
                        const totalMl = isValid ? count * Number(bottle!.standardMl) : null;
                        return (
                          <>
                            1개={bottle ? bottle.standardMl : "-"}ml
                            {isValid && <> | {count}개={totalMl}ml</>}
                          </>
                        );
                      })()
                    : "\u00A0"
                  }
                </span>
                {/* 삭제 버튼: 마지막 행이 아닐 때만 노출 */}
                {drinks.length > 1 && idx !== drinks.length - 1 ? (
                  <button
                    type="button"
                    className="ml-1 text-red-400 text-xs"
                    onClick={() => handleRemoveDrink(idx)}
                  >
                    삭제
                  </button>
                ) : (
                  <span className="ml-1 text-xs inline-block w-8" />
                )}
              </div>
            ))}
          </div>
          {/* 장소명 */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              장소(선택)
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={locationName}
              onChange={e => setLocationName(e.target.value)}
            />
          </div>
          {/* 위도 */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              위도(선택)
            </label>
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
            <label className="block text-sm font-semibold mb-1">
              경도(선택)
            </label>
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
            <label className="block text-sm font-semibold mb-1">
              기분 점수 (1~5)
            </label>
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
            <label className="block text-sm font-semibold mb-1">
              메모(선택)
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full text-white py-2 rounded cursor-pointer transition font-bold"
            style={{ backgroundColor: `${TITLE_COLOR}`}}
          >
            저장
          </button>
        </form>
      </div>
    </div>
  );
}
