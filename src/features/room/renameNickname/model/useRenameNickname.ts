import { useMutation, useQueryClient } from "@tanstack/react-query";

import { roomQueries } from "@/entities/room";
import { sessionQueries } from "@/entities/session";

import { updateMyNickname } from "../api/nicknameApi";

/** 방 닉네임을 바꿔요. 닉네임은 내 정보의 방 목록과 오늘 탭에 있어서 둘 다 다시 받아요. */
export const useRenameNickname = (roomId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nickname: string) => updateMyNickname(roomId, nickname),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: sessionQueries.me().queryKey }),
        queryClient.invalidateQueries({ queryKey: roomQueries.today(roomId).queryKey }),
      ]),
  });
};
