import type { RoomGoal } from "@/entities/room";
import type { BosalColor } from "@/shared/types";

/** 방 만들기 첫 화면에서 정한 값이에요. 닉네임을 받은 뒤 함께 보내요. */
export interface RoomDraft {
  goal: RoomGoal;
  name: string;
  memberLimit: number;
  potGoalAmount: number;
}

/** POST /api/rooms 요청이에요. */
export interface CreateRoomRequest extends RoomDraft {
  nickname: string;
  /** GET /api/rooms/new-color에서 뽑은 색이에요. */
  color: BosalColor;
}

/** POST /api/rooms 응답이에요. */
export interface CreateRoomResponse {
  roomId: number;
  memberId: number;
  nickname: string;
  color: BosalColor;
}
