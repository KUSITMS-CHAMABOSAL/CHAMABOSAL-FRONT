import { useMutation, useQueryClient } from "@tanstack/react-query";

import { roomQueries } from "@/entities/room";

import { continuePot } from "../api/potDecisionApi";

/**
 * 방을 이어가요. 끝나면 성공하든 실패하든 오늘 탭을 다시 받아요.
 * 이미 고른 뒤(ROOM_011)라면 다시 받은 `isPotDecisionPending`이 false라 팝업이 다시 뜨지 않아요.
 */
export const useContinuePot = (roomId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => continuePot(roomId),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: roomQueries.today(roomId).queryKey }),
  });
};
