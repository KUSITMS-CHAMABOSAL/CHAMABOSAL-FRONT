import { request } from "@/shared/api";

/** 솥을 채운 뒤 방장이 [더 수행하기]를 골라요. 다음 솥은 이미 시작돼 있어요. */
export const continuePot = (roomId: number) =>
  request("POST", `/api/rooms/${roomId}/pot-decision/continue`);

/** 솥을 채운 뒤 방장이 [방 닫기]를 골라요. 멤버 전원이 나가고 방이 지워져요. */
export const closeRoom = (roomId: number) => request("DELETE", `/api/rooms/${roomId}`);
