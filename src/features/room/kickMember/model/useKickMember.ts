import { useMutation, useQueryClient } from "@tanstack/react-query";

import { roomQueries } from "@/entities/room";

import { kickMember } from "../api/kickMemberApi";

/** 멤버를 내보내요. 멤버 목록과 인원이 바뀌니 오늘 탭을 다시 받아요. */
export const useKickMember = (roomId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: number) => kickMember(roomId, memberId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: roomQueries.today(roomId).queryKey }),
  });
};
