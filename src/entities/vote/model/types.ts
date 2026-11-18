import type { BosalColor } from "@/shared/types";

// 이름과 필드는 API 문서(Swagger)와 같아요.

export type VoteTabStatus =
  | "UNDER_THREE"
  | "BEFORE_FIRST_VOTE"
  | "NOT_IN_LIST"
  | "NO_VOTING_RIGHT"
  | "VOTING"
  | "VOTED"
  | "RESULT_UNSEEN"
  | "RESULT_SEEN";

/**
 * GET /api/rooms/{roomId}/vote. 방의 투표 탭 상태예요.
 * 지금은 목탁 수행으로 들어갈 회차 ID만 써요. 나머지 필드(후보, 마감 시각 등)는 투표 화면 이슈에서 채워요.
 */
export interface VoteTabStatusResponse {
  status: VoteTabStatus;
  /** 상태에 따라 회차가 없으면 비어 있어요. */
  roundId: number | null;
}

/** 나에게 톡톡을 보낸 친구 한 명이에요. */
export interface ReceivedTap {
  nickname: string;
  color: BosalColor;
  count: number;
}

/** GET /api/rounds/{roundId}/taps/received. 지목된 내가 받은 톡톡이에요. */
export interface ReceivedTapsResponse {
  /** 톡톡이 나에게 전달됐는지예요. 투표 마감 뒤 일정 시간이 지나야 전달돼요. */
  isDelivered: boolean;
  deliveredAt: string | null;
  /** 받은 톡톡 합계예요. 이만큼 목탁을 쳐야 수행이 끝나요. */
  totalCount: number;
  /** 이미 목탁 수행을 마쳤는지예요. */
  isMoktakDone: boolean;
  taps: ReceivedTap[];
}

/** POST /api/rounds/{roundId}/moktak */
export interface MoktakCompleteResponse {
  /** 번뇌 완료 보상이에요. 처음 완료하면 10, 이미 완료했거나 방 인원이 1명이면 0 */
  riceEarned: number;
}
