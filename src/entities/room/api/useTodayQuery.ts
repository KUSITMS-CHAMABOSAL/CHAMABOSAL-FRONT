import { useQuery } from "@tanstack/react-query";

import { roomQueries } from "./roomQueries";

/** 방 홈(오늘 탭) 데이터예요. 방을 고르기 전에는 요청하지 않아요. */
export const useTodayQuery = (roomId: number | undefined) =>
  useQuery({ ...roomQueries.today(roomId ?? 0), enabled: roomId !== undefined });
