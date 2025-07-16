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
  // if (!res.ok) throw new Error("음주 기록을 불러오지 못했습니다.");
  return res.json();
}

// DrinkType fetch 함수
async function fetchDrinkTypes(): Promise<DrinkType[]> {
  const res = await fetch("/api/drinkTypes");
  // if (!res.ok) throw new Error("주종 목록을 불러오지 못했습니다.");
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

  // 추가/수정/삭제/모달 상태
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [addLogDate, setAddLogDate] = useState<Date | null>(null);
  const [editLog, setEditLog] = useState<DrinkLog | null>(null);

  // ✅ logs fetch 함수 (재활용 가능하도록 정의)
  const refetchDrinkLogs = async () => {
    try {
      const updatedLogs = await fetchDrinkLogs();
      setLogs(updatedLogs);
    } catch (err) {
      alert("음주 기록을 다시 불러오지 못했습니다.");
    }
  };

  // 초기 데이터 로드
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

  const { years, monthsByYear, minYear, minMonth } = useYearMonthOptions(logs, today);

  const selectedYear = currentMonth.getFullYear();
  const selectedMonth = currentMonth.getMonth() + 1;

  const isPrevMonthDisabled =
    selectedYear < minYear ||
    (selectedYear === minYear && selectedMonth <= minMonth);

  const isNextMonthDisabled =
    selectedYear > today.getFullYear() ||
    (selectedYear === today.getFullYear() && selectedMonth >= today.getMonth() + 1);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);

  const userDrinkDates = new Set(
    logs.map((log) => format(new Date(log.date), "yyyy-MM-dd"))
  );

  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const logsForSelectedDate = selectedDate
    ? logs
        .filter((log) => format(new Date(log.date), "yyyy-MM-dd") === selectedDateStr)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  // 🍶 병 이름 조회
  const getDrinkTypeName = (drinkTypeId: string) => {
    const drinkType = drinkTypes.find((d) => d.id === drinkTypeId);
    return drinkType ? drinkType.name : "-";
  };

  // ✅ 기록 추가 후 데이터 다시 불러오기
  const handleAddLog = async (newLog: DrinkLog) => {
    await refetchDrinkLogs();
    setShowAddLogModal(false); // 모달 닫기
  };

  // ✅ 기록 수정 후 데이터 다시 불러오기
  const handleEditLog = async (updatedLog: DrinkLog) => {
    await refetchDrinkLogs();
    setEditLog(null); // 수정 모달 닫기
  };

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

  const handleAddTodayLog = () => {
    setAddLogDate(today);
    setShowAddLogModal(true);
  };

  const handleAddModalLog = (date: Date) => {
    const now = new Date();
    // 선택된 날짜의 년/월/일 + 현재 시/분/초로 새 Date 만들기
    const newDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    );
    setAddLogDate(newDateTime);
    setShowAddLogModal(true);
  };

  const handleYearMonthSelect = (year: number, month: number) => {
    setCurrentMonth(new Date(year, month - 1, 1));
    setShowMonthPicker(false);
  };

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

  return (
    <CalendarView
      loading={loading}
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
