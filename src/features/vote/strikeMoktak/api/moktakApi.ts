import type { MoktakCompleteResponse } from "@/entities/vote";
import { request } from "@/shared/api";

/** 받은 톡톡만큼 목탁을 끝까지 쳤을 때 한 번 보내요. `count`가 받은 톡톡 합계보다 적으면 MOKTAK_004로 거부돼요. */
export const completeMoktak = (roundId: number, count: number) =>
  request<MoktakCompleteResponse>("POST", `/api/rounds/${roundId}/moktak`, { count });
