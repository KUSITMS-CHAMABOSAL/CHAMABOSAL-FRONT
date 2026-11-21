import type { BosalStatus } from "@/entities/bosal";
import type { VoteCandidate } from "@/entities/vote";

/** 후보 카드에 붙일 인증 상태예요. 인증하지 않은 후보는 미인증이에요. */
export const getCandidateStatus = ({ certification }: VoteCandidate): BosalStatus => {
  if (!certification) return "unverified";
  return certification.result === "ENDURED" ? "patient" : "failed";
};
