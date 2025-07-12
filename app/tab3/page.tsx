"use client";
import { useState } from "react";
import { userId } from "../constants";
import drinkLogsData from "../data/drinkLog.json";
import bottles from "../data/bottle.json";
import { useYearMonthOptions } from "../hooks/useYearMonthOptions";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
} from "date-fns";
import CalendarView from "../components/CalendarView";

export default function CalendarContainer() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [logs, setLogs] = useState(drinkLogsData);
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [addLogDate, setAddLogDate] = useState<Date | null>(null);
  const [editLog, setEditLog] = useState<any | null>(null);

  const userDrinkLogs = logs.filter((log) => log.userId === userId);

  // 연/월 옵션 계산
  const { years, monthsByYear, minYear, minMonth } = useYearMonthOptions(userDrinkLogs, today);

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
    userDrinkLogs.map((log) => format(new Date(log.date), "yyyy-MM-dd"))
  );

  // 날짜별 음주 기록
  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const logsForSelectedDate = selectedDate
    ? userDrinkLogs
        .filter((log) => format(new Date(log.date), "yyyy-MM-dd") === selectedDateStr)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  const getBottleName = (bottleId: string) => {
    const bottle = bottles.find((b) => b.id === bottleId);
    return bottle ? bottle.name : "-";
  };

  // 모달 핸들러
  const handleAddLog = (newLog: any) => setLogs((prev) => [...prev, newLog]);
  const handleEditLog = (updatedLog: any) => setLogs((prev) => prev.map((log) => (log.id === updatedLog.id ? updatedLog : log)));
  const handleDeleteLog = (id: string) => setLogs((prev) => prev.filter((log) => log.id !== id));
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
      userDrinkLogs={userDrinkLogs}
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
      getBottleName={getBottleName}
      handleAddLog={handleAddLog}
      handleEditLog={handleEditLog}
      handleDeleteLog={handleDeleteLog}
      handleAddTodayLog={handleAddTodayLog}
      handleAddModalLog={handleAddModalLog}
      handleYearMonthSelect={handleYearMonthSelect}
      moveModalDate={moveModalDate}
      bottles={bottles}
      userId={userId}
    />
  );
}
