import { useQuery } from "@tanstack/react-query";

import { voteQueries } from "./voteQueries";

/** 발표된 회차의 결과예요. 이마 톡톡에서는 지목된 보살의 닉네임을 써요. */
export const useRoundResultQuery = (roundId: number) => useQuery(voteQueries.result(roundId));
