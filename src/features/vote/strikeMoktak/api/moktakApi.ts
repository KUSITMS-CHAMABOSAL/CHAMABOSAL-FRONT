import type { MoktakCompleteResponse } from "@/entities/vote";
import { request } from "@/shared/api";

/**
 * 목탁 수행을 끝낼 때 친 횟수와 함께 한 번 보내요. 끝까지 쳤을 때와 [종료하기]로 중간에 나갈 때 모두예요.
 * `count`가 받은 톡톡 합계보다 적으면 보상 없이(`riceEarned` 0) 끝나요. 어느 쪽이든 그 회차 수행은 끝나요.
 */
export const completeMoktak = (roundId: number, count: number) =>
  request<MoktakCompleteResponse>("POST", `/api/rounds/${roundId}/moktak`, { count });
