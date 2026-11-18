import { useQuery } from "@tanstack/react-query";

import { voteQueries } from "./voteQueries";

/** 방의 투표 탭 상태예요. 회차 ID(`roundId`)도 여기서 받아요. */
export const useVoteTabQuery = (roomId: number) => useQuery(voteQueries.tab(roomId));
