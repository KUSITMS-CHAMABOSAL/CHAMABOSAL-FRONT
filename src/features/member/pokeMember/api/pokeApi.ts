import { request } from "@/shared/api";

/** 요청 한 번에 보낼 수 있는 최대 횟수예요. API 문서 `count` 1~30 */
export const MAX_POKES_PER_REQUEST = 30;

export const createPoke = (roomId: number, toMemberId: number, count: number) =>
  request("POST", `/api/rooms/${roomId}/pokes`, { toMemberId, count });
