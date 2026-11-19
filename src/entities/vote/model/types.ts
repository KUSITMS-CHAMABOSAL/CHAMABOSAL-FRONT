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
  /** 결과를 본 뒤 톡톡을 보낼 수 있어요. */
  | "TAP"
  /** 지목된 본인이 목탁 수행을 해야 해요. */
  | "MOKTAK"
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

export type RoundResultType = "PICKED" | "ALL_BOSAL" | "ALL_SAFE" | "DEFENDED";

/** 결과에서 지목된 보살이에요. */
export interface PickedMember {
  memberId: number;
  nickname: string;
  color: BosalColor;
  isLeft: boolean;
}

/**
 * GET /api/rounds/{roundId}/result. 발표된 회차의 결과예요.
 * 지금은 이마 톡톡에 쓰는 필드만 두고, 나머지(득표 수, 방어권 등)는 결과 화면 이슈에서 채워요.
 */
export interface RoundResultResponse {
  roundId: number;
  resultType: RoundResultType;
  /** PICKED·DEFENDED일 때만 있어요. */
  picked: PickedMember | null;
  isMePicked: boolean;
  /** 그 회차에 투표했고 아직 톡톡할 수 있으면 true예요. */
  canTap: boolean;
}

/** POST /api/rounds/{roundId}/taps */
export interface TapSendResponse {
  /** 1번 이상이면 5, 건너뛰면 0. 방 인원이 1명이면 0 */
  riceEarned: number;
  /** 한 솥에 들어간 석. riceEarned와 같아요. */
  potEarned: number;
}
