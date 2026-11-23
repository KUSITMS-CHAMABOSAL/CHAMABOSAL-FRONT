import { request } from "@/shared/api";

interface NabalReplantResponse {
  /** 심은 뒤 공양미 표시 잔액 */
  riceBalance: number;
  /** 심은 뒤 남은 빠진 나발 번호, 오름차순. 비어 있으면 보살로 돌아와요. */
  fallenNumbers: number[];
}

/** 빠진 나발을 공양미로 다시 심어요. */
export const replantNabal = (nabalNumbers: number[]) =>
  request<NabalReplantResponse>("POST", "/api/users/me/nabal-replants", { nabalNumbers });
