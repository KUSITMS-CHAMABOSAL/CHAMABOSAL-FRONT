import { useMutation, useQueryClient } from "@tanstack/react-query";

import { itemQueries } from "@/entities/item";
import { roomQueries } from "@/entities/room";
import { sessionQueries } from "@/entities/session";

import { saveEquippedItems } from "../api/equipApi";

/**
 * 곳간에서 입어 본 마지막 착용 목록을 저장해요. API 문서대로 입어 보는 동안에는 보내지 않고 한 번에 보내요.
 * 보내는 즉시 곳간·내 정보 캐시를 새 착용으로 바꿔요. 응답 전에 탭을 옮기거나 곳간에 돌아와도 옛 착용이 보이지 않아요.
 * 끝나면 곳간·내 정보·오늘 탭을 다시 받아 서버 값으로 맞춰요. 실패해도 다시 받아 되돌아가요.
 */
export const useSaveEquippedItems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveEquippedItems,
    onMutate: async itemIds => {
      const storeKey = itemQueries.store().queryKey;
      const meKey = sessionQueries.me().queryKey;
      // 진행 중인 다시 받기가 끝나며 바꾼 캐시를 덮어쓰지 않게 멈춰요.
      await Promise.all([
        queryClient.cancelQueries({ queryKey: storeKey }),
        queryClient.cancelQueries({ queryKey: meKey }),
      ]);
      const store = queryClient.setQueryData(
        storeKey,
        prev =>
          prev && {
            ...prev,
            items: prev.items.map(item => ({ ...item, isEquipped: itemIds.includes(item.itemId) })),
          },
      );
      if (!store) return;
      const codes = store.items.filter(item => item.isEquipped).map(item => item.code);
      queryClient.setQueryData(meKey, prev => prev && { ...prev, equippedItemCodes: codes });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: itemQueries.store().queryKey });
      void queryClient.invalidateQueries({ queryKey: sessionQueries.me().queryKey });
      void queryClient.invalidateQueries({ queryKey: roomQueries.all() });
    },
  });
};
