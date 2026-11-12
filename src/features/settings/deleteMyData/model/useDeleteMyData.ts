import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteMe } from "../api/userApi";

/** 내 데이터를 지워요. 남은 캐시가 모두 지운 사용자 것이라 통째로 비워요. */
export const useDeleteMyData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMe,
    onSuccess: () => queryClient.clear(),
  });
};
