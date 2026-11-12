import { useMutation, useQueryClient } from "@tanstack/react-query";

import { certificationQueries } from "@/entities/certification";
import { roomQueries } from "@/entities/room";
import { sessionQueries } from "@/entities/session";

import { leaveRoom } from "../api/leaveRoomApi";

/** 방에서 나가요. 나간 방의 오늘 탭과 캘린더 캐시는 버리고, 방 목록이 바뀌니 내 정보를 다시 받아요. */
export const useLeaveRoom = (roomId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => leaveRoom(roomId),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: roomQueries.today(roomId).queryKey });
      queryClient.removeQueries({ queryKey: certificationQueries.calendars(roomId) });
      await queryClient.refetchQueries({ queryKey: sessionQueries.me().queryKey });
    },
  });
};
