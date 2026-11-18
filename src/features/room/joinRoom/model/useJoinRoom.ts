import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sessionQueries } from "@/entities/session";

import { joinRoom } from "../api/joinRoomApi";

/** 초대받은 방에 들어가요. 내 방 목록이 바뀌어서 내 정보를 다시 받아요. */
export const useJoinRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinRoom,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionQueries.me().queryKey }),
  });
};
