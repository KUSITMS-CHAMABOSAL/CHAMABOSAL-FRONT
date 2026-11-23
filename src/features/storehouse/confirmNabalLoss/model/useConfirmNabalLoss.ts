import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sessionQueries } from "@/entities/session";

import { confirmNabalLossSeen } from "../api/nabalApi";

/**
 * 나발 빠짐 안내를 봤다고 저장해요. 끝나면 성공하든 실패하든 내 정보를 다시 받아요.
 * 실패하면 서버에 '안 봄'이 남아 다음 앱 진입 때 안내가 한 번 더 떠요.
 */
export const useConfirmNabalLoss = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: confirmNabalLossSeen,
    onSettled: () => queryClient.invalidateQueries({ queryKey: sessionQueries.me().queryKey }),
  });
};
