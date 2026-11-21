import type { VoteCandidate, VoteMemberSummary, VoteTabStatusResponse } from "../model/types";

/** 투표 탭에 그릴 화면이에요. 서버 상태 11가지를 화면 8가지로 묶어요. */
export type VoteView =
  | { kind: "underThree" }
  | { kind: "beforeFirstVote"; firstUncertifiedMember: VoteMemberSummary | null }
  | { kind: "notInList" }
  /** 투표권이 없어도 같은 화면에서 후보를 보고, 투표만 막혀요. */
  | {
      kind: "voting";
      roundId: number;
      closesAt: string;
      candidates: VoteCandidate[];
      canVote: boolean;
    }
  | { kind: "voted"; closesAt: string; votedCount: number; voterCount: number }
  /** 결과를 아직 안 봤거나, 봤거나, 본 뒤 이마 톡톡을 보낼 수 있을 때 모두 결과 화면이에요. */
  | { kind: "result"; roundId: number; isSeen: boolean }
  | { kind: "moktak"; roundId: number }
  | { kind: "noVote" };

export const getVoteView = (tab: VoteTabStatusResponse): VoteView => {
  switch (tab.status) {
    case "UNDER_THREE":
      return { kind: "underThree" };
    case "BEFORE_FIRST_VOTE":
      return { kind: "beforeFirstVote", firstUncertifiedMember: tab.firstUncertifiedMember };
    case "NOT_IN_LIST":
      return { kind: "notInList" };
    case "NO_VOTING_RIGHT":
    case "VOTING":
      return {
        kind: "voting",
        roundId: tab.roundId,
        closesAt: tab.closesAt,
        candidates: tab.candidates,
        canVote: tab.status === "VOTING",
      };
    case "VOTED":
      return {
        kind: "voted",
        closesAt: tab.closesAt,
        votedCount: tab.votedCount,
        voterCount: tab.voterCount,
      };
    case "RESULT_UNSEEN":
    case "RESULT_SEEN":
    case "TAP":
      return { kind: "result", roundId: tab.roundId, isSeen: tab.status !== "RESULT_UNSEEN" };
    case "MOKTAK":
      return { kind: "moktak", roundId: tab.roundId };
    case "NO_VOTE":
      return { kind: "noVote" };
  }
};
