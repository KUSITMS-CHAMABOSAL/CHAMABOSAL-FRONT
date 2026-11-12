// 서버 enum 중 여러 슬라이스가 같이 쓰는 값이에요. API 문서 components/schemas와 이름을 맞춰요.

/** 보살 색 */
export type BosalColor = "PINK" | "PURPLE" | "MINT" | "YELLOW";
/** `ENDURED` 참았어요, `FAILED` 못 참았어요 */
export type CertificationResult = "ENDURED" | "FAILED";
/** `RICE` 잘 참았어요, `MOKTAK` 아쉬워요 */
export type ReactionType = "RICE" | "MOKTAK";
/** 인증을 수정·삭제할 수 없는 이유. `TIME_OVER` 10분 지남, `VOTE_STARTED` 투표 시작 */
export type LockReason = "TIME_OVER" | "VOTE_STARTED";
