import { useQuery } from "@tanstack/react-query";

import { voteQueries } from "./voteQueries";

/** 톡톡을 보낼 수 있는 동안 결과를 다시 받는 간격이에요. */
const TAP_REFETCH_MS = 60_000;

/**
 * 발표된 회차의 결과예요. 톡톡 가능 여부처럼 시간이 지나면 바뀌는 값이 있어 기본 신선도(30초)를 써요.
 * 화면을 띄워 둔 채 톡톡 시간이 끝나거나 지목된 보살이 방어하면 `canTap`이 꺼져야 해서,
 * 톡톡을 보낼 수 있는 동안은 1분마다 다시 받아요. 마감은 기기 시각이 아니라 서버의 `canTap`으로 판단해요.
 */
export const useRoundResultQuery = (roundId: number) =>
  useQuery({
    ...voteQueries.result(roundId),
    refetchInterval: query => (query.state.data?.canTap ? TAP_REFETCH_MS : false),
  });
