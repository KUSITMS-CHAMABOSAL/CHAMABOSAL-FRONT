import { useQuery } from "@tanstack/react-query";

import { voteQueries } from "./voteQueries";

/** 톡톡을 보낼 수 있는 동안 결과를 다시 받는 간격이에요. */
const TAP_REFETCH_MS = 60_000;
/**
 * 지목된 보살이 방어권을 고민하는 동안 다시 받는 간격이에요. 서버에 실시간 알림이 없어 짧게 다시 받아요.
 * 고민은 최대 2분이라 요청은 많아야 24번이에요.
 */
const DEFENSE_PENDING_REFETCH_MS = 5_000;

interface RoundResultQueryOptions {
  /**
   * 톡톡을 보낼 수 있는 동안 1분마다, 지목된 보살이 방어권을 고민하는 동안 5초마다 다시 받아요. 결과 화면을 띄워 둔 채 톡톡 시간이 끝나거나
   * 지목된 보살이 방어하면 [이마 톡톡 하러가기]를 꺼야 해서 써요. 마감은 기기 시각이 아니라 서버의 `canTap`으로 판단해요.
   * 이마 톡톡 화면은 쓰지 않아요. 치는 중에 방어돼도 서버가 계속 받아 주는데, 다시 받으면 `canTap`이 꺼져 화면에서 나가요.
   */
  refetchWhileTappable?: boolean;
}

/** 발표된 회차의 결과예요. 톡톡 가능 여부처럼 시간이 지나면 바뀌는 값이 있어 기본 신선도(30초)를 써요. */
export const useRoundResultQuery = (
  roundId: number,
  { refetchWhileTappable = false }: RoundResultQueryOptions = {},
) =>
  useQuery({
    ...voteQueries.result(roundId),
    refetchInterval: query => {
      if (!refetchWhileTappable) return false;
      // 방어했는지 바로 보여주려고 고민 중에는 더 자주 받아요.
      if (query.state.data?.isDefensePending) return DEFENSE_PENDING_REFETCH_MS;
      return query.state.data?.canTap ? TAP_REFETCH_MS : false;
    },
  });
