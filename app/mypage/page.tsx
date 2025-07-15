"use client";

import { useState, useEffect } from "react";
import { addMonths, subMonths, getDaysInMonth, format } from "date-fns";
import { useSession } from "next-auth/react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import YearMonthPicker from "../components/YearMonthPicker";
import CalendarHeader from "../components/CalendarHeader";
import SummaryCard from "../components/SummaryCard";
import UnitSelect from "../components/UnitSelect";
import AlcoholCumulativeChart from "../components/AlcoholCumulativeChart";
import AccountDeleteButton from "../components/AccountDeleteButton";
import UserEditModal from "../components/UserEditModal";
import { CARD_COLOR, TAB_LIST_COLOR } from "../constants";
import { useYearMonthOptions } from "../hooks/useYearMonthOptions";
import type { DrinkLog } from "../types";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

const BEER_UNIT = {
  name: "맥주 1캔(5.0%, 500ml)",
  abv: 5.0,
  ml: 500,
  label: "캔",
};
const SOJU_UNIT = {
  name: "소주 1병(16.5%, 360ml)",
  abv: 16.5,
  ml: 360,
  label: "병",
};
const ALCOHOL_UNIT = { name: "순수 알코올(mg)", abv: 100, ml: 1, label: "mg" };
const UNITS = [BEER_UNIT, SOJU_UNIT, ALCOHOL_UNIT];
function getUnitAlcoholMl(
  unit: typeof BEER_UNIT | typeof SOJU_UNIT | typeof ALCOHOL_UNIT
) {
  return unit.ml * (unit.abv / 100);
}

type DailyAlcohol = { date: string; alcoholGram: number };
type ServerStats = {
  totalQuantity: number;
  totalSpent: number;
  dailyAlcoholGram?: DailyAlcohol[];
  daysInMonth: number;
};
type ProfileStats = {
  totalPurchaseCount: number;
  totalDrinkingDays: number;
};

export default function MyPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [unit, setUnit] = useState<(typeof UNITS)[number]>(BEER_UNIT);
  const [stats, setStats] = useState<ServerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);

  // 기록 데이터 fetch (달력범위 제한)
  const [logs, setLogs] = useState<DrinkLog[]>([]);
  useEffect(() => {
    fetch("/api/drinkingLogs/me", { credentials: "include" })
      .then((res) => res.json())
      .then(setLogs)
      .catch(() => setLogs([]));
  }, []);

  // 프로필 통계 fetch 및 State
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const fetchProfileStats = async () => {
    try {
      const res = await fetch("/api/profileStats", {
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "프로필 통계를 불러오는 중 오류 발생");
      }
      const data = await res.json();
      setProfileStats(data);
    } catch (err) {
      console.error("fetchProfileStats error:", err);
      setProfileStats(null);
    }
  };
  useEffect(() => {
    fetchProfileStats();
  }, []);

  const { years, monthsByYear, minYear, minMonth } = useYearMonthOptions(
    logs,
    today
  );

  const selectedYear = currentMonth.getFullYear();
  const selectedMonth = currentMonth.getMonth() + 1;

  const isPrevMonthDisabled =
    selectedYear < minYear ||
    (selectedYear === minYear && selectedMonth <= minMonth);
  const isNextMonthDisabled =
    selectedYear > today.getFullYear() ||
    (selectedYear === today.getFullYear() &&
      selectedMonth >= today.getMonth() + 1);

  const { data: session } = useSession();

  const makeMonthParam = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    const monthParam = makeMonthParam(currentMonth);
    try {
      const res = await fetch(`/api/drinkingLogs/stats?month=${monthParam}`, {
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "서버 오류");
      }
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [currentMonth]);

  const daysInMonth = stats?.daysInMonth ?? getDaysInMonth(currentMonth);
  const unitAlcoholMl = getUnitAlcoholMl(unit);
  const rawDaily = stats?.dailyAlcoholGram ?? [];

  const dateToGram: Record<string, number> = {};
  rawDaily.forEach((d) => {
    dateToGram[d.date] = d.alcoholGram;
  });

  const labels: string[] = [];
  const values: number[] = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const dateObj = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      i
    );
    const dateStr = format(dateObj, "yyyy-MM-dd");
    labels.push(String(i));
    values.push(dateToGram[dateStr] ?? 0);
  }

  const valuesByUnit = values.map((gram) => gram / unitAlcoholMl);
  const totalByUnit = valuesByUnit.reduce((a, b) => a + b, 0);

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "beer") setUnit(BEER_UNIT);
    else if (val === "soju") setUnit(SOJU_UNIT);
    else setUnit(ALCOHOL_UNIT);
  };

  const handleYearMonthSelect = (year: number, month: number) => {
    setCurrentMonth(new Date(year, month - 1, 1));
    setShowMonthPicker(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">마이페이지</h2>
      <div className="flex items-center gap-4 mb-6">
        <img
          src={session?.user?.image ?? "/noImage.png"}
          alt={session?.user?.name ?? "프로필"}
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <div className="text-lg font-bold">
            {session?.user?.name ?? "알 수 없음"}
          </div>
          <div className="text-gray-600">
            {session?.user?.email ?? "이메일 미등록"}
          </div>
        </div>
      </div>
      <div className="flex w-full items-center mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setEditOpen(true)}
        >
          회원정보 수정
        </button>
        <div className="ml-auto">
          <AccountDeleteButton />
        </div>
        {editOpen && (
          <UserEditModal
            onClose={() => setEditOpen(false)}
            onSuccess={() => {
              alert("수정 완료!");
              fetchStats();
              fetchProfileStats();
            }}
          />
        )}
      </div>
      <SummaryCard
        totalPurchaseCount={profileStats?.totalPurchaseCount ?? 0}
        totalDrinkingDays={profileStats?.totalDrinkingDays ?? 0}
      />
      <div
        className="rounded-lg shadow p-4 mb-8"
        style={{ backgroundColor: TAB_LIST_COLOR }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = CARD_COLOR)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = TAB_LIST_COLOR)
        }
      >
        <CalendarHeader
          currentMonth={currentMonth}
          onPrev={() => setCurrentMonth((prev) => subMonths(prev, 1))}
          onNext={() => setCurrentMonth((prev) => addMonths(prev, 1))}
          onShowPicker={() => setShowMonthPicker(true)}
          isPrevDisabled={isPrevMonthDisabled}
          isNextDisabled={isNextMonthDisabled}
        />
        <div className="mb-4">
          <UnitSelect
            value={
              unit.name === BEER_UNIT.name
                ? "beer"
                : unit.name === SOJU_UNIT.name
                ? "soju"
                : "alcohol"
            }
            onChange={handleUnitChange}
          />
        </div>
        <div className="mb-4">
          <div className="w-full h-[320px]">
            <AlcoholCumulativeChart
              key={valuesByUnit.join(",")}
              labels={labels}
              dailyByUnit={valuesByUnit}
              unit={unit}
              loading={loading}
            />
          </div>
        </div>
        {error && <div className="py-12 text-center text-red-500">{error}</div>}
        <div className="text-right font-bold text-blue-700">
          이 달의 총 섭취량:{" "}
          {totalByUnit.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}{" "}
          {unit.label}
        </div>
      </div>
      <YearMonthPicker
        open={showMonthPicker}
        onClose={() => setShowMonthPicker(false)}
        onSelect={handleYearMonthSelect}
        years={years}
        monthsByYear={monthsByYear}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
      />
    </div>
  );
}
