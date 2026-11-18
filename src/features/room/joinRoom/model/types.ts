import type { BosalColor } from "@/shared/types";

/** POST /api/invites/{token}/join 응답이에요. 보살 색은 서버가 이 방에서 안 쓰는 색으로 정해요. */
export interface JoinRoomResponse {
  roomId: number;
  memberId: number;
  nickname: string;
  color: BosalColor;
}
