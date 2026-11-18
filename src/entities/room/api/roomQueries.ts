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
    }),
  /** 부를 때마다 새 색이 나와서, 방을 만들 때까지 다시 뽑지 않아요. */
  newColor: () =>
    queryOptions({
      queryKey: [...roomQueries.all(), "new-color"],
      queryFn: getNewColor,
      staleTime: Infinity,
    }),
};
