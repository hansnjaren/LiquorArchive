"use client";

import { useState, useMemo } from "react";
import userData from "../data/user.json";
import purchases from "../data/purchase.json";
import drinkLogs from "../data/drinkLog.json";
import bottles from "../data/bottle.json";
import { CARD_COLOR, TAB_LIST_COLOR, userId } from "../constants";
import {
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  getDate,
  getDaysInMonth,
} from "date-fns";
import YearMonthPicker from "../components/YearMonthPicker";
import CalendarHeader from "../components/CalendarHeader";
import SummaryCard from "../components/SummaryCard";
import UnitSelect from "../components/UnitSelect";
import AlcoholCumulativeChart from "../components/AlcoholCumulativeChart";
import { useYearMonthOptions } from "../hooks/useYearMonthOptions";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const BEER_UNIT = { name: "맥주 1캔(5.0%, 500ml)", abv: 5.0, ml: 500, label: "캔" };
const SOJU_UNIT = { name: "소주 1병(16.5%, 355ml)", abv: 16.5, ml: 355, label: "병" };
const ALCOHOL_UNIT = { name: "순수 알코올(ml)", abv: 100, ml: 1, label: "ml" };
const UNITS = [BEER_UNIT, SOJU_UNIT, ALCOHOL_UNIT];

function getUnitAlcoholMl(unit: typeof BEER_UNIT | typeof SOJU_UNIT | typeof ALCOHOL_UNIT) {
  return unit.ml * (unit.abv / 100);
}

export default function MyPage() {
  const user = userData.find((u) => u.id === userId);
  const today = new Date();
  const userLogs = useMemo(() => drinkLogs.filter(log => log.userId === userId), []);
  const { years, monthsByYear, minYear, minMonth } = useYearMonthOptions(userLogs, today);

  const [currentMonth, setCurrentMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [unit, setUnit] = useState<typeof UNITS[number]>(BEER_UNIT);

  const selectedYear = currentMonth.getFullYear();
  const selectedMonth = currentMonth.getMonth() + 1;

  // 월 이동 제한
  const isPrevMonthDisabled =
    selectedYear < minYear ||
    (selectedYear === minYear && selectedMonth <= minMonth);

  const isNextMonthDisabled =
    selectedYear > today.getFullYear() ||
    (selectedYear === today.getFullYear() && selectedMonth >= today.getMonth() + 1);

  // 구매 내역 요약
  const userPurchases = purchases.filter((p) => p.userId === userId);
  const totalQuantity = userPurchases.reduce((sum, p) => sum + (p.quantity ?? 0), 0);
  const totalSpent = userPurchases.reduce((sum, p) => sum + (p.price ?? 0) * (p.quantity ?? 0), 0);

  // 월별 음주 기록 추출
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const logsThisMonth = userLogs.filter((log) => {
    const d = new Date(log.date);
    return d >= monthStart && d <= monthEnd;
  });

  // 날짜별 누적 섭취량 계산
  const daysInMonth = getDaysInMonth(monthStart);
  let dailyAlcohol: number[] = Array(daysInMonth).fill(0);
  logsThisMonth.forEach((log) => {
    const bottle = bottles.find((b) => b.id === log.bottleId);
    if (!bottle) return;
    const abv = bottle.abv ?? 0;
    const pureAlcohol = log.amountMl * (abv / 100); // ml
    const day = getDate(new Date(log.date)) - 1;
    dailyAlcohol[day] += pureAlcohol;
  });
  let cumulativeAlcohol: number[] = [];
  dailyAlcohol.reduce((acc, cur, i) => {
    cumulativeAlcohol[i] = acc + cur;
    return cumulativeAlcohol[i];
  }, 0);

  // 단위 변환
  const unitAlcoholMl = getUnitAlcoholMl(unit);
  const dailyByUnit = dailyAlcohol.map((ml) => ml / unitAlcoholMl);
  let cumulativeByUnit: number[] = [];
  dailyByUnit.reduce((acc, cur, i) => {
    cumulativeByUnit[i] = acc + cur;
    return cumulativeByUnit[i];
  }, 0);

  const totalByUnit = cumulativeByUnit[daysInMonth - 1] || 0;

  // 연월 모달에서 선택
  const handleYearMonthSelect = (year: number, month: number) => {
    setCurrentMonth(new Date(year, month - 1, 1));
    setShowMonthPicker(false);
  };

  // 단위 선택 핸들러
  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "beer") setUnit(BEER_UNIT);
    else if (val === "soju") setUnit(SOJU_UNIT);
    else setUnit(ALCOHOL_UNIT);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">마이페이지</h2>
      <div className="flex items-center gap-4 mb-6">
        <img
          src={user?.image ?? "/noImage.png"}
          alt={user?.name ?? "프로필"}
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <div className="text-lg font-bold">{user?.name ?? "알 수 없음"}</div>
          <div className="text-gray-600">{user?.email ?? "이메일 미등록"}</div>
        </div>
      </div>
      <SummaryCard totalQuantity={totalQuantity} totalSpent={totalSpent} />
      <div 
        className="rounded shadow p-4 mb-8"
        style={{ backgroundColor: `${TAB_LIST_COLOR}`}}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${CARD_COLOR}`)}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = `${TAB_LIST_COLOR}`)}>
        <CalendarHeader
          currentMonth={currentMonth}
          onPrev={() => {
            if (!isPrevMonthDisabled)
              setCurrentMonth((prev) => subMonths(prev, 1));
          }}
          onNext={() => {
            if (!isNextMonthDisabled)
              setCurrentMonth((prev) => addMonths(prev, 1));
          }}
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
          <AlcoholCumulativeChart
            daysInMonth={daysInMonth}
            cumulativeByUnit={cumulativeByUnit}
            unit={unit}
          />
        </div>
        <div className="text-right font-bold text-blue-700">
          이 달의 총 섭취량: {totalByUnit.toLocaleString(undefined, { maximumFractionDigits: 2 })} {unit.label}
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
