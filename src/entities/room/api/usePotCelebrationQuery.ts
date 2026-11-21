import { useQuery } from "@tanstack/react-query";

import { roomQueries } from "./roomQueries";

/** 다 채운 솥의 축하 화면 데이터예요. */
export const usePotCelebrationQuery = (roomId: number, seq: number) =>
  useQuery(roomQueries.pot(roomId, seq));
