import { queryOptions } from "@tanstack/react-query";

import { getInvitePreview, getNewColor, getToday } from "./roomApi";

export const roomQueries = {
  all: () => ["room"] as const,
  today: (roomId: number) =>
    queryOptions({
      queryKey: [...roomQueries.all(), roomId, "today"],
      queryFn: () => getToday(roomId),
    }),
  invitePreview: (token: string) =>
    queryOptions({
      queryKey: [...roomQueries.all(), "invite", token],
      queryFn: () => getInvitePreview(token),
      // 참여한 뒤 뒤로가기로 다시 오면 남은 "참여 가능" 결과 대신 새로 물어봐요.
      gcTime: 0,
    }),
  /** 부를 때마다 새 색이 나와요. 방 만들기 화면에 있는 동안은 다시 뽑지 않고, 떠나면 버려서 다음 방은 새로 뽑아요. */
  newColor: () =>
    queryOptions({
      queryKey: [...roomQueries.all(), "new-color"],
      queryFn: getNewColor,
      staleTime: Infinity,
      gcTime: 0,
    }),
};
