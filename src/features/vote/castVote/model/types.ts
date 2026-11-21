// 이름과 필드는 API 문서(Swagger)와 같아요.

/** POST /api/rounds/{roundId}/votes. 후보 한 명이나 "오늘은 모두 보살"에 투표해요. */
export type VoteSubmitRequest =
  { targetType: "ALL_BOSAL" } | { targetType: "MEMBER"; targetMemberId: number };

export interface VoteSubmitResponse {
  /** 이 투표로 받은 개인 공양미. 방 인원이 1명이면 0 */
  riceEarned: number;
  /** 이 투표로 한 솥에 들어간 석. 방 인원이 1명이면 0 */
  potEarned: number;
  /** 이 표로 투표권 있는 명단 전원이 투표해 마감됐는지 */
  isClosed: boolean;
}
