import { queryOptions, replaceEqualDeep } from "@tanstack/react-query";

import { keepTodayImageUrls } from "../lib/keepImageUrls";
import type { TodayResponse } from "../model/types";

import {
  getInvitePreview,
  getLeavePreview,
  getNewColor,
  getPotCelebration,
  getToday,
} from "./roomApi";

export const roomQueries = {
  all: () => ["room"] as const,
  today: (roomId: number) =>
    queryOptions({
      queryKey: [...roomQueries.all(), roomId, "today"],
      queryFn: () => getToday(roomId),
      // 다시 받아도 인증 사진 주소가 바뀌지 않게 해요. 나머지는 기본처럼 바뀐 부분만 새 객체로 바꿔요.
      structuralSharing: (prev, next) =>
        replaceEqualDeep(
          prev,
          keepTodayImageUrls(prev as TodayResponse | undefined, next as TodayResponse),
        ),
    }),
  /** 다 채운 솥은 바뀌지 않아요. */
  pot: (roomId: number, seq: number) =>
    queryOptions({
      queryKey: [...roomQueries.all(), roomId, "pot", seq],
      queryFn: () => getPotCelebration(roomId, seq),
      staleTime: Infinity,
    }),
  invitePreview: (token: string) =>
    queryOptions({
      queryKey: [...roomQueries.all(), "invite", token],
      queryFn: () => getInvitePreview(token),
      // 참여한 뒤 뒤로가기로 다시 오면 남은 "참여 가능" 결과 대신 새로 물어봐요.
      gcTime: 0,
    }),
  leavePreview: (roomId: number) =>
    queryOptions({
      queryKey: [...roomQueries.all(), roomId, "leave-preview"],
      queryFn: () => getLeavePreview(roomId),
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
