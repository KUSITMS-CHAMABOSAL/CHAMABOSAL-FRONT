import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sessionQueries } from "@/entities/session";
import { voteQueries } from "@/entities/vote";

import { completeMoktak } from "../api/moktakApi";

/**
 * 목탁 수행을 마쳤다고 보내요. 받은 톡톡(완료 여부)과 공양미가 바뀌니 둘 다 다시 받아요.
 * 수행 중에 톡톡이 더 와서 거부(MOKTAK_004)돼도 받은 톡톡을 다시 받아 늘어난 목표로 이어 쳐요.
 */
export const useCompleteMoktak = (roundId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (count: number) => completeMoktak(roundId, count),
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: voteQueries.receivedTaps(roundId).queryKey }),
        queryClient.invalidateQueries({ queryKey: sessionQueries.me().queryKey }),
      ]),
  });
};
