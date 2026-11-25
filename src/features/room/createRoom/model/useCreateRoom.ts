import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { RoomGoal } from "@/entities/room";
import { sessionQueries } from "@/entities/session";
import { logEvent } from "@/shared/lib/appsInToss";

import { createRoom } from "../api/createRoomApi";

/** 데이터 트래킹 정의서의 `goal_category` 값이에요. */
const GOAL_CATEGORY = {
  DELIVERY: "delivery",
  SNACK: "snack",
  SHOPPING: "shopping",
  ETC: "free",
} as const satisfies Record<RoomGoal, string>;

/** 방을 만들어요. 내 방 목록이 바뀌어서 내 정보를 다시 받아요. */
export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRoom,
    onSuccess: ({ isNewUser }, draft) => {
      if (isNewUser) logEvent("signup_complete", { entry: "direct" });
      logEvent("room_create_complete", {
        goal_category: GOAL_CATEGORY[draft.goal],
        target_rice: draft.potGoalAmount,
        planned_members: draft.memberLimit,
      });
      return queryClient.invalidateQueries({ queryKey: sessionQueries.me().queryKey });
    },
  });
};
