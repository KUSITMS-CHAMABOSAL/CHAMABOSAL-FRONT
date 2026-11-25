import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sessionQueries } from "@/entities/session";
import { voteQueries } from "@/entities/vote";
import { logEvent } from "@/shared/lib/appsInToss";

import { completeMoktak } from "../api/moktakApi";

/**
 * 목탁 수행을 마쳤다고 보내요. 받은 톡톡(완료 여부)과 공양미가 바뀌니 둘 다 다시 받아요.
 * 수행 중에 톡톡이 더 와서 거부(MOKTAK_004)되면, 다시 받은 톡톡으로 목표가 늘어 이어 쳐요.
 */
export const useCompleteMoktak = (roundId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (count: number) => completeMoktak(roundId, count),
    onSuccess: (_, count) =>
      logEvent("tap_session_complete", { role: "receiver", tap_count: count, completed: true }),
    // 다시 받기를 기다리지 않아요. 여기서 Promise를 돌려주면 화면의 onSuccess·onError가 재조회 뒤로 밀려요.
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: voteQueries.receivedTaps(roundId).queryKey });
      void queryClient.invalidateQueries({ queryKey: sessionQueries.me().queryKey });
    },
  });
};
