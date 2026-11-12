import type { CertificationResult } from "@/shared/types";

// GET /api/rooms/{roomId}/members/me/calendar 응답이에요.

export interface CalendarDay {
  /** 회차 날짜 "2026-11-01". 05:00 전 인증은 전날로 들어와요. */
  date: string;
  result: CertificationResult;
}

export interface CalendarResponse {
  /** "2026-11". `month`를 비우고 요청하면 서버 기준 이번 달이에요. */
  month: string;
  /** 인증이 없는 날과 삭제한 인증은 빠져요. */
  calendar: CalendarDay[];
}
