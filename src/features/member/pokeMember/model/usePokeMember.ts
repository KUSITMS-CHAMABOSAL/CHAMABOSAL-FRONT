import { useCallback, useEffect, useRef } from "react";

import { useMutation } from "@tanstack/react-query";

import { createPoke, MAX_POKES_PER_REQUEST } from "../api/pokeApi";

/** 연타를 모아 보내는 시간이에요. API 문서 "화면에서 1~2초 모아 횟수로 보내고" */
const BATCH_MS = 1500;

/**
 * 콕 찌르기예요. 누를 때마다 요청하지 않고 멤버별로 1.5초 모아 횟수로 보내요.
 * 화면을 떠나면 남은 횟수를 바로 보내요.
 */
export const usePokeMember = (roomId: number, onError: () => void) => {
  const pending = useRef(new Map<number, number>());
  const timer = useRef<number | undefined>(undefined);
  const { mutate } = useMutation({
    mutationFn: ({ memberId, count }: { memberId: number; count: number }) =>
      createPoke(roomId, memberId, count),
    onError,
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
