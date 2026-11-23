import { useMutation, useQueryClient } from "@tanstack/react-query";

import { itemQueries } from "@/entities/item";
import { roomQueries } from "@/entities/room";
import { sessionQueries } from "@/entities/session";

import { saveEquippedItems } from "../api/equipApi";

/**
 * 곳간에서 입어 본 마지막 착용 목록을 저장해요. API 문서대로 입어 보는 동안에는 보내지 않고 한 번에 보내요.
 * 곳간을 떠난 뒤에 끝나도 곳간·내 정보·오늘 탭을 다시 받아 착용이 맞춰져요.
 */
export const useSaveEquippedItems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveEquippedItems,
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: itemQueries.store().queryKey });
      void queryClient.invalidateQueries({ queryKey: sessionQueries.me().queryKey });
      void queryClient.invalidateQueries({ queryKey: roomQueries.all() });
    },
  });
};
