import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ITEM_EQUIP_SCOPE, itemQueries } from "@/entities/item";
import { roomQueries } from "@/entities/room";
import { sessionQueries } from "@/entities/session";
import { useTabBarToast } from "@/shared/lib";

import { saveEquippedItems } from "../api/equipApi";

/**
 * 곳간에서 입어 본 마지막 착용 아이템 코드를 저장해요. API 문서대로 입어 보는 동안에는 보내지 않고 한 번에 보내요.
 * 보내는 즉시 곳간·내 정보 캐시를 새 착용으로 바꿔요. 응답 전에 탭을 옮기거나 곳간에 돌아와도 옛 착용이 보이지 않아요.
 * 끝나면 곳간·내 정보·오늘 탭을 다시 받아 서버 값으로 맞춰요. 실패해도 다시 받아 되돌아가요.
 */
export const useSaveEquippedItems = () => {
  const queryClient = useQueryClient();
  const openToast = useTabBarToast();
  return useMutation({
    // 착용 목록을 통째로 바꾸는 API라, 곳간을 빠르게 드나들거나 구매 중이어도 순서대로 하나씩 보내요.
    scope: ITEM_EQUIP_SCOPE,
    mutationFn: async (codes: readonly string[]) => {
      // 앞선 구매가 끝난 뒤에 실행돼요. 그때 보유한 아이템만 보내서, 실패한 구매는 빠져요.
      const store = await queryClient.ensureQueryData(itemQueries.store());
      return saveEquippedItems(
        store.items
          .filter(item => item.isOwned && codes.includes(item.code))
          .map(item => item.itemId),
      );
    },
    onMutate: async codes => {
      const storeKey = itemQueries.store().queryKey;
      const meKey = sessionQueries.me().queryKey;
      // 진행 중인 다시 받기가 끝나며 바꾼 캐시를 덮어쓰지 않게 멈춰요.
      await Promise.all([
        queryClient.cancelQueries({ queryKey: storeKey }),
        queryClient.cancelQueries({ queryKey: meKey }),
      ]);
      queryClient.setQueryData(
        storeKey,
        prev =>
          prev && {
            ...prev,
            items: prev.items.map(item => ({ ...item, isEquipped: codes.includes(item.code) })),
          },
      );
      queryClient.setQueryData(meKey, prev => prev && { ...prev, equippedItemCodes: [...codes] });
    },
    // 곳간을 떠난 뒤에 실패해서 mutate의 콜백은 불리지 않아요. 훅에서 알려요.
    // 재시도는 하지 않아요. 곳간 캐시는 비워서, 다시 들어오면 미리 바꾼 착용 대신 서버 착용으로 시작해요.
    // 떠나 있는 동안 곳간 조회는 쓰는 화면이 없어 무효화만으로는 다시 받지 않아요.
    onError: () => {
      openToast("착용을 저장하지 못했어요. 다시 입혀 주세요");
      void queryClient.resetQueries({ queryKey: itemQueries.store().queryKey });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: itemQueries.store().queryKey });
      void queryClient.invalidateQueries({ queryKey: sessionQueries.me().queryKey });
      void queryClient.invalidateQueries({ queryKey: roomQueries.all() });
    },
  });
};
