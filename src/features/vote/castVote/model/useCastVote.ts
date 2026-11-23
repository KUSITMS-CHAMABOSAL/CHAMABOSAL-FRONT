import { useMutation, useQueryClient } from "@tanstack/react-query";

import { roomQueries } from "@/entities/room";
import { sessionQueries } from "@/entities/session";
import { voteQueries } from "@/entities/vote";

import { castVote } from "../api/voteApi";
import type { VoteSubmitRequest } from "./types";

/**
 * 투표해요. 투표 탭(투표 완료로 바뀜), 오늘 탭(한 솥 +5석), 내 정보(공양미 +5석)를 다시 받아요.
 * 실패해도 투표 탭은 다시 받아요. 그 사이 마감됐거나 이미 투표했으면 지금 상태로 바뀌어야 해요.
 */
export const useCastVote = (roomId: number, roundId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: VoteSubmitRequest) => castVote(roundId, body),
    // 다시 받기를 기다리지 않아요. 여기서 Promise를 돌려주면 화면의 onSuccess·onError가 재조회 뒤로 밀려요.
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: voteQueries.tab(roomId).queryKey });
      void queryClient.invalidateQueries({ queryKey: roomQueries.today(roomId).queryKey });
      void queryClient.invalidateQueries({ queryKey: sessionQueries.me().queryKey });
    },
  });
};
