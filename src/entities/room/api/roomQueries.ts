import { queryOptions } from "@tanstack/react-query";

import { getToday } from "./roomApi";

export const roomQueries = {
  all: () => ["room"] as const,
  today: (roomId: number) =>
    queryOptions({
      queryKey: [...roomQueries.all(), roomId, "today"],
      queryFn: () => getToday(roomId),
    }),
};
