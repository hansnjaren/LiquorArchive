// app/components/useYearMonthOptions.ts
import { useMemo } from "react";

export function useYearMonthOptions(logs: any[], today: Date) {
  // 기록이 있는 연도 + 올해
  const years = useMemo(() => {
    const set = new Set(logs.map(log => new Date(log.date).getFullYear()));
    set.add(today.getFullYear());
    return Array.from(set).sort((a, b) => a - b);
  }, [logs, today]);

  // 기록이 있는 가장 과거 날짜
  const minDate = useMemo(() => {
    if (logs.length === 0) return today;
    return logs.reduce(
      (min, log) => new Date(log.date) < min ? new Date(log.date) : min,
      new Date(logs[0].date)
    );
  }, [logs, today]);
  const minYear = minDate.getFullYear();
  const minMonth = 1; // 1월까지 허용

  // 연도별 월 옵션 (올해는 이번 달까지만, 과거는 1~12월)
  const monthsByYear = useMemo(() => {
    const result: { [year: number]: number[] } = {};
    years.forEach((year) => {
      if (year === today.getFullYear()) {
        result[year] = Array.from({ length: today.getMonth() + 1 }, (_, i) => i + 1);
      } else {
        result[year] = Array.from({ length: 12 }, (_, i) => i + 1);
      }
    });
    return result;
  }, [years, today]);

  return { years, monthsByYear, minYear, minMonth };
}
