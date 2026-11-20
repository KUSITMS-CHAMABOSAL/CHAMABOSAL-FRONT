import { useMutation, useQueryClient } from "@tanstack/react-query";

import { roomQueries, type TodayResponse } from "@/entities/room";

import { confirmPotSeen } from "../api/potApi";

/**
 * 한 솥 축하를 봤다고 저장해요. 방 홈은 안 본 축하가 있으면 이 화면으로 보내서,
 * 다시 받기 전에 오늘 탭의 표시부터 꺼야 홈으로 돌아가도 축하가 또 뜨지 않아요.
 * 저장에 실패해도 표시를 꺼요. 그대로 두면 홈에 가자마자 다시 이 화면으로 와서 나갈 수 없어요.
 * 실패했을 때는 다시 받지 않아요. 받으면 서버의 '안 봄'이 바로 돌아와 같은 문제가 생겨요.
 * 오늘 탭이 다음에 새로 받아질 때(30초 뒤 포커스, 재진입) 서버에 남은 대로 축하가 다시 떠요.
 */
export const useConfirmPotSeen = (roomId: number) => {
  const queryClient = useQueryClient();
  const todayKey = roomQueries.today(roomId).queryKey;
  return useMutation({
    mutationFn: (seq: number) => confirmPotSeen(roomId, seq),
    onSettled: async (_data, error) => {
      // 받는 중이던 오늘 탭이 나중에 도착해 꺼 둔 표시를 다시 켜지 않게 먼저 멈춰요.
      await queryClient.cancelQueries({ queryKey: todayKey });
      // 이 화면은 오늘 탭을 쓰지 않아 오래 머물면 캐시에서 지워져요. 그러면 끌 표시가 없으니 실패했을 때는 먼저 받아 둬요.
      // 받지 못하면 홈도 오늘 탭을 못 받아 다시 이 화면으로 오지 않아요.
      if (error) await queryClient.ensureQueryData(roomQueries.today(roomId)).catch(() => {});
      queryClient.setQueryData<TodayResponse>(
        todayKey,
        today => today && { ...today, entry: { ...today.entry, hasUnseenPotCelebration: false } },
      );
      if (!error) await queryClient.invalidateQueries({ queryKey: todayKey });
    },
  });
};
