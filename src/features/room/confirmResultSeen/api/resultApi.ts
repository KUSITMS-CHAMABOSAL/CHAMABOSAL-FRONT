import { request } from "@/shared/api";

/** 결과를 어디까지 봤는지 저장해요. 그 회차와 이전 회차를 모두 본 것으로 처리해요. */
export const confirmResultSeen = (roomId: number, roundId: number) =>
  request("PUT", `/api/rooms/${roomId}/members/me/seen-result`, { roundId });
