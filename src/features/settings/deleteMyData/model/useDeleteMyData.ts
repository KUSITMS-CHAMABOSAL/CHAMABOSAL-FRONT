import { useNavigate } from "react-router";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { paths } from "@/shared/config";

import { deleteMe } from "../api/userApi";

/**
 * 내 데이터를 지워요. 남은 캐시가 모두 지운 사용자 것이라 통째로 비우고 진입 분기로 가요.
 * 이동을 `mutate` 호출 콜백이 아니라 여기에 둬서, 요청 중에 화면을 벗어나도 이동이 빠지지 않아요.
 */
export const useDeleteMyData = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: deleteMe,
    onSuccess: () => {
      queryClient.clear();
      void navigate(paths.root, { replace: true });
    },
  });
};
