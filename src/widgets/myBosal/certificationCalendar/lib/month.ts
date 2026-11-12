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

export interface CalendarCell {
  /** "yyyy-MM-dd" */
  date: string;
  /** 보고 있는 달의 날짜인지예요. 앞뒤 달 날짜는 흐리게 그려요. */
  inMonth: boolean;
}

/**
 * 그 달의 6주 × 7일 격자예요. 일요일부터 시작하고, 빈칸은 앞뒤 달 날짜로 채워요.
 * "2026-08" → [["2026-07-26", …, "2026-08-01"], ["2026-08-02", …], …]
 */
export const getMonthGrid = (month: string): CalendarCell[][] => {
  const { year, monthNumber } = parseMonth(month);
  const firstWeekday = new Date(year, monthNumber - 1, 1).getDay();

  return Array.from({ length: WEEKS }, (_, week) =>
    Array.from({ length: 7 }, (_, weekday) => {
      // 1일보다 앞이거나 말일보다 뒤인 날은 Date가 앞뒤 달로 넘겨줘요.
      const date = new Date(year, monthNumber - 1, week * 7 + weekday - firstWeekday + 1);
      return {
        date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
        inMonth: date.getMonth() === monthNumber - 1,
      };
    }),
  );
};
