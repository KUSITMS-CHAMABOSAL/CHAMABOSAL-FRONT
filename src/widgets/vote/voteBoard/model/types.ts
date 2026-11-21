import type { VoteCandidate } from "@/entities/vote";

/** 후보 고르기 캐러셀의 카드예요. 첫 카드는 항상 "오늘은 모두 보살"이에요. */
export type CandidateChoice = { kind: "allBosal" } | { kind: "member"; candidate: VoteCandidate };

/** 고른 카드예요. "오늘은 모두 보살"이거나 후보의 멤버 ID예요. */
export type ChoiceKey = "allBosal" | number;
