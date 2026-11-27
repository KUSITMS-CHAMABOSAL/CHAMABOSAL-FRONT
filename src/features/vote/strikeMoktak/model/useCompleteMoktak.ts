import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sessionQueries } from "@/entities/session";
import { voteQueries } from "@/entities/vote";

import { completeMoktak } from "../api/moktakApi";

/**
 * 목탁 수행을 끝냈다고 보내요(다 쳤을 때와 [종료하기]). 받은 톡톡(끝냈는지)과 공양미가 바뀌니 둘 다 다시 받아요.
 * 투표 탭은 받아 둔 상태(목탁 수행)를 지워요. 다시 받기만 하면 돌아갈 때 받아 둔 상태를 먼저 그려서 목탁 화면으로 다시 와요.
 */
export const useCompleteMoktak = (roomId: number, roundId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (count: number) => completeMoktak(roundId, count),
    // 다시 받기를 기다리지 않아요. 여기서 Promise를 돌려주면 화면의 onSuccess·onError가 재조회 뒤로 밀려요.
    onSettled: () => {
      queryClient.removeQueries({ queryKey: voteQueries.tab(roomId).queryKey });
      void queryClient.invalidateQueries({ queryKey: voteQueries.receivedTaps(roundId).queryKey });
      void queryClient.invalidateQueries({ queryKey: sessionQueries.me().queryKey });
    },
  });
};
