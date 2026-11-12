import { useQuery } from "@tanstack/react-query";

import { certificationQueries } from "./certificationQueries";

/** 내 인증 캘린더예요. `month`를 비우면 서버 기준 이번 달이에요. */
export const useCalendarQuery = (roomId: number, month?: string) =>
  useQuery(certificationQueries.calendar(roomId, month));
