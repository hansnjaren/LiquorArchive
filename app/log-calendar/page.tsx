"use client";
import { useEffect, useState } from "react";
import { useYearMonthOptions } from "../hooks/useYearMonthOptions";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
} from "date-fns";
import CalendarView from "../components/CalendarView";
import type { DrinkLog, DrinkType } from "../types";

// 음주 기록 fetch 함수
async function fetchDrinkLogs(): Promise<DrinkLog[]> {
  const res = await fetch("/api/drinkingLogs/me", { credentials: "include" });
  if (!res.ok) throw new Error("음주 기록을 불러오지 못했습니다.");
  return res.json();
}

// DrinkType fetch 함수
async function fetchDrinkTypes(): Promise<DrinkType[]> {
  const res = await fetch("/api/drinkTypes");
  if (!res.ok) throw new Error("주종 목록을 불러오지 못했습니다.");
  return res.json();
}

export default function CalendarContainer() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [logs, setLogs] = useState<DrinkLog[]>([]);
  const [drinkTypes, setDrinkTypes] = useState<DrinkType[]>([]);
  const [loading, setLoading] = useState(true);

  // 추가/수정/삭제/모달 상태 등은 기존과 동일하게 선언
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [addLogDate, setAddLogDate] = useState<Date | null>(null);
  const [editLog, setEditLog] = useState<DrinkLog | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchDrinkLogs(), fetchDrinkTypes()])
      .then(([logs, drinkTypes]) => {
        setLogs(logs);
        setDrinkTypes(drinkTypes);
      })
      .catch(e => alert(e.message))
      .finally(() => setLoading(false));
  }, []);

  // 연/월 옵션 계산 (DB 데이터 기반)
  const { years, monthsByYear, minYear, minMonth } = useYearMonthOptions(logs, today);

  const selectedYear = currentMonth.getFullYear();
  const selectedMonth = currentMonth.getMonth() + 1;

  // 월 이동 제한
  const isPrevMonthDisabled =
    selectedYear < minYear ||
    (selectedYear === minYear && selectedMonth <= minMonth);

  const isNextMonthDisabled =
    selectedYear > today.getFullYear() ||
    (selectedYear === today.getFullYear() && selectedMonth >= today.getMonth() + 1);

  // 달력 렌더링 준비
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);

  // 음주 기록이 있는 날짜 Set (yyyy-MM-dd)
  const userDrinkDates = new Set(
    logs.map((log) => format(new Date(log.date), "yyyy-MM-dd"))
  );

  // 날짜별 음주 기록
  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const logsForSelectedDate = selectedDate
    ? logs
        .filter((log) => format(new Date(log.date), "yyyy-MM-dd") === selectedDateStr)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  // 병 이름 찾기
  const getDrinkTypeName = (drinkTypeId: string) => {
    const drinkType = drinkTypes.find((d) => d.id === drinkTypeId);
    return drinkType ? drinkType.name : "-";
  };

  // 모달 핸들러
  const handleAddLog = (newLog: DrinkLog) => setLogs((prev) => [...prev, newLog]);
  const handleEditLog = (updatedLog: DrinkLog) => setLogs((prev) => prev.map((log) => (log.id === updatedLog.id ? updatedLog : log)));

  // === DB와 연동되는 삭제 함수 ===
  const handleDeleteLog = async (id: string) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/drinkingLogs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert("삭제 실패: " + (err.message ?? res.status));
        return;
      }
      setLogs((prev) => prev.filter((log) => log.id !== id));
    } catch (err: any) {
      alert("서버 오류: " + (err?.message ?? err));
    }
  };
  // ============================

  const handleAddTodayLog = () => { setAddLogDate(today); setShowAddLogModal(true); };
  const handleAddModalLog = (date: Date) => { setAddLogDate(date); setShowAddLogModal(true); };

  // 연/월 모달에서 선택
  const handleYearMonthSelect = (year: number, month: number) => {
    setCurrentMonth(new Date(year, month - 1, 1));
    setShowMonthPicker(false);
  };

  // 이전/다음 날짜로 이동
  const moveModalDate = (offset: number) => {
    if (!selectedDate) return;
    let newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + offset);
    const todayStr = format(today, "yyyy-MM-dd");
    if (format(newDate, "yyyy-MM-dd") > todayStr) return;
    if (
      newDate.getMonth() !== currentMonth.getMonth() ||
      newDate.getFullYear() !== currentMonth.getFullYear()
    ) {
      setCurrentMonth(newDate);
    }
    setSelectedDate(newDate);
  };

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <CalendarView
      today={today}
      currentMonth={currentMonth}
      setCurrentMonth={setCurrentMonth}
      showMonthPicker={showMonthPicker}
      setShowMonthPicker={setShowMonthPicker}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      logs={logs}
      setLogs={setLogs}
      showAddLogModal={showAddLogModal}
      setShowAddLogModal={setShowAddLogModal}
      addLogDate={addLogDate}
      setAddLogDate={setAddLogDate}
      editLog={editLog}
      setEditLog={setEditLog}
      years={years}
      monthsByYear={monthsByYear}
      minYear={minYear}
      minMonth={minMonth}
      selectedYear={selectedYear}
      selectedMonth={selectedMonth}
      isPrevMonthDisabled={isPrevMonthDisabled}
      isNextMonthDisabled={isNextMonthDisabled}
      monthStart={monthStart}
      monthEnd={monthEnd}
      userDrinkDates={userDrinkDates}
      logsForSelectedDate={logsForSelectedDate}
      getBottleName={getDrinkTypeName}
      handleAddLog={handleAddLog}
      handleEditLog={handleEditLog}
      handleDeleteLog={handleDeleteLog}
      handleAddTodayLog={handleAddTodayLog}
      handleAddModalLog={handleAddModalLog}
      handleYearMonthSelect={handleYearMonthSelect}
      moveModalDate={moveModalDate}
      bottles={drinkTypes}
      userId={""} // 필요시 세션에서 받아서 넘기세요
    />
  );
}
