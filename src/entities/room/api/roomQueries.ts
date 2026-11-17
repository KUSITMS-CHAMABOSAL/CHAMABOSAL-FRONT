import { queryOptions } from "@tanstack/react-query";

import { getInvitePreview, getToday } from "./roomApi";

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
};
