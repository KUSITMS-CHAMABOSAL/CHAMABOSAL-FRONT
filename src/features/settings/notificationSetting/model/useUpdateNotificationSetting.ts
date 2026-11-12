import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sessionQueries } from "@/entities/session";

import { updateMySettings } from "../api/settingsApi";
import type { NotificationSettingKey } from "./types";

interface UpdateVariables {
  key: NotificationSettingKey;
  enabled: boolean;
}

/** 알림 설정을 바꿔요. 스위치는 누르는 즉시 바뀌고, 실패하면 되돌려요. */
export const useUpdateNotificationSetting = () => {
  const queryClient = useQueryClient();
  const { queryKey } = sessionQueries.me();

  return useMutation({
    mutationFn: ({ key, enabled }: UpdateVariables) => updateMySettings({ [key]: enabled }),
    onMutate: async ({ key, enabled }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, me => me && { ...me, [key]: enabled });
      return { previous };
    },
    onError: (_error, _variables, context) => queryClient.setQueryData(queryKey, context?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
};
