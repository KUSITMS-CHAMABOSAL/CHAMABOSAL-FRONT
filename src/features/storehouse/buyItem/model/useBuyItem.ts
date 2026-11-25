import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ITEM_EQUIP_SCOPE, itemQueries } from "@/entities/item";
import { roomQueries } from "@/entities/room";
import { sessionQueries } from "@/entities/session";

import { purchaseDefenseTicket, purchaseItem } from "../api/purchaseApi";

/**
 * 꾸미기 아이템을 사요. 사면 서버가 바로 입혀요(같은 슬롯 아이템은 벗어요).
 * 곳간은 응답으로 바로 바꾸고, 착용이 보이는 내 정보와 오늘 탭은 다시 받아요.
 */
export const useBuyItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // 구매 중에 곳간을 떠나도, 떠날 때의 착용 저장이 구매가 끝난 뒤에 나가요.
    scope: ITEM_EQUIP_SCOPE,
    mutationFn: purchaseItem,
    onSuccess: ({ riceBalance, equippedItemIds }, itemId) => {
      queryClient.setQueryData(
        itemQueries.store().queryKey,
        store =>
          store && {
            ...store,
            riceBalance,
            items: store.items.map(item => ({
              ...item,
              isOwned: item.isOwned || item.itemId === itemId,
              isEquipped: equippedItemIds.includes(item.itemId),
            })),
          },
      );
      void queryClient.invalidateQueries({ queryKey: sessionQueries.me().queryKey });
      void queryClient.invalidateQueries({ queryKey: roomQueries.all() });
    },
  });
};

/** 이마 방어권을 사요. */
export const useBuyDefenseTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: purchaseDefenseTicket,
    onSuccess: ({ riceBalance }) =>
      queryClient.setQueryData(
        itemQueries.store().queryKey,
        store =>
          store && {
            ...store,
            riceBalance,
            // 구매 응답에는 개수가 없어 하나 늘려요. 다음에 곳간을 다시 받으면 서버 값으로 맞춰져요.
            defenseTicket: {
              ...store.defenseTicket,
              status: "OWNED" as const,
              count: store.defenseTicket.count + 1,
            },
          },
      ),
  });
};
