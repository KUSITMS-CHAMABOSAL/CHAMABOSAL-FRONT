import { useMutation, useQueryClient } from "@tanstack/react-query";

import { roomQueries, type TodayResponse } from "@/entities/room";
import { isApiError } from "@/shared/api";
import type { ReactionType } from "@/shared/types";

import { deleteMyReaction, putMyReaction } from "../api/reactionApi";

interface ReactVariables {
  certificationId: number;
  /** null이면 리액션 취소예요. */
  reaction: ReactionType | null;
}

const COUNT_KEY = { GOOD: "goodCount", BAD: "badCount" } as const;

/** 내 리액션을 바꾸고, 빠진 쪽 수는 1 줄이고 고른 쪽 수는 1 늘려요. */
const setMyReaction = (
  today: TodayResponse | undefined,
  { certificationId, reaction }: ReactVariables,
) =>
  today && {
    ...today,
    members: today.members.map(member => {
      const { certification } = member;
      if (certification?.certificationId !== certificationId) return member;
      const next = { ...certification, myReaction: reaction };
      if (certification.myReaction) next[COUNT_KEY[certification.myReaction]] -= 1;
      if (reaction) next[COUNT_KEY[reaction]] += 1;
      return { ...member, certification: next };
    }),
  };

// 🔖 실패 문구는 시안이 없어 임시예요.
const getReactErrorMessage = (error: unknown) =>
  isApiError(error, "REACT_002")
    ? "투표가 시작돼서 리액션을 바꿀 수 없어요"
    : "리액션을 남기지 못했어요";

/**
 * 인증에 리액션을 남기거나 바꾸거나 취소해요. 누르는 즉시 화면에 반영하고, 실패하면 되돌려요.
 * 인증이 속한 회차가 인증 중일 때만 돼요. 투표가 시작되면 서버가 거절해요(REACT_002).
 */
export const useReactCertification = (roomId: number, onError: (message: string) => void) => {
  const queryClient = useQueryClient();
  const { queryKey } = roomQueries.today(roomId);

  return useMutation({
    mutationFn: ({ certificationId, reaction }: ReactVariables) =>
      reaction ? putMyReaction(certificationId, reaction) : deleteMyReaction(certificationId),
    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, setMyReaction(previous, variables));
      return { previous };
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      onError(getReactErrorMessage(error));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
};
