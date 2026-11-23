import { useMemo } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { itemQueries, useStoreQuery } from "@/entities/item";
import { sessionQueries, useMeQuery } from "@/entities/session";
import { isApiError } from "@/shared/api";

import { replantNabal } from "../api/nabalApi";

export type PlantResult = "planted" | "notEnoughRice" | "notEmpty" | "failed";

const NO_FALLEN: readonly number[] = [];

/**
 * 곳간과 나발 심기 화면이 같은 나발·공양미 상태를 봐요.
 * 빠진 나발은 내 정보(`nabal.fallenNumbers`), 공양미는 곳간 조회(`riceBalance`)예요.
 */
export const useHairPlanting = () => {
  const queryClient = useQueryClient();
  const fallen = useMeQuery().data?.nabal.fallenNumbers ?? NO_FALLEN;
  // 그릴 때마다 새 Set이면 memo로 감싼 보살 그림이 매번 다시 그려져요.
  const plucked = useMemo<ReadonlySet<number>>(() => new Set(fallen), [fallen]);
  const rice = useStoreQuery().data?.riceBalance ?? 0;
  const { mutateAsync } = useMutation({
    mutationFn: replantNabal,
    onSuccess: ({ fallenNumbers, riceBalance }) => {
      // 심은 자리가 바로 채워지게 응답으로 먼저 바꾸고, 나머지 값은 다시 받아요.
      queryClient.setQueryData(
        sessionQueries.me().queryKey,
        me => me && { ...me, nabal: { ...me.nabal, fallenNumbers } },
      );
      queryClient.setQueryData(
        itemQueries.store().queryKey,
        store => store && { ...store, riceBalance },
      );
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: sessionQueries.me().queryKey });
      void queryClient.invalidateQueries({ queryKey: itemQueries.store().queryKey });
    },
  });

  const plant = async (index: number): Promise<PlantResult> => {
    try {
      await mutateAsync([index]);
      return "planted";
    } catch (error) {
      if (isApiError(error, "NABAL_001")) return "notEmpty";
      if (isApiError(error, "STORE_001")) return "notEnoughRice";
      return "failed";
    }
  };

  return { plucked, rice, plant };
};
