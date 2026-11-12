// 월은 서버와 같은 "yyyy-MM", 날짜는 "yyyy-MM-dd" 문자열로 다뤄요.
// 서버 날짜를 new Date("2026-11-02")로 읽으면 UTC로 해석돼 시간대에 따라 하루 밀려서,
// Date는 연·월·일 숫자로만 만들고 비교는 문자열끼리 해요.

const pad = (value: number) => String(value).padStart(2, "0");

const parseMonth = (month: string) => {
  const [year, monthNumber] = month.split("-").map(Number);
  return { year, monthNumber };
};

/** "2026-01", -1 → "2025-12" */
export const shiftMonth = (month: string, delta: number) => {
  const { year, monthNumber } = parseMonth(month);
  const date = new Date(year, monthNumber - 1 + delta, 1);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
};

/** "2026-08" → "8월". 이번 달과 해가 다르면 "2025년 12월"이에요. */
export const formatMonthLabel = (month: string, thisMonth: string) => {
  const { year, monthNumber } = parseMonth(month);
  return year === parseMonth(thisMonth).year ? `${monthNumber}월` : `${year}년 ${monthNumber}월`;
};

/** 시안처럼 항상 6주를 그려서 달마다 높이가 바뀌지 않아요. */
const WEEKS = 6;

/**
 * 그 달의 6주 × 7일 격자예요. 일요일부터 시작하고, 그 달이 아닌 칸은 null이에요.
 * "2026-08" → [[null, …, "2026-08-01"], ["2026-08-02", …], …]
 */
export const getMonthGrid = (month: string): (string | null)[][] => {
  const { year, monthNumber } = parseMonth(month);
  const firstWeekday = new Date(year, monthNumber - 1, 1).getDay();
  const lastDay = new Date(year, monthNumber, 0).getDate();

  return Array.from({ length: WEEKS }, (_, week) =>
    Array.from({ length: 7 }, (_, weekday) => {
      const day = week * 7 + weekday - firstWeekday + 1;
      return day >= 1 && day <= lastDay ? `${month}-${pad(day)}` : null;
    }),
  );
};
