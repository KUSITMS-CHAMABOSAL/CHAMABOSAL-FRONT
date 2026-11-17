import { useQuery } from "@tanstack/react-query";

import { voteQueries } from "./voteQueries";

/** 지목된 내가 받은 톡톡이에요. 합계(`totalCount`)가 목탁 수행의 목표 횟수예요. */
export const useReceivedTapsQuery = (roundId: number) =>
  useQuery(voteQueries.receivedTaps(roundId));
