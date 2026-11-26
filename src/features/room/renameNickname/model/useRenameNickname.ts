import { useMutation, useQueryClient } from "@tanstack/react-query";

import { roomQueries } from "@/entities/room";
import { sessionQueries } from "@/entities/session";
import { isApiError } from "@/shared/api";

import { updateMyNickname } from "../api/nicknameApi";

/**
 * 방 닉네임을 바꿔요. 닉네임은 내 정보의 방 목록과 오늘 탭에 있어서 둘 다 다시 받아요.
 * 투표 중이라 거절되면(ROOM_012) 오늘 탭을 다시 받아, 다음에 [닉네임 수정]을 누르면 바로 투표 중이라고 알려요.
 */
export const useRenameNickname = (roomId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nickname: string) => updateMyNickname(roomId, nickname),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: sessionQueries.me().queryKey }),
        queryClient.invalidateQueries({ queryKey: roomQueries.today(roomId).queryKey }),
      ]),
    onError: error => {
      if (isApiError(error, "ROOM_012"))
        void queryClient.invalidateQueries({ queryKey: roomQueries.today(roomId).queryKey });
    },
  });
};
