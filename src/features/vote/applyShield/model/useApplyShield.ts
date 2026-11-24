import { useMutation, useQueryClient } from "@tanstack/react-query";

import { itemQueries } from "@/entities/item";
import { voteQueries } from "@/entities/vote";
import { isApiError } from "@/shared/api";

import { applyDefense } from "../api/defenseApi";
import { SHIELD_USABLE_MINUTES } from "../config/shield";

// 🔖 실패 문구는 시안이 없어 임시예요. 2분 초과만 시안의 툴팁 문구를 써요.
export const getShieldErrorMessage = (error: unknown) => {
  if (isApiError(error, "DEFENSE_009"))
    return `아이템을 사용할 수 있는 ${SHIELD_USABLE_MINUTES}분이 지났어요`;
  if (isApiError(error, "DEFENSE_002")) return "보유한 방어권이 없어요";
  if (isApiError(error, "DEFENSE_010")) return "목탁 수행을 마쳐서 방어권을 쓸 수 없어요";
  if (isApiError(error, "DEFENSE_011")) return "인증하지 않은 회차라 방어권을 쓸 수 없어요";
  return "방어권을 쓰지 못했어요. 잠시 후 다시 시도해 주세요";
};

/**
 * 이마 방어권을 써요. 성공하면 결과가 방어(DEFENDED)로 바뀌어서 결과와 곳간 방어권을 다시 받아요.
 * 실패해도 결과를 다시 받아 버튼 상태를 서버에 맞춰요.
 */
export const useApplyShield = (roundId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => applyDefense(roundId),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: voteQueries.result(roundId).queryKey });
      void queryClient.invalidateQueries({ queryKey: itemQueries.store().queryKey });
    },
  });
};
