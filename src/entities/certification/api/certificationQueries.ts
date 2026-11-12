import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { getMyCalendar } from "./certificationApi";

/** 지난 달 기록은 인증 후 10분이 지나면 바뀌지 않아서 오래 캐시해요. */
const CALENDAR_STALE_TIME = 10 * 60_000;

export const certificationQueries = {
  all: () => ["certification"] as const,
  /** 한 방의 모든 달 캘린더예요. 인증을 지우거나 방을 나가면 이 키로 한 번에 다뤄요. */
  calendars: (roomId: number) => [...certificationQueries.all(), "calendar", roomId] as const,
  /** `month`(yyyy-MM)를 비우면 서버 기준 이번 달이에요. */
  calendar: (roomId: number, month?: string) =>
    queryOptions({
      queryKey: [...certificationQueries.calendars(roomId), month ?? "current"],
      queryFn: () => getMyCalendar(roomId, month),
      staleTime: month ? CALENDAR_STALE_TIME : undefined,
      // 달을 넘기는 동안 이전 달을 그대로 보여줘서 화면이 비지 않아요.
      placeholderData: keepPreviousData,
    }),
};
