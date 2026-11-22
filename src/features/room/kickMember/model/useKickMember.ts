import { useMutation, useQueryClient } from "@tanstack/react-query";

import { roomQueries } from "@/entities/room";
import { voteQueries } from "@/entities/vote";

import { kickMember } from "../api/kickMemberApi";

/**
 * 멤버를 내보내요. 끝나면 성공하든 실패하든 오늘 탭을 다시 받아요.
 * 실패도 이미 나간 멤버(ROOM_009)나 바뀐 방장(ROOM_007)처럼 목록이 달라졌다는 뜻일 때가 많아요.
 * 남은 멤버가 모두 인증한 상태가 되면 서버가 바로 투표를 시작해서 투표 탭도 다시 받아요.
 */
export const useKickMember = (roomId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: number) => kickMember(roomId, memberId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: voteQueries.all() }),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: roomQueries.today(roomId).queryKey }),
  });
};
