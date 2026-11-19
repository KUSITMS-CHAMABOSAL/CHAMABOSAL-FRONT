import { queryOptions } from "@tanstack/react-query";

import { getReceivedTaps, getRoundResult, getVoteTab } from "./voteApi";

export const voteQueries = {
  all: () => ["vote"] as const,
  tab: (roomId: number) =>
    queryOptions({
      queryKey: [...voteQueries.all(), "room", roomId, "tab"],
      queryFn: () => getVoteTab(roomId),
    }),
  receivedTaps: (roundId: number) =>
    queryOptions({
      queryKey: [...voteQueries.all(), roundId, "receivedTaps"],
      queryFn: () => getReceivedTaps(roundId),
    }),
  result: (roundId: number) =>
    queryOptions({
      queryKey: [...voteQueries.all(), roundId, "result"],
      queryFn: () => getRoundResult(roundId),
    }),
};
