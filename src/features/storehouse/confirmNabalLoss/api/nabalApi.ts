import { request } from "@/shared/api";

/** 나발 빠지는 연출을 봤다고 저장해요. 그 기록과 이전 기록을 모두 본 것으로 처리해요. */
export const confirmNabalLossSeen = (nabalLossId: number) =>
  request("PUT", "/api/users/me/seen-nabal-loss", { nabalLossId });
