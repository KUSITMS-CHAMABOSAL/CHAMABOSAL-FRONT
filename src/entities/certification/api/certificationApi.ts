import { request } from "@/shared/api";

import type { CalendarResponse } from "../model/types";

/** 내 인증 캘린더예요. `month`(yyyy-MM)를 비우면 서버 기준 이번 달이에요. */
export const getMyCalendar = (roomId: number, month?: string) =>
  request<CalendarResponse>(
    "GET",
    `/api/rooms/${roomId}/members/me/calendar${month ? `?month=${month}` : ""}`,
  );
