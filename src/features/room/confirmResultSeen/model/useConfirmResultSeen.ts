import { useMutation, useQueryClient } from "@tanstack/react-query";

import { roomQueries, type TodayResponse } from "@/entities/room";
import { sessionQueries } from "@/entities/session";
import { voteQueries } from "@/entities/vote";

import { confirmResultSeen } from "../api/resultApi";

/**
 * 투표 결과를 봤다고 저장해요. 방 홈은 안 본 결과가 있으면 투표 탭으로 보내서,
 * 저장에 실패해도 오늘 탭의 표시는 꺼요. 그대로 두면 홈에 가자마자 다시 투표 탭으로 와요(한 솥 축하와 같아요).
 * 서버는 본 회차 이전 결과도 함께 본 것으로 쳐서, 본 회차까지만 끄고 그 사이 발표된 더 최근 회차는 남겨요.
 * 성공하면 투표 탭(결과 확인 후·이마 톡톡으로 바뀜), 오늘 탭, 내 정보(방 이름 옆 빨간 점)를 다시 받아요.
 */
export const useConfirmResultSeen = (roomId: number) => {
  const queryClient = useQueryClient();
  const todayKey = roomQueries.today(roomId).queryKey;
  return useMutation({
    mutationFn: (roundId: number) => confirmResultSeen(roomId, roundId),
    onSettled: async (_data, error, roundId) => {
      await queryClient.cancelQueries({ queryKey: todayKey });
      queryClient.setQueryData<TodayResponse>(todayKey, today =>
        today?.entry.unseenResultRoundId != null && today.entry.unseenResultRoundId <= roundId
          ? { ...today, entry: { ...today.entry, unseenResultRoundId: null } }
          : today,
      );
      if (error) return;
      void queryClient.invalidateQueries({ queryKey: voteQueries.tab(roomId).queryKey });
      void queryClient.invalidateQueries({ queryKey: todayKey });
      void queryClient.invalidateQueries({ queryKey: sessionQueries.me().queryKey });
    },
  });
};
