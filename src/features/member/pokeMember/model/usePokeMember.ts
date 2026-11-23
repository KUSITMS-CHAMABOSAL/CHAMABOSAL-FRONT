import { useCallback, useEffect, useRef } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { roomQueries } from "@/entities/room";
import { isApiError } from "@/shared/api";

import { createPoke, MAX_POKES_PER_REQUEST } from "../api/pokeApi";

/** 연타를 모아 보내는 시간이에요. API 문서 "화면에서 1~2초 모아 횟수로 보내고" */
const BATCH_MS = 1500;

// 🔖 실패 문구는 시안이 없어 임시예요.
const getPokeErrorMessage = (error: unknown) => {
  if (isApiError(error, "POKE_002")) return "지금은 인증 시간이 아니라 콕 찌를 수 없어요";
  if (isApiError(error, "POKE_003")) return "이미 인증한 보살이에요";
  if (isApiError(error, "ROOM_009")) return "방을 떠난 보살이에요";
  return "콕 찌르지 못했어요. 잠시 후 다시 시도해 주세요";
};

/**
 * 콕 찌르기예요. 누를 때마다 요청하지 않고 멤버별로 1.5초 모아 횟수로 보내요.
 * 화면을 떠나면 남은 횟수를 바로 보내요.
 * 인증 시간이 끝났거나, 받는 사람이 인증했거나 나갔다고 거절되면 오늘 탭을 다시 받아 카드를 바꿔요.
 */
export const usePokeMember = (roomId: number, onError: (message: string) => void) => {
  const queryClient = useQueryClient();
  const pending = useRef(new Map<number, number>());
  const timer = useRef<number | undefined>(undefined);
  const { mutate } = useMutation({
    mutationFn: ({ memberId, count }: { memberId: number; count: number }) =>
      createPoke(roomId, memberId, count),
    onError: error => {
      if (isApiError(error, "POKE_002", "POKE_003", "ROOM_009"))
        void queryClient.invalidateQueries({ queryKey: roomQueries.today(roomId).queryKey });
      onError(getPokeErrorMessage(error));
    },
  });

  const flush = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = undefined;
    pending.current.forEach((count, memberId) => {
      for (let left = count; left > 0; left -= MAX_POKES_PER_REQUEST)
        mutate({ memberId, count: Math.min(left, MAX_POKES_PER_REQUEST) });
    });
    pending.current.clear();
  }, [mutate]);

  useEffect(() => flush, [flush]);

  return useCallback(
    (memberId: number) => {
      pending.current.set(memberId, (pending.current.get(memberId) ?? 0) + 1);
      timer.current ??= window.setTimeout(flush, BATCH_MS);
    },
    [flush],
  );
};
