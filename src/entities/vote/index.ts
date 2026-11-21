export { useReceivedTapsQuery } from "./api/useReceivedTapsQuery";
export { useRoundResultQuery } from "./api/useRoundResultQuery";
export { useVoteTabQuery } from "./api/useVoteTabQuery";
export { voteQueries } from "./api/voteQueries";
export * from "./config/vote";
export { getVoteView, type VoteView } from "./lib/getVoteView";
export type {
  MoktakCompleteResponse,
  ReceivedTap,
  ReceivedTapsResponse,
  RoundResultResponse,
  VoteCandidate,
  VoteTabStatus,
  VoteTabStatusResponse,
} from "./model/types";
