import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sessionQueries } from "@/entities/session";

import { createRoom } from "../api/createRoomApi";

/** 방을 만들어요. 내 방 목록이 바뀌어서 내 정보를 다시 받아요. */
export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRoom,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionQueries.me().queryKey }),
  });
};
