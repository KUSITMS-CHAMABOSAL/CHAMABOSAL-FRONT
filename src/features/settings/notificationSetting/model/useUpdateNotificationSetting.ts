import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sessionQueries } from "@/entities/session";

import { updateMySettings } from "../api/settingsApi";
import type { NotificationSettingKey } from "./types";

interface UpdateVariables {
  key: NotificationSettingKey;
  enabled: boolean;
}

/**
 * 알림 설정을 바꿔요. 스위치는 누르는 즉시 바뀌고, 실패하면 되돌려요.
 * 되돌릴 때는 바꾼 설정 하나만 되돌려서, 그사이 바뀐 다른 스위치나 닉네임은 그대로 둬요.
 */
export const useUpdateNotificationSetting = () => {
  const queryClient = useQueryClient();
  const { queryKey } = sessionQueries.me();

  return useMutation({
    mutationFn: ({ key, enabled }: UpdateVariables) => updateMySettings({ [key]: enabled }),
    onMutate: async ({ key, enabled }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey)?.[key];
      queryClient.setQueryData(queryKey, me => me && { ...me, [key]: enabled });
      return { previous };
    },
    onError: (_error, { key }, context) => {
      const previous = context?.previous;
      if (previous === undefined) return;
      queryClient.setQueryData(queryKey, me => me && { ...me, [key]: previous });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
};
