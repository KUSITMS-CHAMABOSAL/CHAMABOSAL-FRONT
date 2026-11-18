import type { RoomGoal } from "../model/types";

/** 방 만들기에서 고르는 순서예요. */
export const ROOM_GOALS: readonly RoomGoal[] = ["DELIVERY", "SNACK", "SHOPPING", "ETC"];

/** 절약 목표 이름이에요. 디자인 문구 "배달 끊기", "간식 참기", "쇼핑 참기", "자율 절약" */
export const ROOM_GOAL_LABEL: Record<RoomGoal, string> = {
  DELIVERY: "배달 끊기",
  SNACK: "간식 참기",
  SHOPPING: "쇼핑 참기",
  ETC: "자율 절약",
};

/** 절약 목표별 방 제목이에요. 서버의 `goalTitle`과 같아요(기획 방 정보 문구 표). */
export const ROOM_GOAL_TITLE: Record<RoomGoal, string> = {
  DELIVERY: "배달 끊기 방",
  SNACK: "간식 참기 방",
  SHOPPING: "쇼핑 참기 방",
  ETC: "자율 절약 방",
};
