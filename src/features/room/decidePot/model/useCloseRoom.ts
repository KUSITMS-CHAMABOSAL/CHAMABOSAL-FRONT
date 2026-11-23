import { useMutation, useQueryClient } from "@tanstack/react-query";

import { certificationQueries } from "@/entities/certification";
import { roomQueries } from "@/entities/room";
import { sessionQueries } from "@/entities/session";

import { closeRoom } from "../api/potDecisionApi";

/** 방을 닫아요. 방 나가기처럼 닫은 방의 캐시는 버리고, 방 목록이 바뀌니 내 정보를 다시 받아요. */
export const useCloseRoom = (roomId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => closeRoom(roomId),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: roomQueries.today(roomId).queryKey });
      queryClient.removeQueries({ queryKey: certificationQueries.calendars(roomId) });
      await queryClient.refetchQueries({ queryKey: sessionQueries.me().queryKey });
    },
  });
};
