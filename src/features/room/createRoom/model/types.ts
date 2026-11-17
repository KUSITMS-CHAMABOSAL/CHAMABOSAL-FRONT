import type { RoomGoal } from "@/entities/room";

/** 방 만들기 첫 화면에서 정한 값이에요. 닉네임을 받은 뒤 함께 보내요. */
export interface RoomDraft {
  goal: RoomGoal;
  name: string;
  memberLimit: number;
  potGoalAmount: number;
}
