import { useMutation, useQueryClient } from "@tanstack/react-query";

import { roomQueries, type TodayResponse } from "@/entities/room";
import type { ReactionType } from "@/shared/types";

import { deleteMyReaction, putMyReaction } from "../api/reactionApi";

interface ReactVariables {
  certificationId: number;
  /** null이면 리액션 취소예요. */
  reaction: ReactionType | null;
}

const setMyReaction = (
  today: TodayResponse | undefined,
  { certificationId, reaction }: ReactVariables,
) =>
  today && {
    ...today,
    members: today.members.map(member =>
      member.certification?.certificationId === certificationId
        ? { ...member, certification: { ...member.certification, myReaction: reaction } }
        : member,
    ),
  };

/** 인증에 리액션을 남기거나 바꾸거나 취소해요. 누르는 즉시 화면에 반영하고, 실패하면 되돌려요. */
export const useReactCertification = (roomId: number) => {
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
    onError: (_error, _variables, context) => queryClient.setQueryData(queryKey, context?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
};
