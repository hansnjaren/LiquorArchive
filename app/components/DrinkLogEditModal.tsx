"use client";

import { useRef, useState, useEffect } from "react";
import useLockBodyScroll from "../hooks/useLockBodyScroll";
import { TITLE_COLOR } from "../constants";
import type { DrinkType, DrinkLog } from "../types";
import { DrinkTypeDropdown } from "./DrinkTypeDropdown";
import LocationSelector from "./LocationSelector";
import { updateDrinkList } from "../utils/drinkList";

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

export default function DrinkLogEditModal({ log, bottles, onClose, onSubmit }: Props) {
  useLockBodyScroll(true);

  const logDateObj = new Date(log.date);
  const [date, setDate] = useState(getLocalDateString(logDateObj));
  const [time, setTime] = useState(getLocalTimeString(logDateObj));
  const [locationName, setLocationName] = useState(log.locationName ?? "");
  const [locationLat, setLocationLat] = useState(
    log.locationLat != null ? String(log.locationLat) : ""
  );
  const [locationLng, setLocationLng] = useState(
    log.locationLng != null ? String(log.locationLng) : ""
  );
  const [feelingScore, setFeelingScore] = useState(
    log.feelingScore != null ? String(log.feelingScore) : "3"
  );
  const [note, setNote] = useState(log.note ?? "");
  const [drinks, setDrinks] = useState<{ bottleId: string; count: string; search: string; dropdownOpen: boolean }[]>(
    () => {
      let arr =
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
                search: bottle?.name ?? "",
                dropdownOpen: false,
              };
            })
          : [];
      if (
        arr.length === 0 ||
        (arr[arr.length - 1].bottleId && arr[arr.length - 1].count)
      ) {
        arr.push({ bottleId: "", count: "", search: "", dropdownOpen: false });
      }
      return arr;
    }
  );

  // log, bottles 변경 시 drinks 동기화
  useEffect(() => {
    setDrinks(() => {
      let arr =
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
                search: bottle?.name ?? "",
                dropdownOpen: false,
              };
            })
          : [];
      if (
        arr.length === 0 ||
        (arr[arr.length - 1].bottleId && arr[arr.length - 1].count)
      ) {
        arr.push({ bottleId: "", count: "", search: "", dropdownOpen: false });
      }
      return arr;
    });
  }, [log, bottles]);

  const [closing, setClosing] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const todayStr = getLocalDateString(now);
  const maxTime = date === todayStr ? getLocalTimeString(now) : undefined;
  const maxDate = todayStr;

  const handleRequestClose = () => setClosing(true);

  // 🔴 외부 클릭 시 모달 닫기 (Add 모달과 동일)
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

  // 닫힘 애니메이션 완료시 onClose
  useEffect(() => {
    if (!closing) return;
    const el = backdropRef.current;
    if (!el) return;
    const handleAnimationEnd = () => onClose();
    el.addEventListener("animationend", handleAnimationEnd);
    return () => el.removeEventListener("animationend", handleAnimationEnd);
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
      className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 ${closing ? "animate-modal-out" : "animate-modal-in"}`}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-0"
        style={{ overflow: "hidden" }}
      >
        <div
          className="relative p-6 overflow-y-auto max-h-[80vh] rounded-lg"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#d4d4d8 #fff" }}
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
            <div>
              <label className="block text-sm font-semibold mb-1">
                술 종류 및 개수
              </label>
              {drinks.map((drink, idx) => {
                const bottle = bottles.find(b => b.id === drink.bottleId);
                const count = Number(drink.count);
                const totalMl =
                  bottle && !isNaN(count) && count > 0
                    ? count * Number(bottle.standardMl)
                    : null;
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
                          className="ml-2 text-red-400 text-xs h-10 px-3 rounded border border-red-300 hover:bg-red-50 transition flex items-center justify-center"
                          onClick={() => handleRemoveDrink(idx)}
                        >
                          삭제
                        </button>
                      )}
                    </div>
                    {!!bottle && (
                      <div className="mt-1 ml-1 text-[13px] text-blue-700 font-semibold">
                        1개 = {bottle.standardMl}ml
                        {count > 0 && !isNaN(count) && (
                          <> | {count}개 = {totalMl}ml</>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <LocationSelector
              value={
                locationLat && locationLng && locationName
                  ? {
                      lat: Number(locationLat),
                      lng: Number(locationLng),
                      placeName: locationName,
                    }
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
            <div>
              <label className="block text-sm font-semibold mb-1">메모(선택)</label>
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
              style={{ backgroundColor: `${TITLE_COLOR}` }}
            >
              저장
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
