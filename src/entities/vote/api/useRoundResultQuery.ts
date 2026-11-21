import { useQuery } from "@tanstack/react-query";

import { voteQueries } from "./voteQueries";

/** 발표된 회차의 결과예요. 톡톡 가능 여부처럼 시간이 지나면 바뀌는 값이 있어 기본 신선도(30초)를 써요. */
export const useRoundResultQuery = (roundId: number) => useQuery(voteQueries.result(roundId));
