import type { TapSendResponse } from "@/entities/vote";
import { request } from "@/shared/api";

/**
 * 톡톡 화면에 들어갈 때 한 번 보내요. 방어 전에 시작했다는 기록이라, 그사이 방어돼도 끝까지 보낼 수 있어요.
 * 다시 보내도 성공해요.
 */
export const startTaps = (roundId: number) => request("POST", `/api/rounds/${roundId}/taps/start`);

/** 톡톡을 끝낼 때 친 횟수를 한 번만 보내요. 0번(건너뛰기)도 보내요. */
export const sendTaps = (roundId: number, count: number) =>
  request<TapSendResponse>("POST", `/api/rounds/${roundId}/taps`, { count });
