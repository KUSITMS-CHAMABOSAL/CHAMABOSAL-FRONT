import { request } from "@/shared/api";

/** 이 방에서 쓰는 내 닉네임을 바꿔요. 이미 쓰는 닉네임이면 `ROOM_004`예요. */
export const updateMyNickname = (roomId: number, nickname: string) =>
  request("PATCH", `/api/rooms/${roomId}/members/me/nickname`, { nickname });
