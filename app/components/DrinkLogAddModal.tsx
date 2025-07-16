"use client";

import { useRef, useState, useEffect } from "react";
import useLockBodyScroll from "../hooks/useLockBodyScroll";
import { TITLE_COLOR } from "../constants";
import { DrinkType } from "../types";
import { DrinkTypeDropdown } from "./DrinkTypeDropdown";
import LocationSelector from "./LocationSelector";
import { updateDrinkList } from "../utils/drinkList";

interface DrinkLogAddModalProps {
  defaultDate?: Date;
  bottles: DrinkType[];
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
  bottles,
  onAdd,
  onClose,
  userId,
}: DrinkLogAddModalProps) {
  useLockBodyScroll(true);

  const [date, setDate] = useState(() => getLocalDateString(defaultDate));
  const [time, setTime] = useState(() => getLocalTimeString(defaultDate));
  const [locationName, setLocationName] = useState("");
  const [locationLat, setLocationLat] = useState("");
  const [locationLng, setLocationLng] = useState("");
  const [feelingScore, setFeelingScore] = useState("3");
  const [note, setNote] = useState("");
  const [drinks, setDrinks] = useState([
    { bottleId: "", count: "", search: "", dropdownOpen: false }
  ]);
  const [closing, setClosing] = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const todayStr = getLocalDateString(now);
  const maxTime = date === todayStr ? getLocalTimeString(now) : undefined;
  const maxDate = todayStr;

  const handleRequestClose = () => setClosing(true);

  // ✅ 외부 클릭 감지를 위한 window-level 이벤트
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        handleRequestClose();
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 애니메이션 종료 시 모달 종료
  useEffect(() => {
    if (!closing) return;
    const el = backdropRef.current;
    if (!el) return;

    const handleAnimationEnd = () => onClose();

    el.addEventListener("animationend", handleAnimationEnd);
    return () => {
      el.removeEventListener("animationend", handleAnimationEnd);
    };
  }, [closing, onClose]);

  const handleDrinkChange = (
    idx: number,
    key: "bottleId" | "count" | "search" | "dropdownOpen",
    value: string | boolean
  ) => {
    setDrinks(prev => updateDrinkList(prev, idx, key, value));
  };

  const handleRemoveDrink = (idx: number) => {
    setDrinks(prev => {
      const next = prev.filter((_, i) => i !== idx);
      return updateDrinkList(next, next.length - 1, "dropdownOpen", false);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validDrinks = drinks
      .filter(d => d.bottleId && d.count && !isNaN(Number(d.count)) && Number(d.count) > 0)
      .map(d => {
        const bottle = bottles.find(b => b.id === d.bottleId);
        return bottle
          ? {
              drinkTypeId: bottle.id,
              amountMl: Number(d.count) * Number(bottle.standardMl),
            }
          : null;
      })
      .filter(Boolean);

    if (validDrinks.length === 0) {
      alert("술 종류와 개수를 1개 이상 입력하세요.");
      return;
    }

    const logDate = new Date(`${date}T${time}`);
    if (logDate.getTime() > Date.now()) {
      alert("미래 시각의 기록은 추가할 수 없습니다.");
      return;
    }

    if (!feelingScore) {
      alert("기분 점수를 선택하세요.");
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
          drinks: validDrinks,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        const errMsg = err?.message ?? `에러: ${res.status}`;
        alert(errMsg);
        return;
      }

      const result = await res.json();

      onAdd(result);
      setDrinks([{ bottleId: "", count: "", search: "", dropdownOpen: false }]);
      setNote("");
      setLocationName("");
      setLocationLat("");
      setLocationLng("");
      setFeelingScore("3");
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
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-0"
        style={{ overflow: "hidden" }}
      >
        <div className="relative p-6 overflow-y-auto max-h-[80vh] rounded-lg">
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
            {/* 날짜 */}
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

            {/* 시간 */}
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

            {/* 술 종류 및 개수 */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                술 종류 및 개수
              </label>
              {drinks.map((drink, idx) => {
                const bottle = bottles.find(b => b.id === drink.bottleId);
                const count = Number(drink.count);
                const totalMl =
                  bottle && count > 0 ? count * Number(bottle.standardMl) : null;

                return (
                  <div key={idx} className="mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <DrinkTypeDropdown
                          bottles={bottles}
                          value={drink.bottleId}
                          search={drink.search}
                          setSearch={v => handleDrinkChange(idx, "search", v)}
                          onSelect={(id, name) => {
                            handleDrinkChange(idx, "bottleId", id);
                            handleDrinkChange(idx, "search", name);
                          }}
                          open={drink.dropdownOpen}
                          setOpen={v => handleDrinkChange(idx, "dropdownOpen", v)}
                        />
                      </div>
                      <input
                        type="number"
                        min={1}
                        className="border rounded px-3 h-10 w-20"
                        value={drink.count}
                        onChange={e => handleDrinkChange(idx, "count", e.target.value)}
                        placeholder="개수"
                        required={idx === 0}
                      />
                      {drinks.length > 1 && (
                        <button
                          type="button"
                          className="ml-2 text-red-400 text-xs h-10 px-3 rounded border border-red-300 hover:bg-red-50 transition"
                          onClick={() => handleRemoveDrink(idx)}
                        >
                          삭제
                        </button>
                      )}
                    </div>
                    {!!bottle && (
                      <div className="mt-1 ml-1 text-[13px] text-blue-700 font-semibold">
                        1개 = {bottle.standardMl}ml
                        {count > 0 && (
                          <> | {count}개 = {totalMl}ml</>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 위치선택 */}
            <LocationSelector
              value={
                locationLat && locationLng && locationName
                  ? { lat: Number(locationLat), lng: Number(locationLng), placeName: locationName }
                  : undefined
              }
              onChange={loc => {
                if (loc) {
                  setLocationLat(String(loc.lat));
                  setLocationLng(String(loc.lng));
                  setLocationName(loc.placeName);
                } else {
                  setLocationLat("");
                  setLocationLng("");
                  setLocationName("");
                }
              }}
            />

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
    </div>
  );
}
